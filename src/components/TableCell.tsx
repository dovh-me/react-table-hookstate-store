/* eslint-disable @typescript-eslint/no-explicit-any */
import { State, useHookstate } from "@hookstate/core";
import { CellContext } from "@tanstack/react-table";
import { Model } from "../hookstate";

type TableCellProps = {
  cell: CellContext<State<Model, object>, State<any, object>>;
};

export const TableCell = (props: TableCellProps) => {
  const scoped = useHookstate(props.cell.getValue()).get();
  console.log("rendering TableCell", scoped);

  return <i>{scoped}</i>;
};
