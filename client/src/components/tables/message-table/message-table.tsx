import type { MessageType } from "@/types/message-types";
import type { Dispatch, SetStateAction } from "react";
import Empty from "@/components/ui/empty/empty";
import PaginationContainer from "@/components/ui/pagination-container/pagination-container";
import TableRow from "./table-row";

import "./message-table.css";

type MessageTableProps = {
  headers: {
    title: string;
    key: string;
    break?: boolean;
    duplicate?: boolean;
  }[];
  data: MessageType[];
  length: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  needPagination?: boolean;
  onViewClick: (id: string, isNew: boolean) => void;
  onDelete: (id: string) => void;
};

export default function MessageTable({
  headers,
  data,
  length,
  page,
  setPage,
  ...rest
}: MessageTableProps) {
  if (length === 0) return <Empty />;
  const elementsPerPage = 10;

  return (
    <div className="table-container">
      <div>
        <table>
          <thead>
            <tr>
              {headers.map((header, index) =>
                header.break &&
                window.innerWidth < 1240 ? null : !header.duplicate ? (
                  <th key={`${index}-${header.key}`}>{header.title}</th>
                ) : null
              )}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, index) => (
              <TableRow key={index} row={row} headers={headers} {...rest} />
            ))}
          </tbody>
        </table>
      </div>
      {rest?.needPagination === false ? null : (
        <PaginationContainer
          length={length}
          elementsPerPage={elementsPerPage}
          setPage={setPage}
          currentPage={page}
        />
      )}
    </div>
  );
}
