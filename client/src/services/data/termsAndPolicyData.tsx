import type { ReactNode } from "react";

export type TermsAndPolicyContentType = {
  title: string;
  id: string;
  content: string | ReactNode;
  list?: ReactNode[];
};

export const termsOfServiceData: TermsAndPolicyContentType[] = [
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

export const privacyPolicyData: TermsAndPolicyContentType[] = [
  {
    title: "General Information",
    id: "general-information",
    content:
      "At MSCSC, we value your privacy and are committed to safeguarding your personal information. This Privacy Policy outlines how we collect, use, disclose, and manage your information when you engage with our club, participate in our events, or interact with our website.",
  },
  {
    title: "Information We Collect",
    id: "information-we-collect",
    content:
      "We may collect the following information when you interact with our website:",
    list: [
      <p>
        <strong>Personal Information:</strong> Name, email address, profile
        picture, branch, and other details provided during registration.
      </p>,
      <p>
        <strong>Usage Data:</strong> Information about how you use the site,
        including pages visited, and features accessed.
      </p>,
    ],
  },
  {
    title: "How We Use Your Information",
    id: "how-we-use-your-information",
    content: "We use your information to:",
    list: [
      <p>
        Facilitate your participation in club events, activities, and
        competitions.
      </p>,
      <p>Send newsletters and updates about our club activities.</p>,
      <p>Improve the website’s functionality and user experience.</p>,
    ],
  },
  {
    title: "Information Sharing",
    id: "information-sharing",
    content: "Your information will only be shared with:",
    list: [
      <p>Other club members, as specified in your account settings.</p>,
      <p>
        Third-party service providers, such as hosting services, to maintain the
        website.
      </p>,
    ],
  },
  {
    title: "Cookies and Tracking",
    id: "cookies-and-tracking",
    content:
      "We use cookies to enhance your experience on our site. These cookies collect information such as your browsing behavior and preferences. You can manage cookie preferences through your browser settings.",
  },
  {
    title: "Data Security",
    id: "data-security",
    content:
      "We implement technical and organizational measures to protect your data. However, no method of transmission over the internet or electronic storage is completely secure.",
  },
  {
    title: "Your Rights",
    id: "your-rights",
    content: "You have the right to:",
    list: [
      <p>Access and update your information.</p>,
      <p>Request the deletion of your data.</p>,
      <p>Opt-out of certain data collection practices.</p>,
    ],
  },
  {
    title: "Legal Compliance",
    id: "legal-compliance",
    content:
      "We may disclose your information if required to comply with legal obligations, enforce our policies, or protect the rights, property, or safety of MSCSC or others.",
  },
  {
    title: "Changes to this Policy",
    id: "changes-to-this-policy",
    content:
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated date. Your continued use of our services after modifications constitutes acceptance of the updated Privacy Policy.",
  },
  {
    title: "Contact Us",
    id: "contact-us",
    content: (
      <span>
        If you have any questions or concerns about our Privacy Policy, please
        contact us at{" "}
        <a href="mailto:mscscofficial17@gmail">mscscofficial17@gmail</a>.
      </span>
    ),
  },
];
