import Schedule, {
  InteractiveCopyWrapper,
} from 'components/extpipes/cols/Schedule';
import React from 'react';
import { DataSet } from '@cognite/sdk';
import StatusMarker from 'components/extpipes/cols/StatusMarker';
import InteractiveCopy from 'components/InteractiveCopy/InteractiveCopy';
import { DataSet as DataSetDisplay } from 'components/extpipes/cols/DataSet';
import RelativeTimeWithTooltip from 'components/extpipes/cols/RelativeTimeWithTooltip';
import {
  ExtpipeFieldName,
  ExtpipeFieldValue,
  ExtpipeRawTable,
} from 'model/Extpipe';
import RawTable from 'components/extpipes/cols/RawTable';
import { RunStatus } from 'model/Runs';

interface DetailsValueViewProps {
  fieldValue: ExtpipeFieldValue;
  fieldName: ExtpipeFieldName;
}

const DetailsValueView = ({ fieldValue, fieldName }: DetailsValueViewProps) => {
  switch (fieldName) {
    case 'lastUpdatedTime':
    case 'lastSeen':
    case 'createdTime':
    case 'latestRun':
      return (
        <RelativeTimeWithTooltip id={fieldName} time={fieldValue as number} />
      );
    case 'schedule': {
      const val = (fieldValue as string) ?? undefined;
      return <Schedule id={fieldName} schedule={val} />;
    }
    case 'dataSetId': {
      const val = (fieldValue as number) ?? undefined;
      return (
        <>
          <DataSetDisplay dataSetId={val} />
        </>
      );
    }
    case 'dataSet': {
      const { id } = fieldValue as DataSet;
      return <>{fieldValue && <DataSetDisplay dataSetId={id} />}</>;
    }
    case 'rawTables': {
      return <RawTable rawTables={fieldValue as ExtpipeRawTable[]} />;
    }
    case 'externalId':
      return (
        <InteractiveCopyWrapper id={fieldName}>
          {fieldValue}{' '}
          <InteractiveCopy
            showTextInTooltip={false}
            text={`${fieldValue}`}
            copyType="externalId"
          />
        </InteractiveCopyWrapper>
      );
    case 'source':
      return (
        <InteractiveCopyWrapper id={fieldName}>
          {fieldValue}{' '}
          {fieldValue && (
            <InteractiveCopy
              showTextInTooltip={false}
              text={`${fieldValue}`}
              copyType="source"
            />
          )}
        </InteractiveCopyWrapper>
      );
    case 'id':
      return (
        <InteractiveCopyWrapper id={fieldName}>
          {fieldValue}{' '}
          <InteractiveCopy
            showTextInTooltip={false}
            text={`${fieldValue}`}
            copyType="id"
          />
        </InteractiveCopyWrapper>
      );
    case 'status': {
      return <StatusMarker id={fieldName} status={fieldValue as RunStatus} />;
    }
    case 'createdBy':
    case 'name':
    case 'lastSuccess':
    case 'lastFailure':
    case 'metadata':
    case 'description':
    case 'contacts':
      return <span id={fieldName}>{fieldValue}</span>;
    default:
      return <span id={fieldName}>{fieldValue}</span>;
  }
};

export default DetailsValueView;
