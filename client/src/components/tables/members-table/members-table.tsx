import { type ReactNode } from "react";
import getMembersTableColumns from "./members-table-columns";
import { useTable } from "@/hooks/use-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMembers } from "@/lib/api/member";
import { Table } from "../table/table";
import TableToolbar from "../table/table-toolbar";
import useGetMembersSearchParams from "@/hooks/use-get-members-search-params";

export default function MembersTable(): ReactNode {
  const columns = getMembersTableColumns();
  const params = useGetMembersSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["all-members", params],
    queryFn: () => getMembers(params).then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });

  const { table } = useTable({
    data: data?.results || [],
    columns,
    initialState: {
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        contactNumber: false,
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
    >
      <TableToolbar table={table} />
    </Table>
  );
}
