import "./Pagination.css";
import Pagination from "@mui/material/Pagination";

const PaginationContainer = ({
  length,
  elementsPerPage,
  setPage,
  currentPage,
}) => {
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
        onChange={(e, page) => setPage(page)}
      />
    </div>
  );
};

export default PaginationContainer;
