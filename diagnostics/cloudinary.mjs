import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const cloud = process.env.CLOUDINARY_NAME;
const key = process.env.CLOUDINARY_KEY;
const secret = process.env.CLOUDINARY_SECRET;
const redact = value => {
  let text = String(value ?? '');
  for (const value of [secret, key, cloud].filter(Boolean)) {
    text = text.split(value).join('[REDACTED]');
  }
  return text.slice(0, 1200);
};
const report = (label, value) => console.log(label, redact(JSON.stringify(value)));
report('credential-shape', Object.fromEntries(Object.entries({cloud, key, secret}).map(([name, value]) => [name, {
  present: Boolean(value), surroundingWhitespace: value !== value?.trim(),
  containsLineBreak: /[\r\n]/.test(value ?? ''),
}])));
if (![cloud, key, secret].every(Boolean)) throw new Error('A required credential is missing');
const api = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}`;
const signature = parameters => createHash('sha1').update(Object.keys(parameters).sort().map(name => `${name}=${parameters[name]}`).join('&') + secret).digest('hex');
const created = [];

async function request(label, path, options = {}) {
  const response = await fetch(`${api}${path}`, {...options, redirect: 'error', signal: AbortSignal.timeout(20000)});
  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { /* Non-JSON responses are diagnostic evidence. */ }
  const headers = Object.fromEntries(['content-type', 'server', 'x-cld-error', 'x-request-id', 'x-cld-request-id', 'cf-ray'].map(name => [name, response.headers.get(name)]).filter(([, value]) => value));
  report(label, {
    status: response.status,
    headers,
    error: json?.error ?? (json ? undefined : text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 500)),
    result: json && !json.error ? {status: json.status, result: json.result, format: json.format, bytes: json.bytes} : undefined,
  });
  return {response, json};
}

async function restUpload(label, mime, data, resourceType = 'image', folder) {
  const public_id = `codex-cloudinary-diagnostic-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}-${label}`;
  const parameters = {public_id, timestamp: String(Math.floor(Date.now() / 1000))};
  if (folder) parameters.folder = folder;
  const form = new FormData();
  for (const [name, value] of Object.entries(parameters)) form.set(name, value);
  form.set('api_key', key);
  form.set('signature', signature(parameters));
  form.set('file', new Blob([data], {type: mime}), `diagnostic.${mime === 'image/png' ? 'png' : 'svg'}`);
  const {response, json} = await request(label, `/${resourceType}/upload`, {method: 'POST', body: form});
  if (response.ok && json?.public_id) created.push({id: json.public_id, type: json.resource_type});
}

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1sAAAAASUVORK5CYII=', 'base64');
const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="blue"/></svg>');

try {
  await request('authenticated-admin-ping', '/ping', {headers: {Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`}});
  await restUpload('rest-png-image', 'image/png', png);
  await restUpload('rest-svg-image', 'image/svg+xml', svg);
  await restUpload('rest-svg-auto-folder', 'image/svg+xml', svg, 'auto', `mudlet map diff/${process.env.GITHUB_REPOSITORY}/diagnostic`);
  const require = createRequire(resolve(process.env.RUNNER_TEMP, 'cloudinary-diagnostic/package.json'));
  const cloudinary = require('cloudinary').v2;
  cloudinary.config({cloud_name: cloud, api_key: key, api_secret: secret});
  for (const [label, mime, data] of [['sdk-png', 'image/png', png], ['sdk-svg', 'image/svg+xml', svg]]) {
    try {
      const result = await cloudinary.uploader.upload(`data:${mime};base64,${data.toString('base64')}`, {
        resource_type: 'auto',
        public_id: `codex-cloudinary-diagnostic-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}-${label}`,
        folder: `mudlet map diff/${process.env.GITHUB_REPOSITORY}/diagnostic`,
        timeout: 20000,
      });
      created.push({id: result.public_id, type: result.resource_type});
      report(label, {success: true, format: result.format, bytes: result.bytes});
    } catch (error) {
      report(label, {success: false, error: {message: error.message, http_code: error.http_code, name: error.name}});
    }
  }
} finally {
  for (const asset of created) {
    if (!asset.id?.includes(`codex-cloudinary-diagnostic-${process.env.GITHUB_RUN_ID}-`) || !['image', 'raw', 'video'].includes(asset.type)) {
      throw new Error('Refusing cleanup of unexpected asset identifier');
    }
    const parameters = {public_id: asset.id, timestamp: String(Math.floor(Date.now() / 1000))};
    const body = new URLSearchParams({...parameters, api_key: key, signature: signature(parameters)});
    const result = await request('cleanup-created-asset', `/${asset.type}/destroy`, {method: 'POST', body});
    if (!result.response.ok || result.json?.result !== 'ok') process.exitCode = 1;
  }
  report('cleanup-summary', {created: created.length});
}
