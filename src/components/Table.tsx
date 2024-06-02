import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Model, StoreList } from "../hookstate";
import { State, useHookstate } from "@hookstate/core";

const columnHelper = createColumnHelper<State<Model, object>>();

const columns = [
  columnHelper.accessor("symbol", {
    cell: (info) => info.getValue().get(),
    header: "Symbol",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.description, {
    id: "description",
    cell: (info) => <i>{info.getValue().get()}</i>,
    header: () => <span>Description</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("change", {
    header: () => "Change",
    cell: (info) => info.getValue().get(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("exchange", {
    header: () => "Exchange",
    cell: (info) => <b>{info.getValue().get()}</b>,
  }),
];

type TableProps = {
  data: StoreList;
};

function Table(props: TableProps) {
  const data = props.data.list;
  useHookstate(props.data.meta.itemUpdated).get();
  useHookstate(props.data.meta.itemAdded).get();

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
    </div>
  );
}

export default Table;
