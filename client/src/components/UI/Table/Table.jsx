import { Link, NavLink } from "react-router-dom";
import "./Table.css";
import Pagination from "@/components/UI/Pagination/Pagination";
import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";
import EmptyData from "@/components/UI/EmptyData/EmptyData";

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
              <TableRow key={index} row={row} headers={headers} {...rest} />
            ))}
          </tbody>
        </table>
      </div>
      {rest?.needPagination === false ? null : (
        <Pagination
          length={length}
          elementsPerPage={elementsPerPage}
          setPage={setPage}
          currentPage={page}
        />
      )}
    </div>
  );
};

const TableRow = ({ row, headers, ...rest }) => {
  return (
    <tr className={row?.role === "admin" ? "admin" : ""}>
      {headers.map((header) =>
        header.break && window.innerWidth < 1240 ? null : (
          <td
            key={`${row._id}-${header.key}-${header.title}-${Math.random()}`}
            className={header.key}
          >
            {getTableCell(row, header, rest)}
          </td>
        )
      )}
    </tr>
  );
};

const getTableCell = (row, header, { onViewClick, onDelete, ...rest }) => {
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
      } else if (header.title === "Change Role") {
        return (
          <button
            className="primary-button role-btn"
            onClick={() => rest.onRoleClick(row._id, row?.role)}
          >
            {row?.role === "admin" ? "Make Member" : "Make Admin"}
          </button>
        );
      } else {
        return (
          <button
            className={`primary-button profile-btn ${row?.new ? "new" : ""}`}
            onClick={() => onViewClick(row._id)}
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
