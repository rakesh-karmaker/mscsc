import { Popover } from "@mui/material";
import { type Column, type Table } from "@tanstack/react-table";
import { useEffect, useState, type ReactNode } from "react";
import { LuCheck, LuSettings2 } from "react-icons/lu";
import ColumnInput, { ColumnLists, EmptyResults } from "./column-input";

interface TableViewOptionsProps<
  TData,
> extends React.HTMLAttributes<HTMLButtonElement> {
  table: Table<TData>;
  disabled?: boolean;
}

export default function TableViewOptions<TData>({
  table,
  disabled,
  ...rest
}: TableViewOptionsProps<TData>): ReactNode {
  const [open, setOpen] = useState<boolean>(false);

  const id = `popover-view-options`;
  const columns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide(),
    );

  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredColumns, setFilteredColumns] =
    useState<Column<TData, unknown>[]>(columns);

  useEffect(() => {
    if (searchValue === "") {
      setFilteredColumns(columns);
      return;
    }
    const filtered = columns.filter((column: Column<TData, unknown>) => {
      if (typeof column.columnDef.meta?.label === "string") {
        return column.columnDef.meta.label
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      }
      return false;
    });
    setFilteredColumns(filtered);
  }, [searchValue, columns]);

  return (
    <div>
      <button
        className="flex gap-1.5 items-center px-3! py-1.5! hover:bg-secondary-bg/70 transition-all cursor-pointer"
        aria-describedby={id}
        onClick={() => setOpen(!open)}
        {...rest}
      >
        <LuSettings2 />
        View
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={document.getElementById(id)}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="w-full h-full bg-secondary-bg/70 backdrop-blur-2xl rounded-md border border-gray-300">
          <ColumnInput
            placeholder="Search columns..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <ColumnLists>
            {filteredColumns.length > 0 ? (
              <div className="flex flex-col p-1!">
                {filteredColumns.map((column) => (
                  <TableViewItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onClick={() => column.toggleVisibility()}
                  >
                    {column.columnDef.meta?.label ?? column.id}
                  </TableViewItem>
                ))}
              </div>
            ) : (
              <EmptyResults />
            )}
          </ColumnLists>
        </div>
      </Popover>
    </div>
  );
}

function TableViewItem({
  checked,
  onClick,
  children,
}: {
  checked: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      className="w-full h-full flex gap-4 justify-between rounded-sm items-center px-2! py-1! hover:bg-secondary-bg/70 transition-all cursor-pointer"
      type="button"
      onClick={onClick}
    >
      <div className="w-full h-full flex gap-1 items-center">{children}</div>
      <p
        className="text-green-500 transition-opacity"
        style={{
          opacity: checked ? "100%" : "0%",
        }}
      >
        <LuCheck />
      </p>
    </button>
  );
}
