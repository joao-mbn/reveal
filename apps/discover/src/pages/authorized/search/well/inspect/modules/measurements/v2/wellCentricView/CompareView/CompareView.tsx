import React, { useMemo, useState } from 'react';

import uniqBy from 'lodash/uniqBy';

import { BackButton } from 'components/Buttons';
import { OverlayNavigation } from 'components/OverlayNavigation';
import { useUserPreferencesMeasurement } from 'hooks/useUserPreferences';
import { useMeasurementsQuery } from 'modules/wellSearch/hooks/useMeasurementsQuery';
import { useWellConfig } from 'modules/wellSearch/hooks/useWellConfig';
import { Wellbore } from 'modules/wellSearch/types';
import { FlexColumn } from 'styles/layout';

import {
  DEFAULT_MEASUREMENTS_REFERENCE,
  DEFAULT_PRESSURE_UNIT,
  MEASUREMENTS_REFERENCES,
  PRESSURE_UNITS,
} from '../../constants';
import { GeomechanicsCurveFilter } from '../../filters/GeomechanicsCurveFilter';
import { OtherFilter } from '../../filters/OtherFilter';
import { PPFGCurveFilter } from '../../filters/PPFGCurveFilter';
import { UnitFilter } from '../../filters/UnitFilter';
import {
  formatChartData,
  getSelectedWellboresTitle,
  getSelectedWellsTitle,
  mapToCompareView,
} from '../../utils';

import CompareViewCard from './CompareViewCard';
import {
  Header,
  HeaderTitle,
  HeaderSubTitle,
  TopBar,
  CompareViewCardsWrapper,
} from './elements';

type Props = {
  wellbores: Wellbore[];
  onBack: () => void;
};

export const CompareView: React.FC<Props> = ({ wellbores, onBack }) => {
  const wellsCounts = useMemo(
    () => uniqBy(wellbores, 'wellId').length,
    [wellbores]
  );

  const [geomechanicsCurves, setGeomechanicsCurves] = useState<string[]>([]);
  const [ppfgCurves, setPPFGCurves] = useState<string[]>([]);
  const [otherTypes, setOtherTypes] = useState<string[]>([]);
  const [pressureUnit, setPressureUnit] = useState<string>(
    DEFAULT_PRESSURE_UNIT
  );
  const [measurementReference, setMeasurementReference] = useState<string>(
    DEFAULT_MEASUREMENTS_REFERENCE
  );

  const { data } = useMeasurementsQuery();

  const { data: config } = useWellConfig();

  const { data: userPreferredUnit } = useUserPreferencesMeasurement();

  const graphCards = useMemo(() => {
    if (!data || !userPreferredUnit) return [];
    const wellboreCharts = wellbores
      .map((wellbore) => ({
        wellbore,
        chartData: formatChartData(
          data[wellbore.id],
          geomechanicsCurves,
          ppfgCurves,
          otherTypes,
          measurementReference,
          pressureUnit.toLowerCase(),
          userPreferredUnit,
          config
        ),
      }))
      .filter((row) => row.chartData.length > 0);

    const groupedData = mapToCompareView(wellboreCharts);

    const charts: JSX.Element[] = [];

    const axisNames = {
      x: `Pressure (${pressureUnit.toLowerCase()})`,
      y: `${measurementReference} (${userPreferredUnit})`,
    };

    if (groupedData.x) {
      charts.push(
        <CompareViewCard
          title="Pore Pressure Fracture Gradient"
          key="compare-view-pressure-chart"
          chartData={groupedData.x}
          axisNames={axisNames}
        />
      );
    }

    if (groupedData.x2) {
      charts.push(
        <CompareViewCard
          title="Internal Friction Angle"
          key="compare-view-angle-chart"
          chartData={groupedData.x2}
          axisNames={axisNames}
        />
      );
    }
    return charts;
  }, [
    wellbores,
    JSON.stringify(data),
    pressureUnit,
    geomechanicsCurves,
    ppfgCurves,
    measurementReference,
    otherTypes,
    userPreferredUnit,
  ]);

  return (
    <OverlayNavigation mount>
      <Header>
        <BackButton onClick={onBack} />
        <FlexColumn>
          <HeaderTitle>
            {getSelectedWellboresTitle(wellbores.length)}
          </HeaderTitle>
          <HeaderSubTitle>{getSelectedWellsTitle(wellsCounts)}</HeaderSubTitle>
        </FlexColumn>
      </Header>

      <TopBar>
        <GeomechanicsCurveFilter
          selectedCurves={geomechanicsCurves}
          onChange={setGeomechanicsCurves}
        />
        <PPFGCurveFilter selectedCurves={ppfgCurves} onChange={setPPFGCurves} />
        <OtherFilter selectedCurves={otherTypes} onChange={setOtherTypes} />
        <UnitFilter
          title="Pressure Unit:"
          selected={pressureUnit}
          options={PRESSURE_UNITS}
          onChange={setPressureUnit}
        />
        <UnitFilter
          title="Measurement reference:"
          selected={measurementReference}
          options={MEASUREMENTS_REFERENCES}
          onChange={setMeasurementReference}
        />
      </TopBar>
      <CompareViewCardsWrapper>{graphCards}</CompareViewCardsWrapper>
    </OverlayNavigation>
  );
};
