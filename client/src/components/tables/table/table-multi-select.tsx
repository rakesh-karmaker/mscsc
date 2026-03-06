import type { Option } from "@/types/table-types";
import type { Column } from "@tanstack/react-table";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { LuPlus, LuX } from "react-icons/lu";
import FilterBadge from "./filter-badge";
import { Checkbox, Popover } from "@mui/material";
import ColumnInput, { EmptyResults, ColumnLists } from "./column-input";

interface TableMultiSelectProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
  multiple?: boolean;
}

export default function TableMultiSelect<TData, TValue>({
  column,
  title,
  options,
  multiple,
}: TableMultiSelectProps<TData, TValue>): ReactNode {
  const [open, setOpen] = useState(false);

  const columnFilterValue = column?.getFilterValue();
  const selectedValues = new Set(
    Array.isArray(columnFilterValue) ? columnFilterValue : [],
  );

  const onItemSelect = useCallback(
    (option: Option, isSelected: boolean) => {
      if (!column) return;

      if (multiple) {
        const newSelectedValues = new Set(selectedValues);
        if (isSelected) {
          newSelectedValues.delete(option.value);
        } else {
          newSelectedValues.add(option.value);
        }
        const filterValues = Array.from(newSelectedValues);
        column.setFilterValue(filterValues.length ? filterValues : undefined);
      } else {
        column.setFilterValue(isSelected ? undefined : [option.value]);
        setOpen(false);
      }
    },
    [column, multiple, selectedValues],
  );

  const onReset = useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      column?.setFilterValue(undefined);
    },
    [column],
  );

  const id = `popover-multi-select-${column?.id}`;

  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  useEffect(() => {
    if (searchValue === "") {
      setFilteredOptions(options);
      return;
    }
    const filtered = options.filter((option) => {
      if (option.label.toLowerCase().includes(searchValue.toLowerCase())) {
        return true;
      }
      return false;
    });
    setFilteredOptions(filtered);
  }, [searchValue, options]);

  return (
    <div>
      <button
        type="button"
        id={id}
        className="flex gap-1.5 items-center px-3! py-1.5! hover:bg-secondary-bg/70 transition-all cursor-pointer"
        aria-describedby={id}
        onClick={() => setOpen(!open)}
      >
        {selectedValues?.size > 0 ? (
          <div
            aria-label={`Clear ${title} filter`}
            onClick={onReset}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <LuX />
          </div>
        ) : (
          <LuPlus />
        )}
        {title}
        {selectedValues?.size > 0 && (
          <div className="w-full ml-3! pl-3! relative before:w-px before:h-full before:bg-white before:absolute before:left-0 before:top-0 flex gap-1">
            <FilterBadge className="lg:hidden">
              {selectedValues.size}
            </FilterBadge>
            <div className="hidden items-center gap-1 lg:flex">
              {selectedValues.size > 2 ? (
                <FilterBadge className="rounded-sm px-1 font-normal">
                  {selectedValues.size} selected
                </FilterBadge>
              ) : (
                options
                  .filter((option) => selectedValues.has(option.value))
                  .map((option) => (
                    <FilterBadge
                      key={option.value}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </FilterBadge>
                  ))
              )}
            </div>
          </div>
        )}
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={document.getElementById(id)}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className="w-full h-full flex flex-col bg-secondary-bg/70 backdrop-blur-2xl rounded-md border border-gray-300">
          <ColumnInput
            placeholder={`Search ${title}...`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <ColumnLists>
            {filteredOptions.length > 0 ? (
              <div className="flex flex-col p-1!">
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.has(option.value);
                  return (
                    <OptionItem
                      key={option.value}
                      option={option}
                      isSelected={isSelected}
                      onSelect={onItemSelect}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyResults />
            )}
          </ColumnLists>

          {selectedValues.size > 0 && (
            <div className="p-2! border-t border-gray-300">
              <button
                className="text-sm text-blue-500 hover:text-blue-700 text-center w-full"
                onClick={onReset}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
}

function OptionItem({
  option,
  isSelected,
  onSelect,
}: {
  option: Option;
  isSelected: boolean;
  onSelect: (option: Option, isSelected: boolean) => void;
}): ReactNode {
  return (
    <button
      className="w-full h-full flex gap-4 justify-between rounded-sm items-center px-2! py-1! hover:bg-secondary-bg/70 transition-all cursor-pointer"
      type="button"
      onClick={() => onSelect(option, isSelected)}
    >
      <div className="w-full h-full flex gap-1 items-center">
        <Checkbox
          checked={isSelected}
          onChange={() => onSelect(option, isSelected)}
          readOnly
          size="small"
        />
        <p className="text-sm">{option.label}</p>
      </div>
      {option.count && <p className="ml-auto! text-xs">{option.count}</p>}
    </button>
  );
}
