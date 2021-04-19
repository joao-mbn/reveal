import React from 'react';
import { Cell, CellProps, Column, HeaderProps } from 'react-table';
import { calculateStatus } from 'utils/integrationUtils';
import styled from 'styled-components';
import { Button } from '@cognite/cogs.js';
import { Integration } from 'model/Integration';
import UserGroup from 'components/integrations/cols/UserGroup';
import Name from 'components/integrations/cols/Name';
import Schedule from 'components/integrations/cols/Schedule';
import { DataSet } from 'components/integrations/cols/DataSet';
import StatusMarker from 'components/integrations/cols/StatusMarker';
import StatusFilterDropdown from 'components/table/StatusFilterDropdown';
import { User } from 'model/User';
import RelativeTimeWithTooltip from 'components/integrations/cols/RelativeTimeWithTooltip';
import SorterIndicator from 'components/table/SorterIndicator';
import MessageIcon from 'components/message/MessageIcon';
import { Status } from 'model/Status';
import { DataSetModel } from 'model/DataSetModel';

export enum TableHeadings {
  NAME = 'Name',
  STATUS = 'Status',
  LATEST_RUN = 'Latest run',
  DATA_SET = 'Destination data set',
  SCHEDULE = 'Schedule',
  LAST_SEEN = 'Last seen',
  CONTACTS = 'Contacts',
}

const StyledStatusButton = styled((props) => (
  <Button {...props}>{props.children}</Button>
))`
  background-color: transparent;
  border: none !important;
  font: inherit;
  padding: 0;
  white-space: nowrap;
  :focus {
    background-color: transparent;
  }
  :hover {
    background-color: transparent;
    box-shadow: none;
  }
  span {
    cursor: pointer !important;
  }
`;

interface OpenFailMessageFunc {
  (row: Integration): void;
}

export const createSearchStringForContacts = (contacts?: User[]) => {
  return `${contacts?.length ? contacts.map((aut) => aut.name).join() : ''}`;
};
export const createSearchStringForDataSet = (
  dataSetId: string,
  dataSet?: DataSetModel
) => {
  return `${dataSetId} ${dataSet ? dataSet.name : ''}`;
};

export const getIntegrationTableCol = (
  openFailMessage: OpenFailMessageFunc
): Column<Integration>[] => {
  return [
    {
      id: 'name',
      Header: ({ column }: HeaderProps<Integration>) => {
        return <SorterIndicator name={TableHeadings.NAME} column={column} />;
      },
      accessor: 'name',
      Cell: ({ row }: CellProps<Integration>) => {
        return (
          <Name
            name={row.values.name}
            integrationId={`${row.original.id}`}
            selected={row.isSelected}
          />
        );
      },
      sortType: 'basic',
      disableFilters: true,
    },
    {
      id: 'externalId',
      accessor: 'externalId',
      Cell: <></>,
      disableSortBy: true,
      disableFilters: true,
    },
    {
      id: 'status',
      Header: TableHeadings.STATUS,
      accessor: ({ lastSuccess, lastFailure }: Integration) => {
        const status = calculateStatus({ lastSuccess, lastFailure });
        return status.status;
      },
      Cell: ({ row }: CellProps<Integration>) => {
        return row.values.status === Status.FAIL ? (
          <StyledStatusButton
            onClick={() => {
              openFailMessage(row.original);
            }}
          >
            <StatusMarker id="status-marker" status={row.values.status} />
            <MessageIcon status={row.values.status} />
          </StyledStatusButton>
        ) : (
          <StatusMarker id="status-marker" status={row.values.status} />
        );
      },
      disableSortBy: true,
      Filter: StatusFilterDropdown,
      filter: 'includes',
      disableFilters: false,
    },
    {
      id: 'latestRun',
      Header: TableHeadings.LATEST_RUN,
      accessor: ({ lastSuccess, lastFailure }: Integration) => {
        const status = calculateStatus({ lastSuccess, lastFailure });
        return status.time;
      },
      Cell: ({ row }: Cell<Integration>) => {
        return (
          <RelativeTimeWithTooltip
            id="latest-run"
            time={row.values.latestRun as number}
          />
        );
      },
      disableSortBy: true,
      disableFilters: true,
    },
    {
      id: 'schedule',
      Header: TableHeadings.SCHEDULE,
      accessor: 'schedule',
      Cell: ({ row }: Cell<Integration>) => {
        return <Schedule id="schedule" schedule={row.values.schedule} />;
      },
      disableSortBy: true,
      disableFilters: true,
    },
    {
      id: 'lastSeen',
      Header: TableHeadings.LAST_SEEN,
      accessor: 'lastSeen',
      Cell: ({ row }: Cell<Integration>) => {
        return (
          <RelativeTimeWithTooltip
            id="last-seen"
            time={row.values.lastSeen as number}
          />
        );
      },
      disableSortBy: true,
      disableFilters: true,
    },
    {
      id: 'dataSetId',
      Header: TableHeadings.DATA_SET,
      accessor: (row: Integration) => {
        return createSearchStringForDataSet(row.dataSetId, row.dataSet);
      },
      Cell: ({ row }: Cell<Integration>) => {
        const id = row.original.dataSet?.name ?? row.original.dataSetId;
        return (
          <DataSet
            id="data-set-id"
            dataSetId={row.original.dataSetId}
            dataSetName={`${id}`}
          />
        );
      },
      disableSortBy: true,
      disableFilters: true,
    },
    {
      id: 'contacts',
      Header: TableHeadings.CONTACTS,
      accessor: (row: Integration) => {
        return createSearchStringForContacts(row.contacts);
      },
      Cell: ({ row }: Cell<Integration>) => {
        const { contacts } = row.original;
        return <UserGroup users={contacts} />;
      },
      disableSortBy: true,
      disableFilters: true,
    },
  ];
};
