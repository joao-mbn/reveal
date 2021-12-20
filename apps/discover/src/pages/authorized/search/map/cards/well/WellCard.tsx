import mapboxgl from 'maplibre-gl';

import { useMap } from 'modules/map/selectors';

import MapPopup from '../../MapPopup';

import { WellPreviewCard } from './WellPreviewCard';

interface Props {
  map?: mapboxgl.Map;
}

export const WellCard: React.FC<Props> = ({ map }) => {
  const { selectedWell } = useMap(); // map provider

  if (map && selectedWell && selectedWell.point) {
    return (
      <MapPopup point={selectedWell.point} map={map}>
        <WellPreviewCard wellId={selectedWell.id} />
      </MapPopup>
    );
  }

  return null;
};
