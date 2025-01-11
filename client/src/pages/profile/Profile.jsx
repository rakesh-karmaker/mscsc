import { useUser } from "@/Contexts/UserContext";
import { useParams } from "react-router-dom";
import React, { useState } from "react";
import AboutProfile from "@/components/profile-components/aboutProfile/AboutProfile";
import Timeline from "@/components/profile-components/timeline/Timeline";
import UserForm from "@/components/UserForm/UserForm";
import "./Profile.css";
import TimelineInputs from "@/components/UI/TimelineInputs/TimelineInputs";
import { getUserById } from "@/services/GetService";
import { MemberProfileEditSchema } from "@/utils/MemberSchemaValidation";
import { useQuery } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import Loader from "@/components/UI/Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileDetails from "@/components/profile-components/profileDetails/ProfileDetails";

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const isOwner = user?._id === id;
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: profileData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => {
      if (user && user._id === id) {
        return user;
      } else {
        return getUserById(id);
      }
    },
  });
  useErrorNavigator(isError, error);

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ height: "100vh" }} className="row-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <main id="profile" className="row-center">
        <div className="profile-container">
          <div className="profile-left">
            <img src={profileData.image} alt={profileData.name} />
            {window.innerWidth > 700 && (
              <AboutProfile data={profileData} isOwner={isOwner} />
            )}
          </div>
          <div className="profile-right">
            <ProfileDetails data={profileData} isOwner={isOwner} />
            {window.innerWidth <= 700 && (
              <AboutProfile data={profileData} isOwner={isOwner} />
            )}
            <div className="profile-actions-container">
              <div className="profile-actions">
                <button
                  onClick={() => setIsEditing(false)}
                  className={isEditing ? "" : "active"}
                >
                  <FontAwesomeIcon icon="fa-regular fa-eye" />{" "}
                  <span>Timeline</span>
                </button>
                {isOwner && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={isEditing ? "active" : ""}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-pencil" />
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
    </>
  );
};

export default ProfilePage;
