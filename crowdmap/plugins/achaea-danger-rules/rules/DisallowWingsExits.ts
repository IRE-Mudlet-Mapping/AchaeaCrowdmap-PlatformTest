import type { MudletMap } from "mudlet-map-binary-reader";
import _ from "lodash";
import { RoomCheckRule } from "@ire-mudlet-mapping/crowdmap-danger/Rule";
import mapModel from "@ire-mudlet-mapping/crowdmap-danger/MapModel";

export function createDisallowWingsExitsRule(map: Pick<MudletMap, "rooms">) {
  const rooms = _.filter(map.rooms, (room) =>
    _.some(room.mSpecialExits, (_, exitCommand) => exitCommand.includes("duana"))
  );

  return new RoomCheckRule(rooms, 'rooms with wings exits');
}

export const disallowWingsExits = createDisallowWingsExitsRule(mapModel);
