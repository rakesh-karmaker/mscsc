import type { MessageType } from "@/types/messageTypes";
import { v4 as uuidv4 } from "uuid";

type TableRowProps = {
  row: MessageType;
  headers: {
    key: string;
    title: string;
    break?: boolean;
    duplicate?: boolean;
  }[];
  onViewClick: (id: string, isNew: boolean) => void;
  onDelete: (id: string) => void;
};

export default function TableRow({ row, headers, ...rest }: TableRowProps) {
  return (
    <tr>
      {headers.map((header) =>
        header.break && window.innerWidth < 1240 ? null : (
          <td
            key={`${row._id}-${header.key}-${header.title}-${uuidv4()}`}
            className={header.key}
          >
            {getTableCell(row, header, rest)}
          </td>
        )
      )}
    </tr>
  );
}

function getTableCell(
  row: MessageType,
  header: { key: string; title: string },
  {
    onViewClick,
    onDelete,
  }: {
    onViewClick: (id: string, isNew: boolean) => void;
    onDelete: (id: string) => void;
  }
) {
  console.log(row);
  switch (header.key) {
    case "btn":
      if (header.title === "Action") {
        return (
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
      return row[header.key as keyof MessageType] || "N/A";
  }
}
