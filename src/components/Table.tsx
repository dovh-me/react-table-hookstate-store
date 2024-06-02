import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { Model, StoreList } from '../hookstate';
import { useHookstate } from '@hookstate/core';

const columnHelper = createColumnHelper<Model>();

const columns = [
  columnHelper.accessor('symbol', {
    cell: (info) => info.getValue(),
    header: 'Symbol',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.description, {
    id: 'description',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Description</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('change', {
    header: () => 'Change',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('exchange', {
    header: () => 'Exchange',
    cell: (info) => <b>{info.getValue()}</b>,
  }),
];

type TableProps = {
  data: StoreList;
};

function Table(props: TableProps) {
  const data = props.data.list.map((i) => i.get());
  const updater = useHookstate(props.data.meta.itemUpdated);
  console.log('updater', updater);

  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  );
}

export default Table;
