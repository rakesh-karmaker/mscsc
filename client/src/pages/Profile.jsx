import { useUser } from "@/Contexts/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import AboutProfile from "@/components/profile-components/AboutProfile";
import UserInfo from "@/components/profile-components/UserInfo";
import Timeline from "@/components/profile-components/Timeline";
import UserForm from "@/components/UserForm/UserForm";

import "@/components/profile-components/Profile.css";
import TimelineInputs from "@/components/UI/TimelineInputs/TimelineInputs";
import { getUserById } from "@/services/GetService";
import { MemberProfileEditSchema } from "@/utils/MemberSchemaValidation";
import { useQuery } from "@tanstack/react-query";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const isOwner = user?._id === id;
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => {
      if (isOwner) {
        return user;
      } else {
        return getUserById(id).data.user;
      }
    },
  });

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (isError) {
    navigate("/404");
  }

  return (
    <main id="profile" className="row-center">
      <div className="profile-container">
        <div className="profile-left">
          <img src={profileData.image} alt={profileData.name} />
          {window.innerWidth > 700 && (
            <AboutProfile data={profileData} isOwner={isOwner} />
          )}
        </div>
        <div className="profile-right">
          <UserInfo data={profileData} isOwner={isOwner} />
          {window.innerWidth <= 700 && (
            <AboutProfile data={profileData} isOwner={isOwner} />
          )}
          <div className="profile-actions-container">
            <div className="profile-actions">
              <button
                onClick={() => setIsEditing(false)}
                className={isEditing ? "" : "active"}
              >
                <i className="fa-solid fa-eye"></i> <span>Timeline</span>
              </button>
              {isOwner && (
                <button
                  onClick={() => setIsEditing(true)}
                  className={isEditing ? "active" : ""}
                >
                  <i className="fa-solid fa-pencil"></i>
                  <span>Edit Profile</span>
                </button>
              )}
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
    </main>
  );
};

export default ProfilePage;
