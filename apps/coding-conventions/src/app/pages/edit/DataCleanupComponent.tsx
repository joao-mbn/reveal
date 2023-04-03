/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { memoize } from 'lodash';
import React, { useEffect } from 'react';
import { useTable } from 'react-table';
import styled from 'styled-components';
import { getCellById, handleOnPasteEvent, pasteShiftV } from './helpers';
import { PasteDelimiter, SelectPasteFormat } from './SelectPasteFormat';

const MAX_COLUMNS = 8;
const MIN_ROW_LENGTH = 50;
const NEW_ROW_COUNT = 50;
export const SPLITROWCOL = 'row-column-';

const getCellId = (rowIndex: number, columnId: string) => {
  return rowIndex + SPLITROWCOL + columnId;
};

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
  selectedProps,
  setPasteFormat,
  pasteFormat,
}: any) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyData(index, id, e.target.value);
  };
  return (
    <div>
      {pasteFormat === undefined &&
        selectedProps[getCellId(index, id)] === true && (
          <SelectPasteFormat onPasteFormatChange={setPasteFormat} />
        )}
      <input
        style={{
          width: '100%',
        }}
        value={initialValue}
        onChange={onChange}
        id={index + SPLITROWCOL + id}
      />
    </div>
  );
};

const defaultColumn = {
  Cell: EditableCell,
};

const addNewRows = (setter: (a: any) => void, count?: number) => {
  setter((old: any[]) => {
    const currentLength = old.length;
    const emptyRows = count || NEW_ROW_COUNT;
    const emptyRowsArray = Array.from({ length: emptyRows }, (_, i) => ({
      id: 'idRow' + currentLength + i,
    }));
    return [...old, ...emptyRowsArray];
  });
};

export function Table({ columns, dataSource, onDataSourceChange }: any) {
  const [newColumns, setNewColumns] = React.useState(columns);

  const [pasteFormat, setPasteFormat] = React.useState<PasteDelimiter>(' ');
  const [selectedProps, setSelectedProps] = React.useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const emptyColumns = MAX_COLUMNS - columns.length;
    if (emptyColumns < 0) {
      return;
    }

    const emptyColumnsLeft = Math.floor(emptyColumns / 2);
    const emptyColumnsRight = emptyColumns - emptyColumnsLeft;

    const emptyColumnsLeftArray = Array.from(
      { length: emptyColumnsLeft },
      (_, i) => ({
        Header: '',
        accessor: `empty-${i}`,
      })
    );

    const emptyColumnsRightArray = Array.from(
      { length: emptyColumnsRight },
      (_, i) => ({
        Header: '',
        accessor: `empty+${i}`,
      })
    );

    setNewColumns([
      ...emptyColumnsLeftArray,
      ...columns,
      ...emptyColumnsRightArray,
    ]);

    if (dataSource.length < MIN_ROW_LENGTH) {
      addNewRows(onDataSourceChange, MIN_ROW_LENGTH - dataSource.length);
    }
  }, []);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      addNewRows(onDataSourceChange);
    }
  };

  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    onDataSourceChange((old: any[]) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          if (columnId === 'key') {
            return {
              ...old[rowIndex],
              id: 'idRow' + rowIndex,
              [columnId]: value,
            };
          }
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }

        return row;
      })
    );
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns: newColumns,
      data: dataSource,
      defaultColumn,
      initialState: {
        // @ts-ignore
        selectedCellIds: {},
      },
      updateMyData,
      selectedProps,
      setPasteFormat,
      pasteFormat,
    });

  const [selectedStartId, setSelectedStartId] = React.useState('');
  const [selectedCellIdsState, setSelectedCellIdsState] = React.useState<
    string[]
  >([]);
  const [lastVisitedCellId, setLastVisitedCellId] = React.useState('');

  const onPaste = (e: ClipboardEvent) => {
    if (e.clipboardData === null) {
      return;
    }
    if (selectedCellIdsState.length === 0) {
      return;
    }
    e.preventDefault();
    handleOnPasteEvent(e, selectedCellIdsState, rows, updateMyData);
    setSelectedCellIdsState([]);
  };

  // on control + a to select all cells
  const onKeyPressHandling = (e: KeyboardEvent) => {
    if ((e.ctrlKey && e.key === 'a') || (e.metaKey && e.key === 'a')) {
      e.preventDefault();
      const allCellIds = rows.reduce((acc: any, row: any) => {
        const cellIds = row.cells.map(
          (cell: any) => row.id + SPLITROWCOL + cell.column.id
        );
        return [...acc, ...cellIds];
      }, []);
      setSelectedCellIdsState(allCellIds);
    }
    // on backspace to delete content of all selected cells
    if (e.key === 'Backspace' && selectedCellIdsState.length > 0) {
      if (
        selectedCellIdsState.length === 1 &&
        document.activeElement?.tagName === 'INPUT'
      ) {
        return;
      }

      e.preventDefault();
      const cellIds = selectedCellIdsState;
      const cells = cellIds.map((cellId) => getCellById(rows, cellId));

      cells.forEach((cell) => {
        const { row, column } = cell;
        const cellValue = '';
        updateMyData(row.index, column.id, cellValue);
      });
      setSelectedCellIdsState([]);
    }

    // on control + c to copy selected cells
    if ((e.ctrlKey && e.key === 'c') || (e.metaKey && e.key === 'c')) {
      e.preventDefault();
      if (selectedCellIdsState.length === 0) {
        const currentCell = e.target as HTMLInputElement;
        const cellValue = currentCell.value;
        navigator.clipboard.writeText(cellValue);
        return;
      }

      const SEPERATORCHAR = '\t';
      const cellIds = selectedCellIdsState;
      const cells = cellIds.map((cellId) => getCellById(rows, cellId));

      const text = cells.reduce((acc: string, cell: any, index: number) => {
        const { row, column } = cell;
        const cellValue = row.values[column.id] || '';

        if (index === 0) {
          acc += cellValue;
        } else if (cells[index - 1].row.index !== row.index) {
          acc +=
            `
    ` + cellValue;
        } else {
          acc += SEPERATORCHAR + cellValue;
        }
        return acc;
      }, '');

      navigator.clipboard.writeText(text);
    }

    // control shift v to paste
    if (
      (e.ctrlKey && e.shiftKey && e.key === 'v') ||
      (e.metaKey && e.shiftKey && e.key === 'v')
    ) {
      e.preventDefault();
      const lowRightCellId =
        selectedCellIdsState[selectedCellIdsState.length - 1];

      setSelectedProps({ [lowRightCellId]: true });
      setPasteFormat(undefined);
    }
  };

  React.useEffect(() => {
    if (pasteFormat === undefined || pasteFormat === null) {
      // We just pasted something, wait for the user to input the format.
    } else {
      navigator.clipboard.readText().then((text) => {
        pasteShiftV(
          text,
          pasteFormat,
          selectedCellIdsState,
          rows,
          updateMyData
        );
        setPasteFormat(null);
        setSelectedProps({});
        setSelectedCellIdsState([]);
      });
    }
  }, [pasteFormat]);

  React.useEffect(() => {
    document.addEventListener('paste', onPaste);
    document.addEventListener('keydown', onKeyPressHandling);
    return () => {
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('keydown', onKeyPressHandling);
    };
  }, [selectedCellIdsState]);

  const findInBetweenCells = (startId: string, endId: string) => {
    const table = document.getElementById('table');
    const startCell = table?.querySelector(`[id="${startId}"]`);
    const endCell = table?.querySelector(`[id="${endId}"]`);

    if (!startCell || !endCell) {
      return [];
    }

    const startCellRect = startCell.getBoundingClientRect();
    const endCellRect = endCell.getBoundingClientRect();

    const topLeft = {
      x: Math.min(startCellRect.x, endCellRect.x),
      y: Math.min(startCellRect.y, endCellRect.y),
    };
    const bottomRight = {
      x: Math.max(startCellRect.x, endCellRect.x),
      y: Math.max(startCellRect.y, endCellRect.y),
    };

    const allCells = table?.querySelectorAll('input');
    const allCellsArray = Array.from(allCells || []);

    const inBetweenCells = allCellsArray.filter((cell) => {
      const cellRect = cell.getBoundingClientRect();
      return (
        cellRect.x >= topLeft.x &&
        cellRect.x <= bottomRight.x &&
        cellRect.y >= topLeft.y &&
        cellRect.y <= bottomRight.y
      );
    });

    return inBetweenCells.map((cell) => cell.id);
  };

  const handlePointerDown = (e: any) => {
    if (!(e.target.id as string).includes(SPLITROWCOL)) {
      return;
    }
    setSelectedStartId(e.target.id);
    setSelectedCellIdsState([e.target.id]);
  };

  React.useEffect(() => {
    if (selectedStartId !== '') {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = 'auto';
    }
  }, [selectedStartId]);

  const handlePointerUp = (_e: any) => {
    setSelectedStartId('');
  };

  const findInBetweenCellsMemorized = memoize(findInBetweenCells);

  const handlePointerMove = (e: any) => {
    if (selectedStartId === '') {
      return;
    }
    if (e.target.id === lastVisitedCellId) {
      return;
    }

    const newIds = findInBetweenCellsMemorized(selectedStartId, e.target.id);
    setSelectedCellIdsState(newIds);
    setLastVisitedCellId(e.target.id);
  };

  const handlePointerLeave = (_e: any) => {
    if (selectedStartId === '') {
      return;
    }
    setSelectedStartId('');
  };

  return (
    <div className="App">
      <TableContainer onScroll={handleScroll}>
        <table
          {...getTableProps()}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          id="table"
        >
          <thead>
            {headerGroups.map(
              (headerGroup: {
                getHeaderGroupProps: () => JSX.IntrinsicAttributes &
                  React.ClassAttributes<HTMLTableRowElement> &
                  React.HTMLAttributes<HTMLTableRowElement>;
                headers: any[];
              }) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              )
            )}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, _i: any) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    const color = selectedCellIdsState.includes(
                      row.index + SPLITROWCOL + cell.column.id
                    )
                      ? 'red'
                      : 'white';
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={
                          row.index +
                          SPLITROWCOL +
                          cell.column.id +
                          'color-' +
                          color
                        }
                        style={{
                          backgroundColor: color,
                        }}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableContainer>
    </div>
  );
}

const TableContainer = styled.div`
  overflow-y: scroll;
  height: 500px;
  width: 100%;
`;