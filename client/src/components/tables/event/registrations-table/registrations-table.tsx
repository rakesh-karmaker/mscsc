import { useState, type ReactNode } from "react";
import getRegistrationsTableColumns from "./registrations-table-header";
import useGetRegistrationsSearchParams from "@/hooks/table-hooks/header-hooks/use-get-registrations-search-params";
import {
  changeRegistrationStatus,
  deleteRegistration,
  editRegistration,
  getRegistrations,
} from "@/lib/api/event/event-registrations";
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
  const [currentMethod, setCurrentMethod] = useState<
    "changeStatus" | "toggleAttendance" | "delete" | null
  >(null);

  const registrationMutation = useMutation({
    mutationFn: ({
      method,
      registrationId,
      data,
    }: {
      method: "changeStatus" | "toggleAttendance" | "delete";
      registrationId: string;
      data:
        | {
            status: "pending" | "validated" | "rejected";
            rejectionReason?: string;
          }
        | {
            hasAttended: boolean;
          }
        | {
            registrationId: string;
          };
    }) => {
      setCurrentMethod(method);
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
      } else if (method === "delete") {
        return deleteRegistration(eventSlug, registrationId);
      }
      return Promise.reject(new Error("Invalid method or data"));
    },
    onSuccess: () => {
      if (currentMethod == "delete") {
        queryClient.invalidateQueries({
          queryKey: ["event", eventSlug],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["event-registrations", eventSlug],
      });
      toast.success("Registration updated successfully");
      setCurrentMethod(null);
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
      border={false}
    >
      <TableToolbar table={table} />
    </Table>
  );
}
