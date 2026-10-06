import { readFileSync } from "node:fs";

export function validateNpcDatabase(value, source = "NPC database") {
  if (!Array.isArray(value)) throw new Error(`${source} must be an array`);
  value.forEach((entry, index) => {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${source}[${index}] must be an object`);
    }
    if (typeof entry.name !== "string" || entry.name.length === 0) {
      throw new Error(`${source}[${index}].name must be a non-empty string`);
    }
    if (!Number.isSafeInteger(entry.loc) || entry.loc < 1) {
      throw new Error(`${source}[${index}].loc must be a positive room id`);
    }
  });
  return value;
}

export function readNpcDatabase(path) {
  return validateNpcDatabase(JSON.parse(readFileSync(path, "utf8")), path);
}
