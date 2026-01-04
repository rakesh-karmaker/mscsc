import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import Tasks from "./tasks";
import { Helmet } from "react-helmet-async";

export default function TasksDashboard() {
  return (
    <>
      {/* page meta data */}
      <Helmet>
        <title>MSCSC - Tasks Dashboard</title>
        <meta property="og:title" content="MSCSC - Tasks Dashboard" />
        <meta name="twitter:title" content="MSCSC - Tasks Dashboard" />
        <meta name="og:url" content="https://mscsc.netlify.app/admin/tasks" />
        <link rel="canonical" href={`https://mscsc.netlify.app/admin/tasks`} />
      </Helmet>

      {/* page content */}
      <div className="admin-tasks">
        <AdminDashboardHeader title={"Tasks"}>
          View and manage all the tasks of the club
        </AdminDashboardHeader>

        <div className="admin-tasks-container">
          <Tasks admin={true} />
        </div>
      </div>
    </>
  );
}
