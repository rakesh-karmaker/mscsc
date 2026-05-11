import type { ReactNode } from "react";
import getRegistrationsTableColumns from "./registrations-table-header";
import useGetRegistrationsSearchParams from "@/hooks/table-hooks/header-hooks/use-get-registrations-search-params";
import {
  changeRegistrationStatus,
  editRegistration,
  getRegistrations,
} from "@/lib/api/event-registrations";
import { useParams } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useTable } from "@/hooks/table-hooks/use-table";
import { Table } from "../../table/table";
import TableToolbar from "../../table/table-toolbar";
import toast from "react-hot-toast";

export default function RegistrationsTable({
  segments,
}: {
  segments: string[];
}): ReactNode {
  const eventSlug = useParams().eventSlug!;
  const queryClient = useQueryClient();

  const registrationMutation = useMutation({
    mutationFn: ({
      method,
      registrationId,
      data,
    }: {
      method: "changeStatus" | "toggleAttendance";
      registrationId: string;
      data:
        | {
            status: "pending" | "validated" | "rejected";
            rejectionReason?: string;
          }
        | {
            hasAttended: boolean;
          };
    }) => {
      if (method === "changeStatus" && "status" in data) {
        return changeRegistrationStatus(
          eventSlug,
          registrationId,
          data.status,
          data.rejectionReason,
        );
      } else if (method === "toggleAttendance" && "hasAttended" in data) {
        return editRegistration(eventSlug, registrationId, {
          hasAttended: data.hasAttended,
        });
      }
      return Promise.reject(new Error("Invalid method or data"));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event-registrations", eventSlug],
      });
      toast.success("Registration updated successfully");
    },
  });

  const columns = getRegistrationsTableColumns(segments, registrationMutation);
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
        contactNumber: false,
        hasAttended: false,
        segments: false,
        transactionMethod: false,
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
