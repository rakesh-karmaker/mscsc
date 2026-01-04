import type { ReactNode } from "react";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

export default function SocialIcon({ social }: { social: string }): ReactNode {
  switch (social) {
    case "facebook":
      return <FaFacebook />;
    case "twitter":
      return <FaTwitter />;
    case "linkedin":
      return <FaLinkedin />;
    case "instagram":
      return <FaInstagram />;
    case "github":
      return <FaGithub />;
    default:
      return;
  }
}
