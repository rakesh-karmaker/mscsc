import { useMessages } from "@/admin/contexts/MessagesContext";
import "./DashboardTags.css";
import { useActivities } from "@/contexts/ActivitiesContext";

const DashboardTagsContainer = ({ memberLength, adminLength }) => {
  const { response } = useMessages();
  const { length } = useActivities();
  const tags = [
    {
      title: "Total Members",
      icon: "fa-solid fa-users",
      value: memberLength,
    },
    {
      title: "Total Messages",
      icon: "fa-solid fa-envelope",
      value: response?.totalLength,
    },
    {
      title: "Total Activities",
      icon: "fa-solid fa-calendar-days",
      value: length,
    },
    {
      title: "Total Admins",
      icon: "fa-solid fa-user-tie",
      value: adminLength,
    },
  ];

  return (
    <>
      <div className="dashboard-tags-container">
        <DashboardTag data={tags[0]} />
        <DashboardTag data={tags[1]} />
      </div>
      <div className="dashboard-tags-container">
        <DashboardTag data={tags[2]} />
        <DashboardTag data={tags[3]} />
      </div>
    </>
  );
};

const DashboardTag = ({ data }) => {
  const { title, icon, value } = data;
  return (
    <div className="dashboard-tag">
      <div>
        <p className="dashboard-tag-title">{title}</p>
        <p className="dashboard-tag-icon">
          <i className={icon}></i>
        </p>
      </div>
      <p className="dashboard-tag-value">{value}</p>
    </div>
  );
};

export default DashboardTagsContainer;
