import { type ReactNode } from "react";
import getRegistrationsTableColumns from "./registrations-table-header";
import useGetRegistrationsSearchParams from "@/hooks/table-hooks/header-hooks/use-get-registrations-search-params";
import { getRegistrations } from "@/lib/api/event/event-registrations";
import { useParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTable } from "@/hooks/table-hooks/use-table";
import { Table } from "../../table/table";
import TableToolbar from "../../table/table-toolbar";
import { TablePagination } from "../../table/table-pagination";

export default function RegistrationsTable({
  segments,
}: {
  segments: string[];
}): ReactNode {
  const eventSlug = useParams().eventSlug!;

  const columns = getRegistrationsTableColumns(segments);
  const params = useGetRegistrationsSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["event-registrations", eventSlug, params],
    queryFn: () => getRegistrations(params, eventSlug).then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });

  const { table } = useTable({
    data: data?.results || [],
    columns,
    initialState: {
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        regPhoneNumber: false,
        regHasAttended: false,
        regSegments: false,
        regTransactionMethod: false,
      },
    },
    pageCount: data?.selectedCount
      ? Math.ceil(data.selectedCount / (params.perPage ?? 10))
      : -1,
    getRowId: (originalRow) => originalRow._id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <Table
      table={table}
      isLoading={isLoading}
      selectedLength={data?.selectedCount || 0}
      border={false}
      pagination={
        <>
          <TablePagination
            table={table}
            selectedLength={data?.selectedCount || 0}
            pageSize={table.getState().pagination.pageSize}
            onPageSizeChange={(newPageSize) => {
              table.setPageSize(Number(newPageSize));
            }}
            pageIndex={table.getState().pagination.pageIndex}
            onPageIndexChange={(newPageIndex) => {
              table.setPageIndex(newPageIndex);
            }}
          />
        </>
      }
    >
      <TableToolbar table={table} tId="registrations" />
    </Table>
  );
}
