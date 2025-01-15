import { useNavigate } from "react-router-dom";
import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./MemberCard.css";
import MemberEditDialog from "@/components/admin/membersDashboard/memberEditDialog/MemberEditDialog";

const MemberCard = ({ member, ...props }) => {
  const navigate = useNavigate();
  const { _id: id, name, branch, batch, image } = member;
  return (
    <div onClick={() => navigate(`/member/${id}`)} className="member-card">
      <div className="role-icon">
        {member.position !== "member" ? (
          <FontAwesomeIcon icon="fa-solid fa-user-tie" className="admin" />
        ) : (
          <FontAwesomeIcon icon="fa-solid fa-user" />
        )}
      </div>
      <div className="member-image-container">
        <img src={image} alt={name} />
      </div>
      <div className="member-info">
        <h3>{name}</h3>
        <p>{branch}</p>
        <p>{batch}</p>
      </div>
      {props?.isAdmin && <MemberEditDialog member={member} {...props} />}
    </div>
  );
};

const MemberActions = ({ member, deleteMember, changeRole }) => {
  return (
    <div className="member-actions">
      <button
        type="button"
        className={`primary-button role-btn ${member?.role}`}
        onClick={(e) => {
          e.stopPropagation();
          changeRole(member._id, member.role);
        }}
      >
        {member?.role === "admin" ? "Make Member" : "Make Admin"}
      </button>

      <DeleteBtn id={member._id} deleteFunc={deleteMember}>
        Are you sure you want to delete this member?
      </DeleteBtn>
    </div>
  );
};

export default MemberCard;
