import { Link } from "react-router-dom";
import "./Table.css";
import Pagination from "@/components/activities-components/Pagination";

const Table = ({ headers, data, length, page, setPage, ...rest }) => {
  const tHeaders = headers.map((header) => header.title);
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
  if (header.key === "social") {
    return (
      <Link to={row["socialLink"]} className="profile-link">
        Facebook
      </Link>
    );
  }

  if (header.key === "email") {
    return (
      <Link to={`mailto:${row[header.key]}`} className="profile-link">
        {row[header.key].slice(0, 20)}...
      </Link>
    );
  }

  if (header.key === "btn" && header.title === "Action") {
    return (
      <button
        className="primary-button danger-button"
        onClick={() => onDelete(row._id)}
      >
        Delete
      </button>
    );
  }

  if (header.key === "btn" && header.title === "Change Role") {
    return (
      <button
        className="primary-button role-btn"
        onClick={() => rest.onRoleClick(row._id, row?.role)}
      >
        {row?.role === "admin" ? "Make Member" : "Make Admin"}
      </button>
    );
  }

  if (header.key === "btn") {
    return (
      <button
        to={`/profile/${row._id}`}
        className={`primary-button profile-btn ${row?.new ? "new" : ""}`}
        onClick={() => onViewClick(row._id, row?.new)}
      >
        View
      </button>
    );
  }

  return row[header.key];
};
export default Table;
