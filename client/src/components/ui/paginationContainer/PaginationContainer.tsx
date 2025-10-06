import type { Dispatch, ReactNode, SetStateAction } from "react";
import Pagination from "@mui/material/Pagination";

import "./paginationContainer.css";

type PaginationContainerProps = {
  length: number;
  elementsPerPage: number;
  setPage: Dispatch<SetStateAction<number>> | ((page: number) => void);
  currentPage: number;
};

export default function PaginationContainer({
  length,
  elementsPerPage,
  setPage,
  currentPage,
}: PaginationContainerProps): ReactNode {
  let pages = [];
  for (let i = 1; i <= Math.ceil(length / elementsPerPage); i++) {
    pages.push(i);
  }
  if (pages.length === 1 || pages.length === 0) return null;

  return (
    <div className="pagination row-center">
      <Pagination
        count={pages.length}
        page={currentPage}
        onChange={(_, page) => setPage(page)}
        size={window.innerWidth <= 1080 ? "small" : "large"}
      />
    </div>
  );
}
