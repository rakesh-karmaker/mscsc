const Pagination = ({
  totalActivities,
  activitiesPerPAge,
  setCurrentPage,
  currentPage,
}) => {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalActivities / activitiesPerPAge); i++) {
    pages.push(i);
  }
  if (pages.length === 1) return null;

  return (
    <div className="pagination row-center">
      {pages[0] == currentPage ? null : (
        <PaginationActionBtn
          direction="left"
          setCurrentPage={setCurrentPage}
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
              setCurrentPage(page);
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
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

const PaginationActionBtn = ({ direction, setCurrentPage, currentPage }) => {
  const handleClick = () => {
    if (direction === "left") setCurrentPage(currentPage - 1);
    else setCurrentPage(currentPage + 1);
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
