import type { MudletMap } from "mudlet-map-binary-reader";
import _ from "lodash";
import { RoomCheckRule } from "@ire-mudlet-mapping/crowdmap-danger/Rule";
import mapModel from "@ire-mudlet-mapping/crowdmap-danger/MapModel";

export function createDisallowUnlockedWormholesRule(
  map: Pick<MudletMap, "rooms">
) {
  const rooms = _.filter(map.rooms, (room) =>
    Object.hasOwn(room.mSpecialExits, "worm warp") &&
    !room.mSpecialExitLocks?.includes("worm warp")
  );

  return new RoomCheckRule(rooms, 'rooms with unlocked wormholes', false);
}

export const disallowUnlockedWormholes =
  createDisallowUnlockedWormholesRule(mapModel);
