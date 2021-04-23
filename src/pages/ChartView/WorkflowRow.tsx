import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart,
  ChartWorkflow,
  FunctionCallStatus,
  ChartTimeSeries,
} from 'reducers/charts/types';
import { Button, Dropdown, Icon, Menu } from '@cognite/cogs.js';
import FunctionCall from 'components/FunctionCall';
import { updateWorkflow, removeWorkflow } from 'utils/charts';
import EditableText from 'components/EditableText';
import { units } from 'utils/units';
import { Modes } from 'pages/types';
import { useCallFunction } from 'utils/cogniteFunctions';
import { getStepsFromWorkflow } from 'utils/transforms';
import { calculateGranularity } from 'utils/timeseries';
import { isWorkflowRunnable } from 'components/NodeEditor/utils';
import { AppearanceDropdown } from 'components/AppearanceDropdown';
import { SourceItem, SourceSquare, SourceName, SourceRow } from './elements';
import WorkflowMenu from './WorkflowMenu';

const renderStatusIcon = (status?: FunctionCallStatus) => {
  switch (status) {
    case 'Running':
      return <Icon type="Loading" />;
    case 'Completed':
      return <Icon type="Check" />;
    case 'Failed':
    case 'Timeout':
      return <Icon type="Close" />;
    default:
      return null;
  }
};

type Props = {
  chart: Chart;
  workflow: ChartWorkflow;
  isSelected?: boolean;
  onRowClick?: (id?: string) => void;
  onInfoClick?: (id?: string) => void;
  setMode?: (m: Modes) => void;
  mode: string;
  mutate: (c: Chart) => void;
};
export default function WorkflowRow({
  chart,
  workflow,
  onRowClick = () => {},
  onInfoClick = () => {},
  mode,
  setMode = () => {},
  isSelected = false,
  mutate,
}: Props) {
  const { mutate: callFunction, data, isSuccess, reset } = useCallFunction(
    'simple_calc-master'
  );

  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  // Increasing this will cause a fresh render where the dropdown is closed
  const {
    id,
    enabled,
    color,
    name,
    calls,
    unit,
    //  preferredUnit
  } = workflow;
  const call = calls?.sort((c) => c.callDate)[0];
  const isWorkspaceMode = mode === 'workspace';

  const update = (wfId: string, diff: Partial<ChartWorkflow>) => {
    mutate(updateWorkflow(chart, wfId, diff));
  };

  const { dateTo, dateFrom } = chart;
  const { nodes, connections } = workflow;
  const steps = useMemo(
    () => isWorkflowRunnable(nodes) && getStepsFromWorkflow(nodes, connections),
    [nodes, connections]
  );
  const computation = useMemo(
    () =>
      steps && {
        steps,
        start_time: new Date(dateFrom).getTime(),
        end_time: new Date(dateTo).getTime(),
        granularity: calculateGranularity(
          [new Date(dateFrom).getTime(), new Date(dateTo).getTime()],
          1000
        ),
      },
    [steps, dateFrom, dateTo]
  );

  useEffect(() => {
    if (computation) {
      callFunction({
        data: { computation_graph: computation },
      });
    }
  }, [computation, callFunction]);

  useEffect(() => {
    if (isSuccess && data) {
      const newCall = { ...data, callDate: Date.now() };
      mutate(
        updateWorkflow(chart, workflow.id, {
          calls: call ? [newCall, call] : [newCall],
        })
      );
      reset();
    }
  }, [chart, workflow.id, data, isSuccess, mutate, reset, call]);

  const inputUnitOption = units.find(
    (unitOption) => unitOption.value === unit?.toLowerCase()
  );

  // const preferredUnitOption = units.find(
  //   (unitOption) => unitOption.value === preferredUnit?.toLowerCase()
  // );

  // const unitConversionOptions = inputUnitOption?.conversions?.map(
  //   (conversion) => units.find((unitOption) => unitOption.value === conversion)
  // );

  const unitOverrideMenuItems = units.map((unitOption) => (
    <Menu.Item
      key={unitOption.value}
      onClick={() =>
        update(id, {
          unit: unitOption.value,
        })
      }
    >
      {unitOption.label}
      {unit?.toLowerCase() === unitOption.value && ' (selected)'}
    </Menu.Item>
  ));

  // const unitConversionMenuItems = unitConversionOptions?.map((unitOption) => (
  //   <Menu.Item
  //     key={unitOption?.value}
  //     onClick={() =>
  //       update(id, {
  //         preferredUnit: unitOption?.value,
  //       })
  //     }
  //   >
  //     {unitOption?.label}{' '}
  //     {preferredUnit?.toLowerCase() === unitOption?.value && ' (selected)'}
  //   </Menu.Item>
  // ));

  const remove = () => mutate(removeWorkflow(chart, id));

  const updateAppearance = (diff: Partial<ChartTimeSeries>) =>
    mutate(updateWorkflow(chart, id, diff));

  return (
    <SourceRow onClick={() => onRowClick(id)} isActive={isSelected}>
      <td>
        <SourceItem key={id}>
          <SourceSquare
            onClick={(event) => {
              event.stopPropagation();
              update(id, {
                enabled: !enabled,
              });
            }}
            color={color}
            fade={!enabled}
          />
          {call && (
            <div
              style={{
                marginRight: 10,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FunctionCall
                id={call.functionId}
                callId={call.callId}
                renderLoading={() => renderStatusIcon('Running')}
                renderCall={({ status }) => renderStatusIcon(status)}
              />
            </div>
          )}
          <SourceName>
            <EditableText
              value={name || 'noname'}
              onChange={(value) => {
                update(id, { name: value });
                setIsEditingName(false);
              }}
              onCancel={() => setIsEditingName(false)}
              editing={isEditingName}
              hideButtons
            />
          </SourceName>
        </SourceItem>
      </td>
      {isWorkspaceMode && (
        <>
          <td>{name || 'noname'}</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td style={{ textAlign: 'right', paddingRight: 8 }}>
            <div role="none" onClick={(event) => event.stopPropagation()}>
              <Dropdown
                content={
                  <Menu>
                    <Menu.Header>
                      <span style={{ wordBreak: 'break-word' }}>
                        Select input unit (override)
                      </span>
                    </Menu.Header>
                    {unitOverrideMenuItems}
                  </Menu>
                }
              >
                <Button icon="Down" iconPlacement="right">
                  {inputUnitOption?.label || '-'}
                </Button>
              </Dropdown>
            </div>
          </td>
          <td style={{ textAlign: 'center', paddingLeft: 0 }} />
          {/* <td>
            <div role="none" onClick={(event) => event.stopPropagation()}>
              <Dropdown
                content={
                  <Menu onClick={(event) => event.stopPropagation()}>
                    <Menu.Header>
                      <span style={{ wordBreak: 'break-word' }}>
                        Select preferred unit
                      </span>
                    </Menu.Header>
                    {unitConversionMenuItems}
                  </Menu>
                }
              >
                <SourceItem>
                  <SourceName>{preferredUnitOption?.label || '-'}</SourceName>
                </SourceItem>
              </Dropdown>
            </div>
          </td> */}
          <td style={{ textAlign: 'center', paddingLeft: 0 }}>
            <Dropdown
              content={<AppearanceDropdown update={updateAppearance} />}
            >
              <Button
                variant="outline"
                icon="Timeseries"
                style={{ height: 28 }}
              />
            </Dropdown>
          </td>
          <td style={{ textAlign: 'center', paddingLeft: 0 }}>
            <Button
              variant="outline"
              icon="Delete"
              onClick={(event) => {
                if (isSelected) {
                  event.stopPropagation();
                }
                remove();
              }}
              style={{ height: 28 }}
            />
          </td>
          <td style={{ textAlign: 'center', paddingLeft: 0 }}>
            <Button
              variant="outline"
              icon="Info"
              onClick={(event) => {
                if (isSelected) {
                  event.stopPropagation();
                }
                onInfoClick(id);
              }}
              style={{ height: 28 }}
            />
          </td>
          <td style={{ textAlign: 'center', paddingLeft: 0 }}>
            <Dropdown
              content={
                <WorkflowMenu chart={chart} id={id}>
                  <Menu.Item
                    onClick={() => setMode('editor')}
                    appendIcon="YAxis"
                  >
                    <span>Edit calculation</span>
                  </Menu.Item>
                </WorkflowMenu>
              }
            >
              <Button
                variant="outline"
                icon="MoreOverflowEllipsisHorizontal"
                style={{ height: 28 }}
              />
            </Dropdown>
          </td>
        </>
      )}
    </SourceRow>
  );
}
