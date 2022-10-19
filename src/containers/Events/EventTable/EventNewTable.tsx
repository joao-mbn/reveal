import React, { useMemo } from 'react';
import { CogniteEvent } from '@cognite/sdk';
import { Column } from 'react-table';
import { NewTable as Table, TableProps } from 'components/ReactTable/Table';
import { getNewColumnsWithRelationshipLabels } from 'utils';
import { RelationshipLabels } from 'types';

export type EventWithRelationshipLabels = RelationshipLabels & CogniteEvent;

const visibleColumns = ['type', 'description'];
export const EventNewTable = (
  props: Omit<TableProps<EventWithRelationshipLabels>, 'columns'> &
    RelationshipLabels
) => {
  const { relatedResourceType } = props;

  const isRelationshipTable = relatedResourceType === 'relationship';
  const columns = useMemo(() => {
    return getNewColumnsWithRelationshipLabels<CogniteEvent>(
      [
        Table.Columns.type,
        Table.Columns.description,
        Table.Columns.externalId,
        Table.Columns.lastUpdatedTime,
        Table.Columns.created,
        Table.Columns.id,
        Table.Columns.dataSet,
        Table.Columns.startTime,
        Table.Columns.endTime,
        Table.Columns.source,
        Table.Columns.assets,
      ] as Column<CogniteEvent>[],
      isRelationshipTable
    );
  }, [isRelationshipTable]);

  return (
    <Table<CogniteEvent>
      columns={columns}
      alwaysColumnVisible="type"
      visibleColumns={visibleColumns}
      {...props}
    />
  );
};
