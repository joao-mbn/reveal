import { RuleSeverity } from '@data-quality/api/codegen';
import {
  TimeSeriesType,
  getLastDatapointValue,
  getScoreValue,
  getTimeSeriesId,
} from '@data-quality/utils/validationTimeseries';

import { A, Body, Chip, Icon, Title } from '@cognite/cogs.js';
import { Datapoints } from '@cognite/sdk/dist/src';

type NameCellProps = {
  onClick: VoidFunction;
  ruleName: string;
};

type SeverityCellProps = {
  severity: RuleSeverity;
};

type ValidityCellProps = {
  ruleId: string;
  datapoints: Datapoints[];
  loadingDatapoints: boolean;
  dataSourceId?: string;
};

type ItemsCheckedCellProps = {
  ruleId: string;
  datapoints: Datapoints[];
  loadingDatapoints: boolean;
  dataSourceId?: string;
};

type CellProps = {
  isLoading?: boolean;
  value?: string | number;
};

export const NameCell = ({ onClick, ruleName }: NameCellProps) => {
  return (
    <Title level={5}>
      <A onClick={onClick}>{ruleName}</A>
    </Title>
  );
};

export const SeverityCell = ({ severity }: SeverityCellProps) => {
  switch (severity) {
    case 'Critical':
      return <Chip icon="Error" label={severity} type="danger" />;
    case 'High':
      return <Chip icon="Warning" label={severity} type="warning" />;
    case 'Medium':
      return <Chip label={severity} type="warning" />;
    case 'Low':
      return <Chip label={severity} type="neutral" />;
    default:
      return <Chip label={severity} />;
  }
};

export const ValidityCell = ({
  datapoints,
  dataSourceId,
  loadingDatapoints,
  ruleId,
}: ValidityCellProps) => {
  if (!dataSourceId) return <Cell />;

  const timeSeriesId = getTimeSeriesId(
    TimeSeriesType.SCORE,
    dataSourceId,
    ruleId
  );
  const value = getLastDatapointValue(datapoints, timeSeriesId);
  const cellValue = getScoreValue(value);

  return <Cell isLoading={loadingDatapoints} value={cellValue} />;
};

export const ItemsCheckedCell = ({
  datapoints,
  dataSourceId,
  loadingDatapoints,
  ruleId,
}: ItemsCheckedCellProps) => {
  if (!dataSourceId) return <Cell />;

  const timeSeriesId = getTimeSeriesId(
    TimeSeriesType.TOTAL_ITEMS_COUNT,
    dataSourceId,
    ruleId
  );
  const cellValue = getLastDatapointValue(datapoints, timeSeriesId);

  return <Cell isLoading={loadingDatapoints} value={cellValue} />;
};

/** General render cell with loading, error, and success cases. */
const Cell = ({ isLoading, value }: CellProps) => {
  if (isLoading) return <Icon aria-label="Loading cell data" type="Loader" />;

  if (value === undefined)
    return (
      <Body level={2} muted>
        <i>No data found</i>
      </Body>
    );

  return <Body level={2}>{value?.toLocaleString()}</Body>;
};