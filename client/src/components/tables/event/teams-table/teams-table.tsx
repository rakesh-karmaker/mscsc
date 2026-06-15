import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import getTeamsTableColumns from "./teams-table-header";
import useGetTeamsSearchParams from "@/hooks/table-hooks/header-hooks/use-get-teams-search-params";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTeams } from "@/lib/api/event/event-teams";
import { useTable } from "@/hooks/table-hooks/use-table";
import { Table } from "../../table/table";
import { TablePagination } from "../../table/table-pagination";
import TableToolbar from "../../table/table-toolbar";

export default function TeamsTable({
  segments,
}: {
  segments: {
    segmentSlug: string;
    isTeamSegment: boolean;
    isPaidSegment: boolean;
    fees: number;
  }[];
}): ReactNode {
  const eventSlug = useParams().eventSlug!;

  const columns = getTeamsTableColumns(segments);
  const params = useGetTeamsSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["event-teams", eventSlug, params],
    queryFn: () => getTeams(eventSlug, params).then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });

  const { table } = useTable({
    data: data?.results || [],
    columns,
    initialState: {
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        teamSegments: false,
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
