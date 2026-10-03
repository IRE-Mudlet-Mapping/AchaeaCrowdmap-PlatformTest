import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { validateNpcDatabase } from "../npc-database.mjs";

const root = resolve(process.env.CROWDMAP_ROOT ?? ".");
const source = process.env.ACHAEA_NPC_SOURCE_URL
  ?? "https://ire-mudlet-mapping.github.io/AchaeaCrowdmap/Map/denizen.json";
const destination = resolve(root, "Map", "denizen.json");
const temporary = `${destination}.tmp`;

const response = await fetch(source);
if (!response.ok) throw new Error(`Could not download Achaea NPC database: HTTP ${response.status}`);
const denizens = validateNpcDatabase(await response.json(), source);

mkdirSync(dirname(destination), { recursive: true });
writeFileSync(temporary, JSON.stringify(denizens));
renameSync(temporary, destination);
console.log(`Updated ${denizens.length} Achaea NPCs in ${destination}`);
