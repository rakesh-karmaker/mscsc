import type { ReactNode } from "react";
import FaFacebook from "~icons/fa/facebook";
import FaGithub from "~icons/fa/github";
import FaInstagram from "~icons/fa/instagram";
import FaLinkedin from "~icons/fa/linkedin";
import FaTwitter from "~icons/fa/twitter";

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
