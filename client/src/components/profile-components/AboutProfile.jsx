import { Link } from "react-router-dom";
import { useState } from "react";

const AboutProfile = ({ data, isOwner }) => {
  const socialLink = {
    Facebook: (
      <Link to={data.socialLink} className="profile-social-link">
        {data.socialLink.slice(0, 30) + "..."}
      </Link>
    ),
  };
  const { email, contactNumber } = data;
  const contact = {
    Email: <a href={`mailto:${email}`}>{email}</a>,
    Phone: (
      <a href={`tel:0${contactNumber.toString()}`}>
        {`+880 ${contactNumber.toString()}`}
      </a>
    ),
  };

  const [copySuccess, setCopySuccess] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
  };

  return (
    <div className="about-profile">
      <p className="about-profile-header">ABOUT</p>
      <ContactInformation info={contact}>
        Contact Information
      </ContactInformation>
      <ContactInformation info={socialLink}>Social Link</ContactInformation>

      <div className="about-info">
        <p className="about-info-header">Basic Information</p>
        <p className="about-basic-info">Account Created:</p>
        <p className="account-date">
          <span className="dot"></span> {data.createdAt.toString().slice(0, 10)}
        </p>
      </div>

      {isOwner ? (
        <button className="primary-button user-profile-link" onClick={copyLink}>
          {copySuccess ? "Link Copied!" : "Copy Profile Link"}
        </button>
      ) : null}
    </div>
  );
};

const ContactInformation = ({ info, children }) => {
  return (
    <div className="about-info">
      <p className="about-info-header">{children}</p>
      <InformationItem info={info} />
    </div>
  );
};

const InformationItem = ({ info }) => {
  return (
    <>
      {Object.keys(info).map((key) => (
        <p key={key} className="about-info-item">
          <span className="about-info-key">{key}: </span>
          <span className="about-info-value">{info[key]}</span>
        </p>
      ))}
    </>
  );
};

export default AboutProfile;
