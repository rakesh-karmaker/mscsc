// Navigation links data
export const navLinks: { href: string; name: string }[] = [
  {
    href: "/",
    name: "Home",
  },
  {
    href: "/about",
    name: "About Us",
  },
  {
    href: "/members",
    name: "Members",
  },
  {
    href: "/activities",
    name: "Activities",
  },
  {
    href: "/contact",
    name: "Contact",
  },
];

// Footer links data
export const footerLinks: { [key: string]: { title: string; link: string }[] } =
  {
    Pages: [
      {
        title: "Home",
        link: "/",
      },
      {
        title: "About Us",
        link: "/about",
      },
      {
        title: "Members",
        link: "/members",
      },
      {
        title: "Executives",
        link: "/executives",
      },
      {
        title: "Contact Us",
        link: "/contact",
      },
      {
        title: "Tasks",
        link: "/tasks",
      },
    ],
    Activities: [
      {
        title: "Events",
        link: "/activities?tag=Event",
      },
      {
        title: "Workshops",
        link: "/activities?tag=Workshop",
      },
      {
        title: "Articles",
        link: "/activities?tag=Article",
      },
      {
        title: "Achievements",
        link: "/activities?tag=Achievement",
      },
    ],
    Links: [
      {
        title: "Privacy Policy",
        link: "/privacy-policy",
      },
      {
        title: "Terms of Service",
        link: "/terms-of-service",
      },
      {
        title: "Facebook",
        link: "https://www.facebook.com/MSCSC2014",
      },
      {
        title: "Instagram",
        link: "https://www.instagram.com/_mscsclub_/",
      },
    ],
  };

// School branches data
export const branches: { value: string; label: string }[] = [
  {
    value: "Branch - 1",
    label: "Branch - 1",
  },
  {
    value: "Branch - 2",
    label: "Branch - 2",
  },
  {
    value: "Branch - 3",
    label: "Branch - 3",
  },
  {
    value: "Main Boys",
    label: "Main Boys",
  },
  {
    value: "Main Girls",
    label: "Main Girls",
  },
];

// Message table header configuration
export const messageTableHeader: {
  title: string;
  key: string;
  break: boolean;
}[] = [
  {
    title: "Name",
    key: "name",
    break: false,
  },
  {
    title: "Email",
    key: "email",
    break: false,
  },
  {
    title: "Subject",
    key: "subject",
    break: true,
  },
  {
    title: "View",
    key: "btn",
    break: false,
  },
  {
    title: "Action",
    key: "btn",
    break: false,
  },
];

// Activity tags data
export const tags: { value: string; label: string }[] = [
  {
    value: "Event",
    label: "Event",
  },
  {
    value: "Workshop",
    label: "Workshop",
  },
  {
    value: "Article",
    label: "Article",
  },
  {
    value: "Achievement",
    label: "Achievement",
  },
];
