import { useUser } from "@/contexts/UserContext";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AboutProfile from "@/components/profileComponents/aboutProfile/AboutProfile";
import Timeline from "@/components/profileComponents/timeline/Timeline";
import UserForm from "@/components/UserForm/UserForm";
import "./Profile.css";
import TimelineInputs from "@/components/UI/TimelineInputs/TimelineInputs";
import { getUserById } from "@/services/GetService";
import { MemberProfileEditSchema } from "@/utils/MemberSchemaValidation";
import { useQuery } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import Loader from "@/components/UI/Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileDetails from "@/components/profileComponents/profileDetails/ProfileDetails";

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const isOwner = user?._id === id;
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setIsEditing(false);
  }, [isOwner]);

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", id, user],
    queryFn: () => {
      if (user && user._id === id) {
        return user;
      } else {
        return getUserById(id);
      }
    },
    refetchOnWindowFocus: false,
    retry: 0,
  });

  if (error) {
    throw Error("Failed to fetch profile");
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
            <img
              src={profileData.image}
              alt={profileData.name}
              rel="preload"
              fetchpriority="high"
            />
            {window.innerWidth > 780 && (
              <AboutProfile data={profileData} isOwner={isOwner} />
            )}
          </div>
          <div className="profile-right">
            <ProfileDetails data={profileData} isOwner={isOwner} />
            {window.innerWidth <= 780 && (
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
                  isOwner && (
                    <>
                      <UserForm
                        data={profileData}
                        schema={MemberProfileEditSchema}
                      />
                      <TimelineInputs
                        timeline={profileData.timeline}
                        user={user}
                      />
                    </>
                  )
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
