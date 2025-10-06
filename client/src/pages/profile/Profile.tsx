import { useUser } from "@/contexts/UserContext";
import { useParams } from "react-router-dom";
import { useState, useEffect, type ReactNode } from "react";
import AboutProfile from "@/components/profile/aboutProfile/AboutProfile";
import { useQuery } from "@tanstack/react-query";
import { getMember } from "@/lib/api/member";
import { HiPencil } from "react-icons/hi2";
import { FaEye } from "react-icons/fa";
import Loader from "@/components/ui/loader/Loader";
import ProfileDetails from "@/components/profile/profileDetails/ProfileDetails";
import Timeline from "@/components/profile/Timeline";
import TimelineForm from "@/components/forms/timelineForm/TimelineForm";
import type { User } from "@/types/userTypes";
import UserEditForm from "@/components/forms/UserEditForm";

import "./profile.css";

export default function Profile(): ReactNode {
  const { username } = useParams();
  const { user } = useUser();
  const isOwner = user?.slug === username;
  const isExecutive = user && user?.position !== "member";
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setIsEditing(false);
  }, [isOwner]);

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", username, user],
    queryFn: () => {
      if (user && user.slug === username) {
        return user;
      } else {
        return getMember(username as string);
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
              src={
                profileData?.isImageHidden && !isOwner && !isExecutive
                  ? "/executive-members/placeholderpfp.webp"
                  : profileData?.image
              }
              alt={profileData.name}
              rel="preload"
              fetchPriority="high"
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
                  <FaEye />
                  <span>Timeline</span>
                </button>
                {isOwner && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={isEditing ? "active" : ""}
                  >
                    <HiPencil />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
              <div className="profile-timeline-edit-container">
                {isEditing ? (
                  isOwner && (
                    <>
                      <UserEditForm setIsEditing={setIsEditing} />
                      <TimelineForm
                        timeline={profileData.timeline}
                        user={user as User}
                        setIsEditing={setIsEditing}
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
}
