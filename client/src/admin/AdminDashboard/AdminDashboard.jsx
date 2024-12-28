import { Link, NavLink } from "react-router-dom";
import "./AdminDashboard.css";
import { useMember } from "@/admin/contexts/MemberContext";
import { useMutation } from "@tanstack/react-query";
import { editUser } from "@/services/PutService";
import { deleteMember } from "@/services/DeleteService";

const AdminDashboard = () => {
  const memberTableHeader =
    window.innerWidth > 1240
      ? [
          "Name",
          "SSC Batch",
          "School Branch",
          "Reference",
          "Social Link",
          "Profile",
          "Action",
        ]
      : ["Name", "SSC Batch", "Social Link", "Profile", "Action"];

  console.log(memberTableHeader);

  const memberMutation = useMutation({
    mutationFn: (data) => {
      const { isDelete, ...rest } = data;
      if (isDelete) {
        return deleteMember(rest);
      } else {
        return editUser(rest);
      }
    },
  });

  const { members } = useMember();

  const onNewClick = (id) => {
    memberMutation.mutate({ newMember: false, _id: id, isDelete: false });
  };

  const onDelete = (id) => {
    memberMutation.mutate({ _id: id, isDelete: true });
  };

  return (
    <section id="admin-dashboard">
      <div className="admin-dashboard-container">
        <DashboardHeader />
        <div className="dashboard-info">
          <QuickAccess />
          <DashboardTagsContainer
            memberLength={members?.length}
            adminLength={
              members?.filter((member) => member.role === "admin").length
            }
          />
        </div>
        <div className="members-example-table">
          <Table
            headers={memberTableHeader}
            data={members}
            onNewClick={onNewClick}
            onDelete={onDelete}
          />
        </div>
      </div>
    </section>
  );
};

const Table = ({ headers, data, onNewClick, onDelete }) => {
  const rows = data?.slice(0, 6);
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.map((row) => {
          return (
            <tr key={row._id}>
              <td>{row.name}</td>
              <td>{row.batch}</td>
              {window.innerWidth > 1240 && (
                <>
                  <td>{row.branch}</td>
                  <td>{row.reference}</td>
                </>
              )}
              <td>
                <Link to={row.socialLink} className="profile-link">
                  Facebook
                </Link>
              </td>
              <td>
                {/* TODO: change the newMember to new when resting the DB */}
                <NavLink
                  to={`/profile/${row._id}`}
                  className={`primary-button profile-btn ${
                    row?.newMember ? "new" : ""
                  }`}
                  onClick={() => onNewClick(row._id)}
                >
                  View
                </NavLink>
              </td>
              <td>
                <button
                  className="primary-button danger-button"
                  onClick={() => onDelete(row._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const DashboardTagsContainer = ({ memberLength, adminLength }) => {
  const tags = [
    {
      title: "Total Members",
      icon: "fa-solid fa-users",
      value: memberLength,
    },
    {
      title: "Total Messages",
      icon: "fa-solid fa-envelope",
      value: 107,
    },
    {
      title: "Total Activities",
      icon: "fa-solid fa-calendar-days",
      value: 57,
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

const QuickAccess = () => {
  const quickAccessData = [
    {
      icon: "fa-solid fa-calendar-days",
      heading: "Add a new Activity",
      text: "You can add a new workshop details, article, a member’s achievement and new upcoming events. So the users can see them, learn about them and join the activities to expand their domain of knowledge and learn about several things.",
      link: "/admin/activities",
      linkText: "Add Now",
    },
    {
      icon: "fa-solid fa-envelope",
      heading: "View Messages",
      text: "You can view the messages sent by the users where they can asy a question or identify a problem. The users can send messages through the contact form in the contact section located in the home page and in the contact page.",
      link: "/admin/messages",
      linkText: "View Now",
    },
  ];
  return (
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
        <i className={icon}></i>
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

const DashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to the Admin Dashboard</p>
      </div>
      {window.innerWidth > 1530 && (
        <NavLink to="/" className="primary-button">
          Home Page
        </NavLink>
      )}
    </div>
  );
};

export default AdminDashboard;
