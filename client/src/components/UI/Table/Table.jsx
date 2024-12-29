import { Link, NavLink } from "react-router-dom";
import "./Table.css";

const Table = ({ headers, data, ...rest }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {headers.map((header, index) =>
              header.break && window.innerWidth < 1240 ? null : (
                <th key={`${index}-${header.key}`}>{header.title}</th>
              )
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
  );
};

const TableRow = ({ row, headers, ...rest }) => {
  return (
    <tr>
      {headers.map((header) =>
        header.break && window.innerWidth < 1240
          ? null
          : getTableCell(row, header, rest)
      )}
    </tr>
  );
};

const getTableCell = (row, header, { onNewClick, onDelete }) => {
  if (header.key === "social") {
    return (
      <td key={`${row._id}-${header.key}`}>
        <Link to={row[header.key]} className="profile-link">
          Facebook
        </Link>
      </td>
    );
  }

  if (header.key === "btn" && header.title === "Action") {
    return (
      <td key={`${row._id}-delete`}>
        <button
          className="primary-button danger-button"
          onClick={() => onDelete(row._id)}
        >
          Delete
        </button>
      </td>
    );
  }

  if (header.key === "btn") {
    return (
      <td key={`${row._id}-profile`}>
        <NavLink
          to={`/profile/${row._id}`}
          className={`primary-button profile-btn ${
            row?.newMember ? "new" : ""
          }`}
          onClick={() => onNewClick(row._id)}
        >
          View
        </NavLink>
      </td>
    );
  }

  return <td key={`${row._id}-${header.key}`}>{row[header.key]}</td>;
};
export default Table;
