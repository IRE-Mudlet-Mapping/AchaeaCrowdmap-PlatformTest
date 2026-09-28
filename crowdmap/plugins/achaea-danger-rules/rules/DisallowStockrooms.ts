import type { MudletMap } from "mudlet-map-binary-reader";
import _ from "lodash";
import { RoomCheckRule } from "@ire-mudlet-mapping/crowdmap-danger/Rule";
import mapModel from "@ire-mudlet-mapping/crowdmap-danger/MapModel";

export function createDisallowStockroomsRule(map: Pick<MudletMap, "rooms">) {
  const rooms = _.filter(map.rooms, (room) =>
    room.symbol === '$' && room.down !== -1
  );

  return new RoomCheckRule(rooms, 'shops with stockrooms');
}

export const disallowStockrooms = createDisallowStockroomsRule(mapModel);
