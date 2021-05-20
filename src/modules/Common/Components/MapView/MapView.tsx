import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import ReactMapboxGl, { Layer, Feature, Popup } from 'react-mapbox-gl';
import { FileInfo } from '@cognite/sdk';
import * as MapboxGL from 'mapbox-gl';
import { ResultData } from 'src/modules/Common/types';
import { MAPBOX_TOKEN, MAPBOX_MAP_ID } from './constants';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPopup } from './MapPopup';
import { MapFileTable } from './MapFileTable';
import { FileExplorerTableProps } from '../FileTable/types';
import { TableDataItem } from '../../types';

const Mapbox = ReactMapboxGl({
  minZoom: 1,
  maxZoom: 30,
  accessToken: MAPBOX_TOKEN,
  attributionControl: false,
});

export const MapView = (props: { data?: ResultData[] }) => {
  const [selectedFile, setSelectedFile] = useState<FileInfo>();
  const [center, setCenter] = useState<[number, number]>();
  const [zoom] = useState<[number] | undefined>([2]);

  const fitBounds = undefined; // TODO: calculate this based on the provided data

  const selectedFiles = useMemo(() => {
    return props.data || [];
  }, [props.data]);

  const handleStyleLoad = (map: MapboxGL.Map) => map.resize();

  const mapStyle = {
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  };

  const flyToOptions = {
    speed: 0.8,
  };

  const circleLayout: MapboxGL.CircleLayout = { visibility: 'visible' };
  const circlePaint: MapboxGL.CirclePaint = {
    'circle-color': '#C844DB',
    'circle-radius': 7.5,
    'circle-stroke-color': 'white',
    'circle-stroke-width': 1,
    'circle-color-transition': { duration: 0 },
  };

  const features = Object.assign(
    {},
    ...selectedFiles
      .filter((f) => f.geoLocation && f)
      .map((s) => ({
        [s.id]: s.geoLocation?.geometry.coordinates as [number, number],
      }))
  );

  const handleOnDrag = () => {
    if (selectedFile) setSelectedFile(undefined);
  };

  const handleOnClick = (fileId: number) => {
    setSelectedFile(selectedFiles.find((file) => file.id === fileId));
    setCenter(features[fileId.toString()]);
  };

  return (
    <Container>
      <div style={{ width: '400px', paddingRight: '20px' }}>
        <MapFileTable {...props} />
      </div>
      <div style={{ width: `calc(100% - 400px)`, paddingRight: '20px' }}>
        <Mapbox
          style={MAPBOX_MAP_ID}
          onStyleLoad={handleStyleLoad}
          fitBounds={fitBounds}
          center={center}
          zoom={zoom}
          containerStyle={mapStyle}
          flyToOptions={flyToOptions}
          onDrag={handleOnDrag}
          onClick={handleOnDrag}
        >
          <Layer type="circle" layout={circleLayout} paint={circlePaint}>
            {Object.keys(features).map((f, _) => (
              <Feature
                key={f}
                coordinates={features[f]}
                onClick={() => handleOnClick(+f)}
              />
            ))}
          </Layer>
          {selectedFile ? (
            <Popup
              key={selectedFile.id}
              coordinates={features[selectedFile.id.toString()]}
              anchor="bottom"
              offset={[0, -10]}
              style={{
                position: 'fixed',
              }}
            >
              <MapPopup
                item={props.data?.find(
                  (element: TableDataItem) => element.id === selectedFile.id
                )}
              />
            </Popup>
          ) : (
            <div />
          )}
        </Mapbox>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;
