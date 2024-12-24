import { useUser } from "@/Contexts/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AboutProfile from "@/components/profile-components/AboutProfile";
import UserInfo from "@/components/profile-components/UserInfo";
import Timeline from "@/components/profile-components/Timeline";
import UserForm from "@/components/UI/UserForm/UserForm";

import "@/components/profile-components/Profile.css";
import TimelineInputs from "@/components/UI/TimelineInputs/TimelineInputs";
import { getUserById } from "@/services/GetService";

const Profile = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const { user } = useUser();
  const isOwner = user ? user._id === id : false;

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOwner) {
      setProfileData(user);
    } else {
      const getProfileData = async (id) => {
        try {
          const data = await getUserById(id);
          if (data && data.data) {
            setProfileData(data.data);
          } else {
            console.error("Failed to get profile data");
            setProfileData("failed");
          }
        } catch (err) {
          console.error("Failed to get profile data", err);
          setProfileData("failed");
        }
      };

      getProfileData(id, isOwner, user);
    }
  }, [id, isOwner, user]);

  useEffect(() => {
    if (profileData === "failed") {
      navigate("/404");
    }
  }, [profileData]);

  return (
    <main id="profile" className="row-center">
      {profileData && profileData !== "failed" ? (
        <div>
          <div className="profile-left-container">
            <img
              src={`http://localhost:5000/${profileData.image}`}
              alt={`Profile picture of ${profileData.name}`}
            />
            {window.innerWidth > 700 ? (
              <AboutProfile data={profileData} isOwner={isOwner} />
            ) : null}
          </div>
          <div className="profile-right-container">
            <UserInfo data={profileData} />
            {window.innerWidth <= 700 ? (
              <AboutProfile data={profileData} isOwner={isOwner} />
            ) : null}
            <div className="profile-actions-container">
              <div className="profile-actions">
                <button
                  onClick={() => setIsEditing(false)}
                  className={isEditing ? "" : "active"}
                >
                  <i className="fa-solid fa-eye"></i> <span>Timeline</span>
                </button>
                {isOwner ? (
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
                  <>
                    <UserForm data={profileData} />
                    <TimelineInputs timeline={profileData.timeline} />
                  </>
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
