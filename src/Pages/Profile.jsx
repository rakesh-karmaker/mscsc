import { useUser } from "@/Contexts/UserContext";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AboutProfile from "@/components/profile-components/AboutProfile";
import UserInfo from "@/components/profile-components/UserInfo";
import Timeline from "@/components/profile-components/Timeline";
import UserForm from "@/components/UI/UserForm/UserForm";

import "@/components/profile-components/Profile.css";

const Profile = () => {
  const id = useParams().id;
  const { user } = useUser();
  const isAdmin = user && user.role === "admin";
  const isOwner = user && user._id === id;

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOwner) {
      setProfileData(user);
    } else {
      // getProfileData(id, isOwner, user).then((data) => setProfileData(data));
    }
  }, [user]);

  return (
    <main id="profile" className="row-center">
      {profileData ? (
        <div>
          <div className="profile-left-container">
            <img
              src={`http://localhost:5000/${profileData.image}`}
              alt={`Profile picture of ${profileData.name}`}
            />
            {window.innerWidth > 700 ? (
              <AboutProfile data={profileData} />
            ) : null}
          </div>
          <div className="profile-right-container">
            <UserInfo data={profileData} />
            {window.innerWidth <= 700 ? (
              <AboutProfile data={profileData} />
            ) : null}
            <div className="profile-actions-container">
              <div className="profile-actions">
                <button
                  onClick={() => setIsEditing(false)}
                  className={isEditing ? "" : "active"}
                >
                  <i className="fa-solid fa-eye"></i> <span>Timeline</span>
                </button>
                {isOwner || isAdmin ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={isEditing ? "active" : ""}
                  >
                    <i className="fa-solid fa-pencil"></i>
                    <span>Edit Profile</span>
                  </button>
                ) : null}
              </div>

              <div className="profile-timeline-edit-container">
                {isEditing ? (
                  <UserForm data={profileData} />
                ) : (
                  <Timeline timelineData={profileData.timeline} />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </main>
  );
};

export default Profile;
