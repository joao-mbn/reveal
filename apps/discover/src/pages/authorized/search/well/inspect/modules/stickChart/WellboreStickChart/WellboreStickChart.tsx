import { NdsRiskTypesSelection } from 'domain/wells/nds/internal/types';
import { NptCodesSelection } from 'domain/wells/npt/internal/types';
import { MaxDepthData } from 'domain/wells/trajectory/internal/types';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { BooleanMap } from 'utils/booleanMap';

import { DragDropContainer } from 'components/DragDropContainer';
import { NoUnmountShowHide } from 'components/NoUnmountShowHide';
import { DepthMeasurementUnit, PressureUnit } from 'constants/units';
import { useDeepEffect, useDeepMemo } from 'hooks/useDeep';

import { SelectedWellboreNptView } from '../../nptEvents/Graph';
import { useColumnHeight } from '../hooks/useColumnHeight';
import { useScaleBlocks } from '../hooks/useScaleBlocks';
import { useTrajectoryCurveConfigs } from '../hooks/useTrajectoryCurveConfigs';
import { ChartColumn, WellboreStickChartData, WellboreData } from '../types';
import { getAnnotationDepths } from '../utils/getAnnotationDepths';

import { CasingsColumn } from './CasingsColumn';
import { CasingsDetailView } from './CasingsDetailView';
import { DEFAULT_COLUMN_ORDER } from './constants';
import { DepthColumn } from './DepthColumn';
import { ContentWrapper, WellboreStickChartWrapper } from './elements';
import { FormationColumn } from './FormationColumn';
import { Header } from './Header';
import { MeasurementsColumn } from './MeasurementsColumn';
import { NdsEventsColumn } from './NdsEventsColumn';
import { NptEventsColumn } from './NptEventsColumn';
import { SummaryColumn } from './SummaryColumn';
import { TrajectoryColumn } from './TrajectoryColumn';
import { WellboreNdsDetailedView } from './WellboreNdsDetailedView';
import { WellboreStickChartEmptyState } from './WellboreStickChartEmptyState';

export interface WellboreStickChartProps
  extends WellboreData,
    WellboreStickChartData {
  isWellboreSelected?: boolean;
  /**
   * If the wellbore doesn't have any data (casings, trajectories, etc.),
   * max depth data is not available.
   */
  maxDepth?: MaxDepthData;
  columnVisibility: BooleanMap;
  columnOrder: string[];
  depthMeasurementType: DepthMeasurementUnit;
  pressureUnit: PressureUnit;
  nptCodesSelecton?: NptCodesSelection;
  ndsRiskTypesSelection?: NdsRiskTypesSelection;
  summaryVisibility?: BooleanMap;
  measurementTypesSelection?: BooleanMap;
}

export const WellboreStickChart: React.FC<WellboreStickChartProps> = ({
  /**
   * WellboreData
   */
  wellName,
  wellboreName,
  wellboreColor,
  wellboreMatchingId,
  rkbLevel,
  wellWaterDepth,
  uniqueWellboreIdentifier,
  /**
   * WellboreStickChartData
   */
  rigNames,
  formationsData,
  casingsData,
  nptData,
  ndsData,
  trajectoryData,
  measurementsData,
  holeSectionsData,
  mudWeightData,
  kickoffDepth,
  drillingDays,
  /**
   * Other props
   */
  isWellboreSelected = true,
  maxDepth,
  columnVisibility,
  columnOrder,
  depthMeasurementType: depthMeasurementTypeProp,
  pressureUnit,
  nptCodesSelecton,
  ndsRiskTypesSelection,
  summaryVisibility,
  measurementTypesSelection,
}) => {
  const [columnOrderInternal, setColumnOrderInternal] = useState(columnOrder);
  const [depthMeasurementType, setDepthMeasurementType] = useState(
    depthMeasurementTypeProp
  );
  const [showCasingsDetailView, setShowCasingsDetailView] = useState(false);
  const [showNptDetailView, setShowNptDetailView] = useState(false);
  const [showNdsDetailView, setShowNdsDetailView] = useState(false);

  const { contentRef, columnHeight } = useColumnHeight();

  const { scaleBlocks } = useScaleBlocks({
    maxDepth,
    columnHeight,
    depthMeasurementType,
  });

  const trajectoryCurveConfigs = useTrajectoryCurveConfigs();

  useDeepEffect(() => {
    setColumnOrderInternal(columnOrder);
  }, [columnOrder]);

  useEffect(() => {
    setDepthMeasurementType(depthMeasurementTypeProp);
  }, [depthMeasurementTypeProp]);

  const inclinationAnnotationDepths = useDeepMemo(() => {
    return getAnnotationDepths(measurementsData?.data);
  }, [measurementsData?.data]);

  const isAnyColumnVisible = useDeepMemo(() => {
    return Object.values(columnVisibility).some(Boolean);
  }, [columnVisibility]);

  const getCommonProps = (column: ChartColumn) => {
    return {
      key: column,
      scaleBlocks,
      depthMeasurementType,
      isVisible: columnVisibility[column],
    };
  };

  const columns: Record<ChartColumn, JSX.Element> = {
    [ChartColumn.FORMATION]: (
      <FormationColumn
        key={ChartColumn.FORMATION}
        {...formationsData}
        scaleBlocks={scaleBlocks}
        depthMeasurementType={depthMeasurementType}
        isVisible={columnVisibility[ChartColumn.FORMATION]}
      />
    ),
    [ChartColumn.DEPTH]: (
      <DepthColumn
        {...getCommonProps(ChartColumn.DEPTH)}
        onChangeDepthMeasurementType={setDepthMeasurementType}
      />
    ),
    [ChartColumn.CASINGS]: (
      <CasingsColumn
        {...casingsData}
        {...getCommonProps(ChartColumn.CASINGS)}
        holeSections={holeSectionsData.data}
        mudWeightData={mudWeightData.data}
        rkbLevel={rkbLevel}
        wellWaterDepth={wellWaterDepth}
        maxDepth={maxDepth}
        onClickDetailsButton={() => setShowCasingsDetailView(true)}
      />
    ),
    [ChartColumn.MEASUREMENTS]: (
      <MeasurementsColumn
        {...measurementsData}
        {...getCommonProps(ChartColumn.MEASUREMENTS)}
        measurementTypesSelection={measurementTypesSelection}
        pressureUnit={pressureUnit}
      />
    ),
    [ChartColumn.TRAJECTORY]: (
      <TrajectoryColumn
        {...trajectoryData}
        {...getCommonProps(ChartColumn.TRAJECTORY)}
        kickoffDepth={kickoffDepth.data}
        curveColor={wellboreColor}
        trajectoryCurveConfigs={trajectoryCurveConfigs}
        inclinationAnnotationDepths={inclinationAnnotationDepths}
      />
    ),
    [ChartColumn.NDS]: (
      <NdsEventsColumn
        {...ndsData}
        {...getCommonProps(ChartColumn.NDS)}
        ndsRiskTypesSelection={ndsRiskTypesSelection}
        onClickDetailsButton={() => setShowNdsDetailView(true)}
      />
    ),
    [ChartColumn.NPT]: (
      <NptEventsColumn
        {...nptData}
        {...getCommonProps(ChartColumn.NPT)}
        nptCodesSelecton={nptCodesSelecton}
        onClickDetailsButton={() => setShowNptDetailView(true)}
      />
    ),
    [ChartColumn.SUMMARY]: (
      <SummaryColumn
        {...getCommonProps(ChartColumn.SUMMARY)}
        casingAssemblies={casingsData.data}
        holeSections={holeSectionsData.data}
        mudWeightData={mudWeightData.data}
        nptEvents={nptData.data}
        ndsEvents={ndsData.data}
        summaryVisibility={summaryVisibility}
      />
    ),
  };

  return (
    <>
      <NoUnmountShowHide show={isWellboreSelected}>
        <WellboreStickChartWrapper>
          <Header
            wellName={wellName}
            wellboreName={wellboreName}
            uniqueWellboreIdentifier={uniqueWellboreIdentifier}
            rigNames={rigNames}
            drillingDaysData={drillingDays?.data}
          />

          <WellboreStickChartEmptyState
            isAnyColumnVisible={isAnyColumnVisible}
          />

          <ContentWrapper ref={contentRef}>
            <DragDropContainer
              id="welbore-stick-chart-view-content"
              elementsOrder={columnOrderInternal}
              onRearranged={setColumnOrderInternal}
            >
              {DEFAULT_COLUMN_ORDER.map((column) => {
                return columns[column];
              })}
            </DragDropContainer>
          </ContentWrapper>
        </WellboreStickChartWrapper>
      </NoUnmountShowHide>

      {showCasingsDetailView && (
        <CasingsDetailView
          wellName={wellName}
          wellboreName={wellboreName}
          data={casingsData?.data}
          onBackClick={() => setShowCasingsDetailView(false)}
        />
      )}

      {showNptDetailView && (
        <SelectedWellboreNptView
          selectedWellboreId={wellboreMatchingId}
          onCloseSelectedWellboreNptViewClick={() =>
            setShowNptDetailView(false)
          }
        />
      )}

      {showNdsDetailView && (
        <WellboreNdsDetailedView
          selectedWellboreId={wellboreMatchingId}
          onBackClick={() => setShowNdsDetailView(false)}
        />
      )}
    </>
  );
};
