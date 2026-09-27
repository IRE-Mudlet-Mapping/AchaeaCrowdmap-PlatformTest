import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MudletMapReader } from "mudlet-map-binary-reader";

const inputFile = process.env.CROWDMAP_ROOT
  ? resolve(process.env.CROWDMAP_ROOT, "Map/map")
  : new URL("../../../../Map/map", import.meta.url);
export default MudletMapReader.readBuffer(readFileSync(inputFile));
