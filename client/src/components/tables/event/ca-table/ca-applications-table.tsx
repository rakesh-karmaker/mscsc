import { getCaApplications } from "@/lib/api/event/ca-applications";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { useParams } from "react-router-dom";
import getCaApplicationTableColumns from "./ca-applications-table-header";
import useGetCaApplicationSearchParams from "@/hooks/table-hooks/header-hooks/use-get-ca-applications-search-params";
import { useTable } from "@/hooks/table-hooks/use-table";
import { Table } from "../../table/table";
import TableToolbar from "../../table/table-toolbar";
import { TablePagination } from "../../table/table-pagination";

export default function CaApplicationsTable(): ReactNode {
  const eventSlug = useParams().eventSlug!;

  const columns = getCaApplicationTableColumns();
  const params = useGetCaApplicationSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["caApplications", eventSlug, params],
    queryFn: () => getCaApplications(eventSlug, params).then((res) => res.data),
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    placeholderData: keepPreviousData,
  });

  const { table } = useTable({
    data: data?.results || [],
    columns,
    initialState: {
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        phoneNumber: false,
        hasPreviousExperience: false,
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
      <TableToolbar table={table} tId="ca-applications" />
    </Table>
  );
}
