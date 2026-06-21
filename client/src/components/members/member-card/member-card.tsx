import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useUser } from "@/contexts/user-context";
import type { MemberPreview } from "@/types/member-types";
import FaLock from "~icons/fa/lock";
import FaUserTie from "~icons/fa-solid/user-tie";
import { requireMinimumRole, ROLES } from "@/utils/require-minimum-role";

import "./member-card.css";

export default function MemberCard({ member }: { member: MemberPreview }) {
  const navigate = useNavigate();
  const { slug, name, branch, batch, image, isImageHidden, isImageVerified } =
    member;
  const { user } = useUser();

  return (
    <div onClick={() => navigate(`/member/${slug}`)} className="member-card">
      {requireMinimumRole(user?.role, ROLES.OBSERVER) && !isImageVerified ? (
        <div className="lock-icon">
          <FaLock />
        </div>
      ) : null}
      <div className="role-icon">
        {requireMinimumRole(member.role, ROLES.EXECUTIVE) ? (
          <FaUserTie className="admin" />
        ) : null}
      </div>
      <div className="member-image-container">
        <LazyLoadImage
          src={
            (isImageHidden || !isImageVerified) &&
            !requireMinimumRole(user?.role, ROLES.OBSERVER)
              ? "/executive-members/placeholderpfp.webp"
              : image
          }
          alt={name}
          effect="blur"
        />
      </div>
      <div className="member-info">
        <h3>{name}</h3>
        <p>{branch}</p>
        <p>{batch}</p>
      </div>
    </div>
  );
}
