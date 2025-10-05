import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { User } from "@/types/userTypes";
import formatDate from "@/utils/formatDate";
import ContactInformation from "./ContactInformation";
import UtilityBtns from "./UtilityBtns";

import "./aboutProfile.css";

export default function AboutProfile({
  data,
  isOwner,
}: {
  data: User;
  isOwner: boolean;
}): ReactNode {
  const socialLink: { [key: string]: ReactNode } = {
    Facebook: (
      <Link
        to={data.socialLink}
        className="profile-social-link line-clamp-1 break-all"
        target="_blank"
      >
        {data.socialLink}
      </Link>
    ),
  };
  const { email } = data;
  const contact = {
    Email: (
      <a
        href={`mailto:${email}`}
        target="_blank"
        className="line-clamp-1 break-all"
      >
        {email}
      </a>
    ),
  };

  return (
    <div className="about-profile">
      <p className="about-profile-header">ABOUT</p>
      <ContactInformation info={contact}>
        Contact Information
      </ContactInformation>
      <ContactInformation info={socialLink}>Social Link</ContactInformation>

      <div className="about-info">
        <p className="about-basic-info">Account Created:</p>
        <p className="account-date">
          <span className="dot"></span> {formatDate(data.createdAt)}
        </p>
      </div>

      {isOwner ? <UtilityBtns /> : null}
    </div>
  );
}
