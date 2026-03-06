import { type ReactNode } from "react";
import { useTable } from "@/hooks/use-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Table } from "../table/table";
import TableToolbar from "../table/table-toolbar";
import getMessagesTableColumns from "./messages-table-columns";
import { getMessages } from "@/lib/api/message";
import useGetMessagesSearchParams from "@/hooks/use-get-messages-search-params";
import type { MessageTableData } from "@/types/message-types";

export default function MessagesTable({
  onViewClick,
  onDelete,
}: {
  onViewClick: (message: MessageTableData) => void;
  onDelete: (id: string) => void;
}): ReactNode {
  const columns = getMessagesTableColumns({ onViewClick, onDelete });
  const params = useGetMessagesSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["messages", params],
    queryFn: () => getMessages(params).then((res) => res.data),
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
