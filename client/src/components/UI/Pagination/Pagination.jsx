import "./Pagination.css";

const Pagination = ({ length, elementsPerPage, setPage, currentPage }) => {
  let pages = [];
  for (let i = 1; i <= Math.ceil(length / elementsPerPage); i++) {
    pages.push(i);
  }
  if (pages.length === 1 || pages.length === 0) return null;

  return (
    <div className="pagination row-center">
      {pages[0] == currentPage ? null : (
        <PaginationActionBtn
          direction="left"
          setPage={setPage}
          currentPage={currentPage}
        />
      )}
      {pages.map((page, index) => {
        return (
          <button
            key={index}
            className={`page-number row-center ${
              page === currentPage ? "page-active" : ""
            }`}
            nav-type={page}
            onClick={() => {
              setPage(page);
            }}
            type="button"
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        );
      })}
      {pages[pages.length - 1] == currentPage ? null : (
        <PaginationActionBtn
          direction="right"
          setPage={setPage}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

const PaginationActionBtn = ({ direction, setPage, currentPage }) => {
  const handleClick = () => {
    if (direction === "left") setPage(currentPage - 1);
    else setPage(currentPage + 1);
  };
  return (
    <button
      className="pagination-btn row-center"
      onClick={handleClick}
      type="button"
      aria-label={`Toggle ${direction} page`}
    >
      <i className={`fa-solid fa-chevron-${direction}`}></i>
    </button>
  );
};

export default Pagination;
