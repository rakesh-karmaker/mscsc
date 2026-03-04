import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import type * as React from "react";

// import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { getColumnPinningStyle } from "@/lib/table";
import { cn } from "@/utils/cn";
import {
  TableWrapper,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table-ui";

interface TableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
}

export function Table<TData>({
  table,
  actionBar,
  children,
  className,
  ...props
}: TableProps<TData>) {
  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
      {...props}
    >
      {children}
      <div className="overflow-hidden rounded-md border">
        <TableWrapper>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinningStyle({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getColumnPinningStyle({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableWrapper>
      </div>
      <div className="flex flex-col gap-2.5">
        {/* <DataTablePagination table={table} /> */}
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
