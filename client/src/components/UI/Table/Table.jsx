import { Link } from "react-router-dom";
import "./Table.css";
import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";
import EmptyData from "@/components/UI/EmptyData/EmptyData";
import PaginationContainer from "@/components/UI/Pagination/Pagination";
import { v4 as uuidv4 } from "uuid";

const Table = ({ headers, data, length, page, setPage, ...rest }) => {
  if (length === 0) return <EmptyData />;
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
              <TableRow key={index} row={row} headers={headers} />
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
};

const TableRow = ({ row, headers }) => {
  return (
    <tr className={row?.role === "admin" ? "admin" : ""}>
      {headers.map((header) =>
        header.break && window.innerWidth < 1240 ? null : (
          <td
            key={`${row._id}-${header.key}-${header.title}-${uuidv4()}`}
            className={header.key}
          >
            {getTableCell(row, header)}
          </td>
        )
      )}
    </tr>
  );
};

const getTableCell = (row, header, { onViewClick, onDelete }) => {
  switch (header.key) {
    case "social":
      return (
        <Link to={row["socialLink"]} className="profile-link">
          Facebook
        </Link>
      );
    case "email":
      return (
        <Link to={`mailto:${row[header.key]}`} className="profile-link">
          {row[header.key].slice(0, 20)}...
        </Link>
      );
    case "btn":
      if (header.title === "Action") {
        return header?.action === "delete" ? (
          <DeleteBtn id={row._id} deleteFunc={onDelete}>
            Are you sure you want to delete this member?
          </DeleteBtn>
        ) : (
          <button
            className="primary-button profile-btn danger-button"
            onClick={() => onDelete(row._id)}
          >
            Delete
          </button>
        );
      } else {
        return (
          <button
            className={`primary-button profile-btn ${row?.new ? "new" : ""}`}
            onClick={() => onViewClick(row._id, row?.new)}
          >
            View
          </button>
        );
      }
    default:
      return row[header.key];
  }
};
export default Table;
