import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { readNpcDatabase } from "../npc-database.mjs";

const root = resolve(process.env.CROWDMAP_ROOT ?? ".");
const publishDirectory = resolve(root, process.env.CROWDMAP_PUBLISH_DIR ?? "website");
const denizens = readNpcDatabase(resolve(publishDirectory, "Map", "denizen.json"));
const message = `Published ${denizens.length} Achaea NPC locations.`;

if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`);
console.log(message);
