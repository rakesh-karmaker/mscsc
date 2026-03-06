import { cn } from "@/utils/cn";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import type { Table } from "@tanstack/react-table";

interface TablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  selectedLength: number;
}

export function TablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  selectedLength,
  className,
  ...props
}: TablePaginationProps<TData>) {
  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse items-center justify-between gap-4 p-1! sm:flex-row sm:gap-8",
        className,
      )}
      {...props}
    >
      <div className="flex-1 whitespace-nowrap text-muted-foreground text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2!">
          <p className="whitespace-nowrap font-medium text-sm">Rows per page</p>
          <FormControl fullWidth size="small">
            <InputLabel id="pagination-rows">Rows</InputLabel>
            <Select
              labelId="pagination-rows"
              id="pagination-rows-select"
              value={table.getState().pagination.pageSize || 10}
              label="Rows"
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {pageSizeOptions.map((pageSize) => (
                <MenuItem key={pageSize} value={pageSize}>
                  {pageSize}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Pagination
          page={table.getState().pagination.pageIndex + 1}
          count={Math.ceil(
            selectedLength / table.getState().pagination.pageSize,
          )}
          variant="outlined"
          shape="rounded"
          onChange={(_, value) => {
            table.setPageIndex(value - 1);
          }}
        />
      </div>
    </div>
  );
}
