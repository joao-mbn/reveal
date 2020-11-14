import React from 'react';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useExpanded,
  HeaderGroup,
  Column,
  Cell,
  Row,
} from 'react-table';
import Wrapper from '../../styles/TablesStyle';

interface ITableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
}

const makeData = [
  {
    timestamp: 1604920298134,
    status: 'Failed',
    statusSeen: 'Not seen',
  },
  { timestamp: 1604918198134, status: 'Failed', statusSeen: 'Seen' },
  { timestamp: 1604918198134, status: 'Success', statusSeen: 'Seen' },
  { timestamp: 1604918198134, status: 'Success', statusSeen: 'Seen' },
  { timestamp: 1604918198134, status: 'Success', statusSeen: 'Seen' },
  { timestamp: 1604923198134, status: 'Success', statusSeen: 'Seen' },
];

const Table = ({ columns, data }: any) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
    useExpanded // Use the useExpanded plugin hook
  );

  return (
    <table {...getTableProps()} className="cogs-table integrations-table">
      <thead>
        {headerGroups.map((headerGroup: HeaderGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: HeaderGroup) => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
                <div>
                  {column.disableSortBy ? column.render('Filter') : null}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row: Row) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              className={`cogs-table-row integrations-table-row ${
                row.isSelected ? 'row-active' : ''
              }`}
            >
              {row.cells.map((cell: Cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const SidePanelTable: any = () => {
  const data = React.useMemo(() => makeData, []);

  const columns: any = React.useMemo(
    () => [
      {
        Header: 'Time stamp',
        accessor: 'timestamp',
      },
      {
        Header: 'Status run',
        accessor: 'status',
      },
      {
        Header: 'Heartbeat',
        accessor: 'statusSeen',
      },
    ],
    []
  );

  return (
    <Wrapper>
      <Table columns={columns} data={data} />
    </Wrapper>
  );
};

export default SidePanelTable;
