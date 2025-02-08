import { NavLink } from "react-router-dom";
import { useMember } from "@/contexts/MembersContext";
import DashboardTagsContainer from "@/components/admin/components/DashboadTags/DashboardTags";
import DashboardHeader from "@/components/admin/components/DashboardHeader/DashboardHeader";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMessages } from "@/components/admin/contexts/MessagesContext";
import {
  MemberList,
  MessagesList,
} from "@/components/admin/components/Lists/Lists";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { response, members, setSearch, setPage } = useMember();
  const {
    messages,
    setSearch: messagesSearch,
    setPage: messagesPage,
  } = useMessages();

  useEffect(() => {
    setSearch("");
    setPage(1);
    messagesSearch("");
    messagesPage(1);
  }, []);

  return (
    <>
      <DashboardHeader title={"Dashboard"}>
        Welcome to the admin dashboard
      </DashboardHeader>
      <div className="dashboard-info">
        <QuickAccess />
        <DashboardTagsContainer
          memberLength={response?.totalLength}
          adminLength={response?.adminLength}
        />
      </div>
      <div className="dashboard-lists">
        <MemberList members={members} />
        <MessagesList messages={messages} />
      </div>
    </>
  );
};

const QuickAccess = () => {
  const quickAccessData = [
    {
      icon: "fa-regular fa-calendar-days",
      heading: "Add a new Activity",
      text: "You can add a new workshop details, article, a member’s achievement and new upcoming events. So the users can see them, learn about them and join the activities to expand their domain of knowledge and learn about several things.",
      link: "/admin/activities",
      linkText: "Add Now",
    },
    {
      icon: "fa-regular fa-envelope",
      heading: "View Messages",
      text: "You can view the messages sent by the users where they can asy a question or identify a problem. The users can send messages through the contact form in the contact section located in the home page and in the contact page.",
      link: "/admin/messages",
      linkText: "View Now",
    },
  ];
  return window.innerWidth <= 1240 ? (
    <div className="quick-access">
      {quickAccessData.map((data) => (
        <QuickAccessCard data={data} key={data.heading} />
      ))}
    </div>
  ) : (
    <>
      {quickAccessData.map((data) => (
        <QuickAccessCard data={data} key={data.heading} />
      ))}
    </>
  );
};

const QuickAccessCard = ({ data }) => {
  const { icon, heading, text, link, linkText } = data;

  return (
    <div className="quick-access-card">
      <p className="quick-access-card-icon">
        <FontAwesomeIcon icon={icon} />
      </p>

      <div>
        <h3 className="quick-access-card-heading">{heading}</h3>

        <p className="quick-access-card-text">{text}</p>
      </div>

      <NavLink to={link} className="primary-button quick-access-card-link">
        {linkText}
      </NavLink>
    </div>
  );
};

export default AdminDashboard;
