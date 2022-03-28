import React from 'react';

import classNames from 'classnames';
import styled from 'styled-components/macro';

import { Label, Tooltip } from '@cognite/cogs.js';
import type {
  BoundaryConditionValue,
  ModelFile,
} from '@cognite/simconfig-api-sdk/rtk';

import { CopyValue } from 'components/molecules/CopyValue';
import { getFormattedSciNumber } from 'utils/numberUtils';

interface BoundaryConditionTableProps {
  modelFile?: ModelFile;
  boundaryConditions?: BoundaryConditionValue[];
}

export function BoundaryConditionTable({
  modelFile,
  boundaryConditions,
}: BoundaryConditionTableProps) {
  if (!boundaryConditions?.length) {
    if (modelFile?.metadata.errorMessage !== undefined) {
      return (
        <ProcessingStatus icon="WarningTriangleFilled" variant="warning">
          Processing failed: {modelFile.metadata.errorMessage}
        </ProcessingStatus>
      );
    }
    return <ProcessingStatus icon="Loader">Processing...</ProcessingStatus>;
  }

  return (
    <BoundaryConditionsTableContainer>
      {boundaryConditions.map(
        ({ variableName, displayUnit, current, previous }) => (
          <div className="entry" key={variableName}>
            <div className="label">{variableName}</div>
            <CopyValue
              tooltip={
                <React.Fragment key={`${variableName}-copy-value`}>
                  Copy raw value to clipboard: <code>{current}</code>
                </React.Fragment>
              }
              value={current}
            />
            <div className="change">
              <Tooltip
                content={
                  <>
                    Previous value:{' '}
                    {previous ? getFormattedSciNumber(previous) : 'n/a'}
                  </>
                }
              >
                <>
                  {previous && previous > current ? (
                    <span className="lower">▾</span>
                  ) : null}
                  {previous && current > previous ? (
                    <span className="higher">▴</span>
                  ) : null}
                </>
              </Tooltip>
            </div>
            <div
              className={classNames('value', {
                'higher-value': previous && previous < current,
                'lower-value': previous && previous > current,
              })}
            >
              <span>{getFormattedSciNumber(current)}</span>
            </div>
            <div className="unit">{displayUnit}</div>
          </div>
        )
      )}
    </BoundaryConditionsTableContainer>
  );
}

const BoundaryConditionsTableContainer = styled.div`
  --columns-repeat: 2;
  display: grid;
  grid-template-columns: repeat(var(--columns-repeat), 3fr 0fr auto auto 1fr);
  grid-gap: 6px;
  align-items: baseline;
  .entry {
    display: contents;
    & > div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .change {
    overflow: visible !important;
  }
  .value {
    text-align: right;
    overflow: visible;
  }
  .unit {
    opacity: 0.7;
    font-size: var(--cogs-detail-font-size);
  }
  .higher,
  .lower {
    cursor: help;
  }
  .higher {
    color: var(--cogs-green-3);
  }
  .higher-value span {
    background: var(--cogs-green-8);
    color: var(--cogs-green-1);
  }
  .lower {
    color: var(--cogs-red-3);
  }
  .lower-value span {
    background: var(--cogs-red-8);
    color: var(--cogs-red-1);
  }
`;

const ProcessingStatus = styled(Label)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
