import { resolve } from "node:path";
import { readNpcDatabase } from "../npc-database.mjs";

const root = resolve(process.env.CROWDMAP_ROOT ?? ".");
const publishDirectory = resolve(root, process.env.CROWDMAP_PUBLISH_DIR ?? "website");
const path = resolve(publishDirectory, "Map", "denizen.json");
const denizens = readNpcDatabase(path);
console.log(`Validated ${denizens.length} staged Achaea NPCs in ${path}`);
