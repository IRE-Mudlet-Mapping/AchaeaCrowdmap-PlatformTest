import assert from "node:assert/strict";
import test from "node:test";
import * as rules from "./danger-rules.ts";

test("exports the Achaea-specific Danger rules", () => {
  assert.equal(Object.keys(rules).length, 6);
});
