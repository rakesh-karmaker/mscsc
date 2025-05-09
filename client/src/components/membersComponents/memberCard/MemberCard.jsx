import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./MemberCard.css";
import MemberEditDialog from "@/components/admin/membersDashboard/memberEditDialog/MemberEditDialog";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useUser } from "@/contexts/UserContext";

const MemberCard = ({ member, ...props }) => {
  const navigate = useNavigate();
  const { slug, name, branch, batch, image, isImageHidden, isImageVerified } =
    member;
  const { user } = useUser();
  const isExecutive = user && user?.position != "member";

  return (
    <div onClick={() => navigate(`/member/${slug}`)} className="member-card">
      {isExecutive && !isImageVerified ? (
        <div className="lock-icon">
          <FontAwesomeIcon icon="fa-solid fa-lock" />
        </div>
      ) : null}
      <div className="role-icon">
        {member.position !== "member" ? (
          <FontAwesomeIcon icon="fa-solid fa-user-tie" className="admin" />
        ) : (
          <FontAwesomeIcon icon="fa-solid fa-user" />
        )}
      </div>
      <div className="member-image-container">
        <LazyLoadImage
          src={
            isImageHidden && !isExecutive
              ? "/executive-members/placeholderpfp.webp"
              : image
          }
          alt={name}
          effect="blur"
        />
      </div>
      <div className="member-info">
        <h3>{name}</h3>
        {props?.showExecutives ? (
          <p>{props?.showExecutives && member.position}</p>
        ) : (
          <>
            <p>{branch}</p>
            <p>{batch}</p>
          </>
        )}
      </div>
      {props?.isAdmin && <MemberEditDialog member={member} {...props} />}
    </div>
  );
};

export default MemberCard;
