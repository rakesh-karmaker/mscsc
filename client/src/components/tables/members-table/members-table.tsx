import type { ReactNode } from "react";
import getMembersTableColumns from "./members-table-columns";

export default function MembersTable(): ReactNode {
  const columns = getMembersTableColumns();

  return <h1>hi</h1>;
}
