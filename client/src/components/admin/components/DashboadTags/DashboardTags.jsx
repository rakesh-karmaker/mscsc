import { useMessages } from "@/components/admin/contexts/MessagesContext";
import "./DashboardTags.css";
import { useActivities } from "@/contexts/ActivitiesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DashboardTagsContainer = ({ memberLength, adminLength }) => {
  const { length: messagesLength } = useMessages();
  const { length: activitiesLength } = useActivities();
  const tags = [
    {
      title: "Total Members",
      icon: "fa-solid fa-users",
      value: memberLength,
    },
    {
      title: "Total Messages",
      icon: "fa-regular fa-envelope",
      value: messagesLength,
    },
    {
      title: "Total Activities",
      icon: "fa-regular fa-calendar-days",
      value: activitiesLength,
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
          <FontAwesomeIcon icon={icon} />
        </p>
      </div>
      <p className="dashboard-tag-value">{value}</p>
    </div>
  );
};

export default DashboardTagsContainer;
