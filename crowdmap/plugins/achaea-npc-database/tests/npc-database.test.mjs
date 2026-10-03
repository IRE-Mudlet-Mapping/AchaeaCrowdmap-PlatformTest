import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { validateNpcDatabase } from "../npc-database.mjs";

const plugin = new URL("..", import.meta.url).pathname;

test("validates the published Achaea NPC shape", () => {
  assert.equal(validateNpcDatabase([{ name: "a mhun guard", loc: 123 }]).length, 1);
  assert.throws(() => validateNpcDatabase([{ name: "", loc: 123 }]), /name/);
  assert.throws(() => validateNpcDatabase([{ name: "a mhun guard", loc: "123" }]), /loc/);
});

test("exercises after-export, before-publish, and after-publish commands", () => {
  const root = mkdtempSync(join(tmpdir(), "achaea-npcs-"));
  const publishMap = join(root, "website", "Map");
  const summary = join(root, "summary.md");
  const env = {
    ...process.env,
    CROWDMAP_ROOT: root,
    CROWDMAP_PUBLISH_DIR: "website",
    ACHAEA_NPC_SOURCE_URL: `data:application/json,${encodeURIComponent(JSON.stringify([{ name: "a mhun guard", loc: 123 }]))}`,
    GITHUB_STEP_SUMMARY: summary,
  };

  try {
    const update = spawnSync("node", [join(plugin, "scripts", "update-npcs.mjs")], { env, encoding: "utf8" });
    assert.equal(update.status, 0, update.stderr);
    mkdirSync(publishMap, { recursive: true });
    writeFileSync(join(publishMap, "denizen.json"), readFileSync(join(root, "Map", "denizen.json")));

    const validate = spawnSync("node", [join(plugin, "scripts", "validate-published-npcs.mjs")], { env, encoding: "utf8" });
    assert.equal(validate.status, 0, validate.stderr);
    const report = spawnSync("node", [join(plugin, "scripts", "report-published-npcs.mjs")], { env, encoding: "utf8" });
    assert.equal(report.status, 0, report.stderr);
    assert.match(readFileSync(summary, "utf8"), /Published 1 Achaea NPC locations/);
  } finally {
    rmSync(root, { recursive: true });
  }
});
