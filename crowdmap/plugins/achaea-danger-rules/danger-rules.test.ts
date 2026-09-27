import assert from "node:assert/strict";
import test from "node:test";
import * as rules from "./danger-rules.ts";

test("exports only Achaea-specific Danger rules", () => {
  assert.deepEqual(Object.keys(rules).sort(), [
    "disallowStockrooms",
    "disallowUnlockedWormholes",
    "disallowWingsExits",
    "roomMarksExtraRule",
    "roomMarksMovedRule",
    "roomMarksNotFoundRule",
  ]);
});
