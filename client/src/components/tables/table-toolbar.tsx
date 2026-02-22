import { cn } from "@/utils/cn";
import type { Column, Table } from "@tanstack/react-table";
import { useCallback, type ReactNode } from "react";
import TableViewOptions from "./table/table-view-options";
import { LuX } from "react-icons/lu";
import { TextField } from "@mui/material";

interface TableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
}

export default function TableToolbar<TData>({
  table,
  className,
  ...rest
}: TableToolbarProps<TData>): ReactNode {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = table
    .getAllColumns()
    .filter((column) => column.getCanFilter());

  const onReset = useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 p-1!",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <button
            aria-label="Reset filters"
            className="border-dashed"
            onClick={onReset}
          >
            <LuX />
            Reset
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <TableViewOptions table={table} />
      </div>
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
  column,
}: DataTableToolbarFilterProps<TData>) {
  {
    const columnMeta = column.columnDef.meta;

    const onFilterRender = useCallback(() => {
      if (!columnMeta?.variant) return null;

      // Render different filter components based on the variant
      switch (columnMeta.variant) {
        case "text":
          return (
            <input
              type="text"
              placeholder={columnMeta.placeholder ?? `Search...`}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="border rounded px-2! py-1!"
            />
          );
        case "number":
          return (
            <div className="relative">
              <TextField
                type="number"
                inputMode="numeric"
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className={cn("h-8 w-30", columnMeta.unit && "pr-8")}
              />
              {columnMeta.unit && (
                <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                  {columnMeta.unit}
                </span>
              )}
            </div>
          );
        case "multiSelect":
      }
    }, [column, columnMeta]);

    return onFilterRender();
  }
}
