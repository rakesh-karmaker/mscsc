import { NavLink, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { useMember } from "@/contexts/MembersContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUser } from "@/services/PutService";
import { deleteMember } from "@/services/DeleteService";
import Table from "@/components/UI/Table/Table";

import toast, { Toaster } from "react-hot-toast";
import DashboardTagsContainer from "@/admin/components/DashboadTags/DashboardTags";
import DashboardHeader from "@/admin/components/DashboardHeader/DashboardHeader";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const memberMutation = useMutation({
    mutationFn: (data) => {
      const { isDelete, ...rest } = data;
      if (isDelete) {
        return deleteMember(rest);
      } else {
        return editUser(rest);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("members");
      toast.success("Member Deleted Successfully!");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Operation failed!");
    },
  });

  const { response, members, setSearch } = useMember();

  const onViewClick = (id, isNew) => {
    if (isNew) {
      memberMutation.mutate({ new: false, _id: id, isDelete: false });
    }
    navigate(`/member/${id}`);
  };

  const onDelete = (id) => {
    memberMutation.mutate({ _id: id, isDelete: true });
  };

  useEffect(() => {
    setSearch("");
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
      <div className="members-example-table">
        <Table
          headers={memberTableHeader}
          data={members?.slice(0, 6)}
          onViewClick={onViewClick}
          onDelete={onDelete}
          needPagination={false}
        />
      </div>
      <Toaster position="top-right" />
    </>
  );
};

const memberTableHeader = [
  {
    title: "Name",
    key: "name",
    break: false,
  },
  {
    title: "Batch",
    key: "batch",
    break: false,
  },
  {
    title: "Branch",
    key: "branch",
    break: true,
  },
  {
    title: "Reference",
    key: "reference",
    break: true,
  },
  {
    title: "Social Link",
    key: "social",
    break: false,
  },
  {
    title: "Profile",
    key: "btn",
    break: false,
  },
  {
    title: "Action",
    key: "btn",
    action: "delete",
    break: false,
  },
];

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
