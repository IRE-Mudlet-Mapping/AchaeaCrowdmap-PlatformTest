import type { DangerDSLType } from "danger";
import { readFileSync } from "node:fs";
import { MudletMapReader } from "mudlet-map-binary-reader";

declare const fail: typeof import("danger").fail;
declare const message: typeof import("danger").message;

type Rule = { check(danger: DangerDSLType): Promise<void> };
type Room = (typeof map.rooms)[number] & { id: number };

const map = MudletMapReader.readBuffer(readFileSync("Map/map"));
const rooms: Room[] = Object.entries(map.rooms).map(([id, room]) => ({ ...room, id: Number(id) }));

function mapRule(valid: boolean, success: string, failure: string): Rule {
  return {
    async check(danger) {
      if (!danger.git.fileMatch("Map/map").modified) return;
      if (valid) message(success, { icon: ":heavy_check_mark:" });
      else fail(failure);
    },
  };
}

function roomRule(found: Room[], property: string, showRooms = true): Rule {
  const failure = showRooms
    ? `Found ${property}: ${found.map((room) => room.id).toString()}`
    : `Found ${property}.`;
  return mapRule(found.length === 0, `No ${property}.`, failure);
}

export const disallowStockrooms = roomRule(
  rooms.filter((room) => room.symbol === "$" && room.down !== -1),
  "shops with stockrooms"
);

export const disallowUnlockedWormholes = roomRule(
  rooms.filter((room) => Object.hasOwn(room.mSpecialExits, "worm warp") && !room.mSpecialExitLocks?.includes("worm warp")),
  "rooms with unlocked wormholes",
  false
);

export const disallowWingsExits = roomRule(
  rooms.filter((room) => Object.keys(room.mSpecialExits).some((command) => command.includes("duana"))),
  "rooms with wings exits"
);

const allowedRoomMarks: Record<string, number> = {
  ashtan: 436, catacombs: 36697, cyrene: 6298, delos: 1181, dun: 5129,
  eleusis: 6738, everglade: 62062, excrucio: 8121, flame: 2898, genji: 10095,
  grukai: 27931, hashan: 4472, inbhir: 10913, invidia: 8162, ioje: 52029,
  istarion: 22385, judgement: 35548, kamleikan: 9578, kunapi: 52123,
  kuthalebak: 51850, letum: 8489, lhitsu: 52391, loramere: 52516,
  meropis: 1226, mhaldor: 11400, moghedu: 6, mourning: 37797, myrinia: 52554,
  mysia: 9869, newhope: 24310, not: 1299, poly: 5656, prialysh: 50884,
  qboard: 23900, qerstead: 52298, quaskan: 50832, radak: 45519,
  revenant: 7211, riagath: 30234, rip: 3415, sirocco: 30152, targossas: 2054,
  taryen: 21767, thera: 20386, tir: 1102, tree: 2898, ur: 50935, uw: 14594,
  wegava: 33127, yggdrasil: 54133, yudhi: 5918,
};

const existingRoomMarks = Object.fromEntries(
  Object.entries(JSON.parse(map.rooms[1].userData.gotoMapping)).map(([name, id]) => [name, Number(id)])
) as Record<string, number>;
const allowedNames = Object.keys(allowedRoomMarks);
const existingNames = Object.keys(existingRoomMarks);
const missing = allowedNames.filter((name) => !(name in existingRoomMarks));
const extra = existingNames.filter((name) => !(name in allowedRoomMarks));
const moved = allowedNames
  .filter((name) => name in existingRoomMarks && allowedRoomMarks[name] !== existingRoomMarks[name])
  .map((name) => `${name} (from ${allowedRoomMarks[name]} to ${existingRoomMarks[name]})`);

export const roomMarksNotFoundRule = mapRule(
  missing.length === 0,
  "Found no missing room marks.",
  `The following room marks are missing: ${missing.toString()}`
);
export const roomMarksExtraRule = mapRule(
  extra.length === 0,
  "Found no extra room marks.",
  `The following room marks are not in the whitelist: ${extra.toString()}`
);
export const roomMarksMovedRule = mapRule(
  moved.length === 0,
  "Found no moved room marks.",
  `The following room marks were moved: ${moved.toString()}`
);
