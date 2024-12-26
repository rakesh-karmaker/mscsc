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
import { MemberProfileEditSchema } from "@/utils/MemberSchemaValidation";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const isOwner = user?._id === id;

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOwner) {
      setProfileData(user);
    } else {
      (async () => {
        try {
          const response = await getUserById(id);
          const data = response.data;
          if (data) {
            setProfileData(data);
          } else {
            setProfileData("failed");
          }
        } catch (error) {
          console.error("Failed to get profile data", error);
          setProfileData("failed");
        }
      })();
    }
  }, [id, isOwner, user]);

  useEffect(() => {
    if (profileData === "failed") {
      navigate("/404");
    }
  }, [profileData, navigate]);

  return (
    <main id="profile" className="row-center">
      {profileData && profileData !== "failed" ? (
        <div className="profile-container">
          <div className="profile-left">
            <img src={profileData.image} alt={profileData.name} />
            {window.innerWidth > 700 ? (
              <AboutProfile data={profileData} isOwner={isOwner} />
            ) : null}
          </div>
          <div className="profile-right">
            <UserInfo data={profileData} isOwner />
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
                    <UserForm
                      data={profileData}
                      schema={MemberProfileEditSchema}
                    />
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

export default ProfilePage;
