import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Terms.css";
import {
  KeyPoints,
  TermsPolicyContent,
} from "@/components/UI/TermsPolicy/TermsPolicy";

const TermsOfService = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          element.active = true;
        }
      }, 0);
    }
  }, [location]);

  return (
    <main className="page-terms">
      <h1 className="section-heading">
        <span className="highlighted-text">Terms</span> of Service
      </h1>
      <div className="terms-container">
        <KeyPoints content={content} />
        <TermsPolicyContent content={content} page="terms" />
      </div>
    </main>
  );
};

const content = [
  {
    title: "Acceptance of Terms",
    id: "acceptance-of-terms",
    content:
      'By using our website, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you may not use our website.',
  },
  {
    title: "Eligibility",
    id: "eligibility",
    content:
      "Our website is intended for use by students, faculty, and alumni of Monipur School and College. By registering or using our services, you confirm that you meet these eligibility requirements.",
  },
  {
    title: "User Conduct",
    id: "user-conduct",
    content:
      "You agree to use our website responsibly and for its intended purposes. You will not:",
    list: [
      <p>Post or share inappropriate, offensive, or illegal content.</p>,
      <p>Attempt to access unauthorized areas of the site.</p>,
      <p>Violate the privacy of other users.</p>,
    ],
  },
  {
    title: "Account Registration",
    id: "account-registration",
    content:
      "To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.",
  },
  {
    title: "User Content",
    id: "user-content",
    content:
      "By submitting content (e.g., profile details, posts, images) to the website, you grant MSCSC the right to use, modify, and display the content for club-related purposes. You retain ownership of your content.",
  },
  {
    title: "Privacy Policy",
    id: "privacy-policy",
    content:
      "Your use of the website is also governed by our Privacy Policy, which explains how we collect, use, and protect your information.",
  },
  {
    title: "Termination",
    id: "termination",
    content:
      "MSCSC reserves the right to suspend or terminate your access to the website if you violate these Terms or engage in any activity deemed harmful to the community.",
  },
  {
    title: "Disclaimers",
    id: "disclaimers",
    content:
      'The website is provided "as is" without warranties of any kind. MSCSC is not responsible for any errors, downtime, or losses incurred through the use of the website.',
  },
  {
    title: "Governing Law",
    id: "governing-law",
    content:
      "These Terms shall be governed by the laws of Bangladesh. Any disputes shall be resolved in the courts located in Dhaka.",
  },
];

export default TermsOfService;
