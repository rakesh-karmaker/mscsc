import { useParams } from "react-router";
import getClubPartnersTableColumns from "./club-partners-table-header";
import { useState, type ReactNode } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getClubAllPartners } from "@/lib/api/event/club-partner";
import useClubPartnersSearchParams from "@/hooks/table-hooks/header-hooks/use-club-partners-search-params";
import { useTable } from "@/hooks/table-hooks/use-table";
import { Table } from "../../table/table";
import { TablePagination } from "../../table/table-pagination";
import TableToolbar from "../../table/table-toolbar";
import { TableBtn } from "@/components/ui/btns";
import { LuPlus } from "react-icons/lu";
import ClubPartnerFormModel from "@/components/forms/club-partner-form/club-partner-form-model";

export default function ClubPartnersTable(): ReactNode {
  const eventSlug = useParams().eventSlug!;

  const columns = getClubPartnersTableColumns(eventSlug);
  const params = useClubPartnersSearchParams();

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [modelOpen, setModelOpenState] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["club-partners", eventSlug, pageIndex, perPage, params],
    queryFn: () =>
      getClubAllPartners(
        {
          page: pageIndex,
          perPage,
          name: params.clubName,
          status: params.clubStatus,
        },
        eventSlug,
      ).then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  const { table } = useTable({
    data: data?.results || [],
    columns,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
    pageCount: data?.selectedCount
      ? Math.ceil(data.selectedCount / (params.perPage ?? 10))
      : -1,
    getRowId: (originalRow) => originalRow._id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <div className="w-full flex flex-col gap-4 p-5! shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] rounded-lg">
      <p className="text-2xl font-medium text-text-primary">Club Partners</p>
      <Table
        table={table}
        isLoading={isLoading}
        selectedLength={data?.selectedCount || 0}
        border={false}
        header={false}
        pagination={
          <>
            <TablePagination
              table={table}
              selectedLength={data?.selectedCount || 0}
              pageSize={perPage}
              onPageSizeChange={(newPageSize) => {
                setPerPage(Number(newPageSize));
              }}
              pageIndex={pageIndex}
              onPageIndexChange={(newPageIndex) => {
                setPageIndex(newPageIndex);
              }}
            />
          </>
        }
      >
        <TableToolbar table={table} tId="clubPartners" viewOptions={false}>
          <>
            <TableBtn
              onClick={() => setModelOpenState(true)}
              className={
                "max-w-fit bg-highlighted-color gap-1 text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20 transition-all duration-200"
              }
            >
              <LuPlus />
              <p>Add</p>
            </TableBtn>
            <ClubPartnerFormModel
              setOpen={() => {}}
              setClubPartnerModelOpen={setModelOpenState}
              clubPartnerModelOpen={modelOpen}
            />
          </>
        </TableToolbar>
      </Table>
    </div>
  );
}
