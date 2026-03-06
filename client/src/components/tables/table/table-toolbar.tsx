import { cn } from "@/utils/cn";
import type { Column, Table } from "@tanstack/react-table";
import { useCallback, type ReactNode } from "react";
import TableViewOptions from "./table-view-options";
import { LuSearch, LuX } from "react-icons/lu";
import { InputAdornment, TextField } from "@mui/material";
import TableMultiSelect from "./table-multi-select";

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
        "flex w-full items-start max-xs:items-end justify-between gap-2 p-1! flex-wrap-reverse max-xs:flex-col-reverse",
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
            className="flex gap-1.5 items-center px-3! py-1! h-10 rounded-sm border border-dashed border-black/20 hover:bg-lightest-black/20! transition-colors cursor-pointer"
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
            <TextField
              type="text"
              placeholder={columnMeta.placeholder ?? `Search...`}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              size="small"
              sx={{
                minWidth: window.innerWidth < 640 ? "100%" : "200px",
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LuSearch className="text-muted-foreground" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          );
        case "number":
          return (
            <div className="relative max-sm:w-full">
              <TextField
                inputMode="numeric"
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  // Allow only numeric input
                  if (/^\d*$/.test(value)) {
                    column.setFilterValue(value);
                  }
                }}
                size="small"
                sx={{
                  maxWidth: window.innerWidth < 640 ? "100%" : "9rem",
                  minWidth: window.innerWidth < 640 ? "100%" : "9rem",
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LuSearch className="text-muted-foreground" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {columnMeta.unit && (
                <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                  {columnMeta.unit}
                </span>
              )}
            </div>
          );
        case "select":
        case "multiSelect":
          return (
            <TableMultiSelect
              column={column}
              options={columnMeta.options || []}
              title={columnMeta.label ?? column.id}
              multiple={columnMeta.variant === "multiSelect"}
            />
          );
        default:
          return null;
      }
    }, [column, columnMeta]);

    return onFilterRender();
  }
}
