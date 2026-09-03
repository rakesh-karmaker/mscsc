import { useUser } from "@/contexts/user-context";
import { useParams } from "react-router-dom";
import { useState, useEffect, type ReactNode } from "react";
import AboutProfile from "@/components/profile/about-profile/about-profile";
import { useQuery } from "@tanstack/react-query";
import { getMember } from "@/lib/api/member";
import HiPencil from "~icons/hugeicons/pencil-edit-01";
import FaEye from "~icons/fa-solid/eye";
import FaXmark from "~icons/fa6-solid/xmark";
import Loader from "@/components/ui/loader/loader";
import ProfileDetails from "@/components/profile/profile-details/profile-details";
import Timeline from "@/components/profile/timeline";
import TimelineForm from "@/components/forms/timeline-form/timeline-form";
import type { User } from "@/types/user-types";
import UserEditForm from "@/components/forms/user-edit-form";
import { Helmet } from "react-helmet-async";
import { requireMinimumRole, ROLES } from "@/utils/require-minimum-role";
import { Modal } from "@mui/material";

import "./profile.css";

export default function Profile(): ReactNode {
  const { username } = useParams();
  const { user } = useUser();
  const isOwner = user?.slug === username;
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setIsEditing(false);
  }, [isOwner]);

  const [instructionsOpen, setInstructionsOpen] = useState(
    localStorage.getItem("isNewRegister") === "true",
  );

  useEffect(() => {
    if (instructionsOpen) {
      localStorage.removeItem("isNewRegister");
    }
  }, [instructionsOpen]);

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
                requireMinimumRole(user?.role, ROLES.OBSERVER) || isOwner
                  ? profileData.image
                  : profileData.isImageHidden || !profileData.isImageVerified
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

      <Modal
        open={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
        aria-labelledby="Member Edit Box"
        aria-describedby="Edit Member Details"
        className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute  border-none! outline-none! focus-visible:outline-none"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="w-full max-w-[33.75em] max-md:max-w-[28.75em] max-sm:max-w-max-width bg-primary-bg max-h-[90vh] max-sm:max-h-screen overflow-y-auto border-none! outline-none! focus-visible:outline-none rounded-lg">
          <div className="min-h-fit max-sm:max-h-full p-7! max-sm:p-[calc((100vw-var(--max-elements-width))/2)]! rounded-lg max-sm:rounded-none bg-primary-bg flex flex-col max-sm:justify-center gap-5">
            <div className="w-full flex flex-col">
              <div className="w-full flex justify-between items-start gap-4">
                <h2 className="text-2xl font-medium max-xs:text-2xl">
                  Almost done!
                </h2>
                <button
                  onClick={() => setInstructionsOpen(false)}
                  className="text-3xl transition-all duration-200 hover:text-red-400 cursor-pointer"
                >
                  <FaXmark />
                </button>
              </div>
              <div className="w-full h-px bg-light-black/10 mt-2! mb-3.5!"></div>
              <div className="w-full h-full">
                <p className="text-gray-700">
                  We conduct all our activities through our official Messenger
                  Group. If your given facebook account is valid then you will
                  be added to the group as soon as possible. But if your given
                  facebook account is invalid or locked then{" "}
                  <a
                    href="/contact"
                    className="text-highlighted-color hover:underline"
                    target="_blank"
                  >
                    contact us
                  </a>{" "}
                  or contact with our current{" "}
                  <a
                    className="text-highlighted-color hover:underline"
                    href="/executives"
                    target="_blank"
                  >
                    Executive members
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
