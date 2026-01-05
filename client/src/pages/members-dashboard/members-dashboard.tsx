import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import MemberPage from "@/pages/members/members";
import { Helmet } from "react-helmet-async";

import "./members-dashboard.css";

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
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - {title} Dashboard</title>
        <meta property="og:title" content={`MSCSC - ${title} Dashboard`} />
        <meta name="twitter:title" content={`MSCSC - ${title} Dashboard`} />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/admin/${title.toLowerCase()}`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/admin/${title.toLowerCase()}`}
        />
      </Helmet>

      {/* page content */}
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
