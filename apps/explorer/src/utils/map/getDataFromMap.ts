import { DATA_TYPES } from 'components/MapOverlay/MapOverlay';
import {
  Equipment,
  GetMapDataQueryTypeGenerated,
  Room,
} from 'graphql/generated';

interface ReturnType {
  key: string;
  item: Partial<Room> | Partial<Equipment> | undefined;
}
export const getDataFromMap = (
  data: GetMapDataQueryTypeGenerated,
  to: string
): ReturnType => {
  const roomItem = data.rooms?.items.find((item: any) => {
    return String(item.nodeId) === to;
  });
  if (roomItem) return { key: DATA_TYPES.ROOM, item: roomItem };

  const equipmentItem = data.equipment?.items.find((item: any) => {
    return String(item.nodeId) === to;
  });

  if (equipmentItem) return { key: DATA_TYPES.EQUIPMENT, item: equipmentItem };
  return { key: '', item: undefined };
};
