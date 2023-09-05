import React from 'react';

import ViewLogsButton from '@functions-ui/components/buttons/ViewLogsButton';
import ViewResponseButton from '@functions-ui/components/buttons/ViewResponseButton';
import FunctionCall from '@functions-ui/components/FunctionCall';
import FunctionCallStatus from '@functions-ui/components/FunctionCallStatus';
import LoadingIcon from '@functions-ui/components/LoadingIcon';
import { Call } from '@functions-ui/types';
import { useCalls } from '@functions-ui/utils/hooks';
import { Alert, Table } from 'antd';
import moment from 'moment';

const callTableColumns = [
  {
    title: 'Call Time',
    key: 'Call Time',
    render: (call: Call) => {
      return (
        <FunctionCall
          id={call.functionId}
          callId={call.id}
          renderCall={(c) => {
            const startTime = moment.utc(c.startTime);
            const timeSince = moment(startTime).fromNow();
            return <>{timeSince}</>;
          }}
        />
      );
    },
  },
  {
    title: 'Duration',
    key: 'duration',
    render: (call: Call) => {
      return (
        <FunctionCall
          id={call.functionId}
          callId={call.id}
          renderCall={(c) => {
            // If the function isn't finished yet, show current duration with end time being now
            const endTime = moment.utc(c.endTime) || moment.utc(new Date());
            const startTime = moment.utc(c.startTime);

            // round up to the nearest second
            const duration = moment
              .utc(endTime.diff(startTime))
              .add(1, 'second')
              .startOf('second');
            return <>{duration.format('mm[m ]ss[s]')}</>;
          }}
        />
      );
    },
  },
  {
    title: 'Call Status',
    key: 'callStatus',
    render: (call: Call) => {
      return <FunctionCallStatus id={call.functionId} callId={call.id} />;
    },
  },
  {
    title: 'Response',
    key: 'response',
    render: (call: Call) => {
      return (
        <FunctionCall
          id={call.functionId}
          callId={call.id}
          renderCall={({ functionId, id, status }) => {
            if (status !== 'Running') {
              return <ViewResponseButton id={functionId} callId={id} />;
            }
            return null;
          }}
        />
      );
    },
  },
  {
    title: 'Logs',
    key: 'logs',
    render: (call: Call) => (
      <ViewLogsButton id={call.functionId} callId={call.id} />
    ),
  },
];

type Props = {
  id: number;
  name: string;
  scheduleId?: number;
};

export default function FunctionCalls({ id, name, scheduleId }: Props) {
  const { data, isFetched, error } = useCalls(
    { id, scheduleId },
    {
      refetchInterval: 2000,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  const functionCalls = data || [];

  if (error) {
    return (
      <Alert
        type="error"
        message={`Something went wrong when getting the function calls for ${name} (${id})`}
      />
    );
  }
  if (!isFetched) {
    return <LoadingIcon />;
  }

  return (
    <>
      <Table
        rowKey={(call) => call.id.toString()}
        pagination={{ pageSize: 25, showSizeChanger: false }}
        dataSource={functionCalls}
        columns={callTableColumns}
      />
    </>
  );
}