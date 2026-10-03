import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import type { DangerDSLType, Rule } from "@ire-mudlet-mapping/crowdmap-danger/Rule";

const results = { failures: [] as string[], messages: [] as string[], warnings: [] as string[] };
Object.assign(globalThis, {
  fail: (text: string) => results.failures.push(text),
  message: (text: string) => results.messages.push(text),
  warn: (text: string) => results.warnings.push(text),
});

process.env.CROWDMAP_ROOT ??= fileURLToPath(new URL("../../../../", import.meta.url));

const [
  { createRoomMarkRules },
  { createDisallowStockroomsRule },
  { createDisallowUnlockedWormholesRule },
  { createDisallowWingsExitsRule },
] = await Promise.all([
  import("../rules/CheckRoomMarks.ts"),
  import("../rules/DisallowStockrooms.ts"),
  import("../rules/DisallowUnlockedWormholes.ts"),
  import("../rules/DisallowWingsExits.ts"),
]);

function mapFixture(name: string) {
  return JSON.parse(readFileSync(new URL(`./maps/${name}.json`, import.meta.url), "utf8"));
}

function danger() {
  return {
    git: { fileMatch: () => ({ modified: true }) },
  } as unknown as DangerDSLType;
}

async function check(rule: Rule) {
  results.failures.length = results.messages.length = results.warnings.length = 0;
  await rule.check(danger());
  return results;
}

test("rejects shops with stockrooms", async () => {
  const maps = mapFixture("stockrooms");
  assert.equal((await check(createDisallowStockroomsRule(maps.valid))).messages.length, 1);
  assert.match((await check(createDisallowStockroomsRule(maps.invalid))).failures[0], /stockrooms: 1/);
});

test("rejects unlocked wormholes", async () => {
  const maps = mapFixture("wormholes");
  assert.equal((await check(createDisallowUnlockedWormholesRule(maps.locked))).messages.length, 1);
  assert.match((await check(createDisallowUnlockedWormholesRule(maps.unlocked))).failures[0], /unlocked wormholes/);
});

test("rejects Wings exits", async () => {
  const maps = mapFixture("wings-exits");
  assert.equal((await check(createDisallowWingsExitsRule(maps.valid))).messages.length, 1);
  assert.match((await check(createDisallowWingsExitsRule(maps.invalid))).failures[0], /wings exits: 1/);
});

test("detects missing, extra, and moved room marks", async () => {
  const maps = mapFixture("room-marks");
  for (const rule of Object.values(createRoomMarkRules(maps.valid, maps.allowed))) {
    assert.equal((await check(rule)).messages.length, 1);
  }
  assert.match((await check(createRoomMarkRules(maps.missing, maps.allowed).roomMarksNotFoundRule)).failures[0], /bank/);
  assert.match((await check(createRoomMarkRules(maps.extra, maps.allowed).roomMarksExtraRule)).failures[0], /shop/);
  assert.match((await check(createRoomMarkRules(maps.moved, maps.allowed).roomMarksMovedRule)).failures[0], /home \(from 10 to 11\)/);
});
