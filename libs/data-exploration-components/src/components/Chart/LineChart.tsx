import React, { useMemo } from 'react';
import { AreaClosed, Line, Bar, LinePath } from '@visx/shape';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import {
  useTooltip,
  defaultStyles,
  Tooltip,
  TooltipWithBounds,
} from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, min, extent, bisector } from 'd3-array';
import { NumberValue } from 'd3-scale';
import { DatapointAggregate } from '@cognite/sdk';
import { AxisRight, AxisBottom, TickFormatter } from '@visx/axis';
import { Group } from '@visx/group';
import { Threshold } from '@visx/threshold';
import { Body, Colors, Overline } from '@cognite/cogs.js';
import {
  lightGrey,
  formatDate,
  datetimeMultiFormat,
} from '@data-exploration-components/utils';
import styled from 'styled-components';

const pointColor = Colors['decorative--blue--300'];
const primaryColor = Colors['decorative--blue--400'];
const primaryColor2 = Colors['decorative--blue--600'];
const areaColor = Colors['decorative--blue--500'];
const tooltipStyles = {
  ...defaultStyles,
  background: 'white',
  border: 'none',
  color: 'white',
};

// accessors
const getDate = (d?: DatapointAggregate) =>
  d ? new Date(d.timestamp) : new Date(0);
const getDataPointAverage = (d?: DatapointAggregate) =>
  d ? d.average : undefined;
const getDataPointMaxValue = (d?: DatapointAggregate) =>
  d ? d.max : undefined;
const getDataPointMinValue = (d?: DatapointAggregate) =>
  d ? d.min : undefined;
const getDataPointCount = (d?: DatapointAggregate) => (d ? d.count : undefined);
const bisectDate = bisector<DatapointAggregate, Date>(
  (d) => new Date(d.timestamp)
).left;

export type LineChartProps = {
  width: number;
  height: number;
  minRowTicks?: number;
  domain?: [Date, Date];
  showGridLine?: 'both' | 'horizontal' | 'vertical' | 'none';
  showAxis?: 'both' | 'horizontal' | 'vertical' | 'none';
  showSmallerTicks?: boolean;
  enableTooltip?: boolean;
  showPoints?: boolean;
  enableArea?: boolean;
  enableMinMaxArea?: boolean;
  enableTooltipPreview?: boolean;
  values: DatapointAggregate[];
  margin?: { top: number; right: number; bottom: number; left: number };
};

export const LineChart = ({
  values,
  width,
  height,
  domain,
  showGridLine = 'horizontal',
  showAxis = 'both',
  showSmallerTicks = false,
  enableArea = false,
  enableMinMaxArea = true,
  enableTooltip = true,
  enableTooltipPreview = false,
  showPoints = true,
  minRowTicks = 5,
  margin = { top: 0, right: 40, bottom: 40, left: 10 },
}: LineChartProps) => {
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip<DatapointAggregate>();
  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, innerWidth],
        domain: domain || (extent(values, getDate) as [Date, Date]),
      }),
    [innerWidth, values, domain]
  );
  const valuesScale = useMemo(() => {
    const minValues = values
      .map(getDataPointMinValue)
      .filter((el) => el !== undefined) as number[];
    const maxValues = values
      .map(getDataPointMaxValue)
      .filter((el) => el !== undefined) as number[];
    return scaleLinear({
      range: [innerHeight, 0],
      domain: [min(minValues) || 0, max(maxValues) || 1],
      nice: true,
    });
  }, [innerHeight, values]);

  const handleTooltip = (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
  ) => {
    const { x } = localPoint(event) || { x: 0 };
    const translatedX = x - margin.left;
    const x0 = dateScale.invert(translatedX);
    const index = bisectDate(values, x0, 1);
    const d0 = values[index - 1];
    const d1 = values[index];
    let d: DatapointAggregate | undefined = d0;

    if (d1 && getDate(d1)) {
      d =
        x0.valueOf() - getDate(d0).valueOf() >
        getDate(d1).valueOf() - x0.valueOf()
          ? d1
          : d0;
    }
    const value = getDataPointAverage(d);
    showTooltip({
      tooltipData: d,
      tooltipLeft: translatedX,
      tooltipTop: d && value !== undefined ? valuesScale(value) : 0,
    });
  };

  const numRowTicks = Math.max(minRowTicks, Math.floor(height / 30));
  const numColumnTicks = Math.max(5, Math.floor(width / 100));
  const getXWithScale = (d: DatapointAggregate) => dateScale(getDate(d));
  const gridWidth = innerWidth > 0 ? innerWidth : 0;

  const renderGrid = () => (
    <>
      {(showGridLine === 'both' || showGridLine === 'horizontal') && (
        <GridRows
          scale={valuesScale}
          width={gridWidth}
          height={innerHeight}
          numTicks={numColumnTicks}
          strokeDasharray="1,3"
          stroke={lightGrey}
          strokeWidth="1.3"
        />
      )}
      {(showGridLine === 'both' || showGridLine === 'vertical') && (
        <GridColumns
          scale={dateScale}
          width={gridWidth}
          height={innerHeight}
          numTicks={numRowTicks}
          stroke={lightGrey}
          strokeWidth="1.3"
        />
      )}
    </>
  );

  const renderAxis = () => (
    <>
      {(showAxis === 'both' || showAxis === 'horizontal') && (
        <AxisBottom
          top={innerHeight}
          scale={dateScale}
          numTicks={numColumnTicks}
          tickStroke={lightGrey}
          strokeWidth={0}
          tickLabelProps={() => ({
            fontFamily: 'Inter',
            fontSize: showSmallerTicks ? 10 : 12,
            fill: Colors['decorative--grayscale--600'],
            textAnchor: 'middle',
          })}
          tickLength={showSmallerTicks ? 4 : 8}
          tickFormat={
            datetimeMultiFormat as TickFormatter<Date | NumberValue> | undefined
          }
        />
      )}
      {(showAxis === 'both' || showAxis === 'vertical') && (
        <AxisRight
          scale={valuesScale}
          left={gridWidth}
          numTicks={numRowTicks}
          tickStroke={lightGrey}
          strokeWidth={0}
          tickLabelProps={() => ({
            fontFamily: 'Inter',
            fontSize: 12,
            dy: 5,
            dx: 8,
            fill: Colors['decorative--grayscale--600'],
            textAnchor: 'start',
          })}
        />
      )}
    </>
  );

  const renderableValues = values.filter((el) => {
    const data = getDataPointAverage(el);
    if (data !== undefined) {
      return valuesScale(data) !== undefined;
    }
    return false;
  });

  const renderArea = () => {
    if (!enableArea) {
      return <></>;
    }
    return (
      <AreaClosed<DatapointAggregate>
        data={renderableValues}
        width={gridWidth}
        height={innerHeight}
        x={(d) => getXWithScale(d)!}
        y1={(d) => valuesScale(getDataPointAverage(d)!)!}
        y0={0}
        yScale={valuesScale}
        strokeWidth={0}
        stroke="url(#area-gradient)"
        fill="url(#area-gradient)"
      />
    );
  };

  const renderLine = () => (
    <LinePath<DatapointAggregate>
      data={renderableValues}
      width={gridWidth}
      height={innerHeight}
      x={(d) => getXWithScale(d)!}
      y={(d) => valuesScale(getDataPointAverage(d)!)!}
      strokeWidth={2}
      stroke={primaryColor}
    />
  );

  const renderThreshold = () => {
    if (!enableMinMaxArea) {
      return <></>;
    }
    const renderableMinMaxValues = values.filter((el) => {
      const minVal = getDataPointMinValue(el);
      const maxVal = getDataPointMaxValue(el);
      if (minVal !== undefined && maxVal !== undefined) {
        return (
          valuesScale(minVal) !== undefined && valuesScale(maxVal) !== undefined
        );
      }
      return false;
    });
    return (
      <Threshold<DatapointAggregate>
        id={`${Math.random()}`}
        data={renderableMinMaxValues}
        x={(d) => getXWithScale(d)!}
        y0={(d) => valuesScale(getDataPointMinValue(d)!)!}
        y1={(d) => valuesScale(getDataPointMaxValue(d)!)!}
        clipAboveTo={0}
        clipBelowTo={innerHeight}
        belowAreaProps={{
          fill: areaColor,
          fillOpacity: 0.4,
        }}
        aboveAreaProps={{
          fill: areaColor,
          fillOpacity: 0.4,
        }}
      />
    );
  };

  const renderPoints = () => {
    if (!showPoints) {
      return <></>;
    }
    return (
      <Group>
        {values.map((d) => {
          const value = getDataPointAverage(d);
          const cy = d && value !== undefined ? valuesScale(value) : 0;
          return (
            <circle
              key={d.timestamp.valueOf()}
              r={2}
              cx={getXWithScale(d)}
              cy={cy}
              fill={pointColor}
            />
          );
        })}
      </Group>
    );
  };

  const renderTooltipLine = () => {
    if (!enableTooltip && !enableTooltipPreview) {
      return <></>;
    }
    return (
      <>
        <Bar
          width={gridWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: innerHeight + 0 }}
              stroke={primaryColor2}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={primaryColor2}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </>
    );
  };

  const renderTooltipContent = () => {
    if (enableTooltipPreview) {
      return (
        tooltipData && (
          <RelativeWrapper>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop < innerHeight ? -innerHeight - 10 : -tooltipTop}
              left={tooltipLeft + 5}
              style={tooltipStyles}
            >
              <>
                <Overline level={3}>
                  Average:
                  <TooltipSpan>
                    {getDataPointAverage(tooltipData)?.toFixed(3)}
                  </TooltipSpan>
                </Overline>

                <Overline level={3}>
                  Date:
                  <TooltipSpan>{formatDate(getDate(tooltipData))}</TooltipSpan>
                </Overline>
              </>
            </TooltipWithBounds>
          </RelativeWrapper>
        )
      );
    }
    if (!enableTooltip && !enableTooltipPreview) {
      return <></>;
    }

    return (
      tooltipData && (
        <RelativeWrapper>
          <Tooltip
            key={Math.random()}
            top={tooltipTop < innerHeight ? -innerHeight : -tooltipTop}
            left={tooltipLeft + 5}
            style={tooltipStyles}
          >
            <>
              <Overline level={3}>Average</Overline>
              <Body level={3}>
                {/* Adding the precision upto 3 places  */}
                {getDataPointAverage(tooltipData)?.toFixed(3)}
              </Body>
              <Overline level={3}>Max</Overline>
              <Body level={3}>
                {getDataPointMaxValue(tooltipData)?.toFixed(3)}
              </Body>
              <Overline level={3}>Min</Overline>
              <Body level={3}>
                {getDataPointMinValue(tooltipData)?.toFixed(3)}
              </Body>
              <Overline level={3}>Count</Overline>
              <Body level={3}>{getDataPointCount(tooltipData)}</Body>
            </>
          </Tooltip>

          <Tooltip
            top={margin.top - 14}
            left={tooltipLeft + 5}
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: 'center',
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        </RelativeWrapper>
      )
    );
  };

  return (
    <div>
      <svg
        width={width}
        height={height}
        style={{
          overflow: 'visible',
        }}
      >
        <Group
          left={margin.left}
          top={margin.top}
          style={{
            transform: 'translate(10px, 10px)',
          }}
        >
          <LinearGradient
            id="area-gradient"
            from={primaryColor}
            to={primaryColor}
            toOpacity={0.1}
          />
          {renderGrid()}
          {renderAxis()}
          {renderArea()}
          {renderLine()}
          {renderThreshold()}
          {renderPoints()}
          {renderTooltipLine()}
        </Group>
      </svg>
      {renderTooltipContent()}
    </div>
  );
};

const RelativeWrapper = styled.div`
  position: relative;
`;

const TooltipSpan = styled.span`
  font-weight: 400;
  font-size: 14px;
  text-transform: none;
`;