import AdminDashboardHeader from "@/components/ui/AdminDashboardHeader";
import MemberPage from "@/pages/members/Members";

import "./membersDashboard.css";

type MembersDashboardProps = {
  type?: "admin" | "executive" | "member";
  title?: string;
  des?: string;
};

export default function MembersDashboard({
  type,
  title = "Members",
  des = "View all the members of the club",
}: MembersDashboardProps) {
  return (
    <>
      <div className="admin-members">
        <AdminDashboardHeader title={title}>{des}</AdminDashboardHeader>

        <MemberPage
          isAdmin={true}
          showExecutives={type === "executive"}
          showAdmins={type === "admin"}
        />
      </div>
    </>
  );
}
