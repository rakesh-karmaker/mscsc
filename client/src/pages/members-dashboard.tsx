import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import { Helmet } from "react-helmet-async";
import MembersTable from "@/components/tables/members-table/members-table";

export default function MembersDashboard({}) {
  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Members Dashboard</title>
        <meta property="og:title" content={`MSCSC - Members Dashboard`} />
        <meta name="twitter:title" content={`MSCSC - Members Dashboard`} />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/admin/members`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/admin/members`}
        />
      </Helmet>

      {/* page content */}
      <div className="w-full h-full min-h-[calc(100svh-60px)] flex flex-col gap-13">
        <AdminDashboardHeader title={"Members"}>
          View all the members of the club
        </AdminDashboardHeader>
        <MembersTable />
      </div>
    </>
  );
}
