import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useUser } from "@/contexts/UserContext";
import type { MemberPreview } from "@/types/memberTypes";
import { FaLock, FaUserTie } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import MemberEditDialog from "../MemberEditDialog";

import "./memberCard.css";

export default function MemberCard({
  member,
  ...props
}: {
  member: MemberPreview;
  showExecutives?: boolean;
  isAdmin?: boolean;
}) {
  const navigate = useNavigate();
  const { slug, name, branch, batch, image, isImageHidden, isImageVerified } =
    member;
  const { user } = useUser();
  const isExecutive = user && user?.position != "member";

  return (
    <div onClick={() => navigate(`/member/${slug}`)} className="member-card">
      {isExecutive && !isImageVerified ? (
        <div className="lock-icon">
          <FaLock />
        </div>
      ) : null}
      <div className="role-icon">
        {member.position !== "member" ? (
          <FaUserTie className="admin" />
        ) : (
          <FaUser />
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
      {props?.isAdmin && <MemberEditDialog member={member} />}
    </div>
  );
}
