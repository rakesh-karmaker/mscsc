import { useUser } from "@/contexts/user-context";
import { useParams } from "react-router-dom";
import { useState, useEffect, type ReactNode } from "react";
import AboutProfile from "@/components/profile/about-profile/about-profile";
import { useQuery } from "@tanstack/react-query";
import { getMember } from "@/lib/api/member";
import { HiPencil } from "react-icons/hi2";
import { FaEye } from "react-icons/fa";
import Loader from "@/components/ui/loader/loader";
import ProfileDetails from "@/components/profile/profile-details/profile-details";
import Timeline from "@/components/profile/timeline";
import TimelineForm from "@/components/forms/timeline-form/timeline-form";
import type { User } from "@/types/user-types";
import UserEditForm from "@/components/forms/user-edit-form";
import { Helmet } from "react-helmet-async";

import "./profile.css";

export default function Profile(): ReactNode {
  const { username } = useParams();
  const { user } = useUser();
  const isOwner = user?.slug === username;
  const isExecutive = user && user?.position !== "member" ? true : false;
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
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - {profileData?.name || "Profile"}</title>
        <meta
          property="og:title"
          content={`MSCSC - ${profileData?.name || "Profile"}`}
        />
        <meta
          name="twitter:title"
          content={`MSCSC - ${profileData?.name || "Profile"}`}
        />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/profile/${profileData?.slug}`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/profile/${profileData?.slug}`}
        />
      </Helmet>

      {/* page content */}
      <main id="profile" className="row-center">
        <div className="profile-container">
          <div className="profile-left">
            <img
              src={
                (profileData.isImageHidden || !profileData.isImageVerified) &&
                !isExecutive
                  ? "/executive-members/placeholderpfp.webp"
                  : profileData.image
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
