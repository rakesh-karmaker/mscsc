//* Below the codes are just to store the data for the activities, not for to convert to React
const activitiesData = [
  {
    tag: "workshop",
    activityDate: "11-10-2024",
    activityImagePath: "psycho&humanbrain.jpg",
    activityName: "Psychology & Human Brain",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid02v6CpPbgH94nYqVVTqEQWAyP5eDKbT8YT4JHREuovxBw8zXvhfQCpMMEv4gdC2hrJl",
  },
  {
    tag: "workshop",
    activityDate: "23-08-2024",
    activityImagePath: "psandsd.jpg",
    activityName: "Problem Solving and Skill Development",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid033NC7YhySMq2xF8wZQNTDSzaB9SMzkn7dLebpUbMcwSDRWWvfJcYTWKppLSLDBdcwl",
  },
  {
    tag: "workshop",
    activityDate: "16-08-2024",
    activityImagePath: "newtonian.jpg",
    activityName: "Newtonian Mechanics",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid02ExP6BMGRua3Uw9qpxAjqnBQCuwA2RDxaJJk2qdbggiDdTnh3YCEU1RLiTTsWArGSl",
  },
  {
    tag: "article",
    activityDate: "21-05-2024",
    activityImagePath: "analyticalchemistry.jpg",
    activityName: "Analytical Chemistry",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid02bvKttcr2XvPNQYYEvP3mM9ULvQoL3YntV1ERV3uVGzgnLMGpFGPAA2TQut1wqohTl",
  },
  {
    tag: "article",
    activityDate: "23-04-2024",
    activityImagePath: "europa.jpg",
    activityName: "ARE WE ALONE IN THE UNIVERSE?",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid02asPSimLtLt7pHSYa62sQMATDdCbQZHN1mxeckCFEtYaN8hyaYEnpv9DbirVKoZuyl",
  },
  {
    tag: "article",
    activityDate: "21-04-2024",
    activityImagePath: "neutronstars.jpg",
    activityName: "Neutron Stars",
    activityDesc: `Neutron stars are the remains of the cores of massive stars that have reached the end of their lives. There are 2 possible evolutionary endpoints of the massive stars, they can be either black holes or neutron stars. Astronomers consider the mass of a neutron star to range from 1.4 to 2.9 solar masses.
A neutron star is the densest object astronomers can observe directly. It was discovered by Jocelyn Bell Burnell in 1967.
There are several types of neutron stars, including magnetars and pulsars. There are thought to be around one billion neutron stars in the Milky Way. Only 31 magnetars have ever been discovered and over 3000 pulsars have been discovered.`,
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid027RYKXSgpbCajg7kCfcKjZPm1CACL2LwpSuCiz1npGctZvfhBchHUn36jtVEDfmwVl",
  },
  {
    tag: "achievement",
    activityDate: "22-03-2024",
    activityImagePath: "1strunnersupbdmo.jpg",
    activityName: "1st Runner Up at BDMO",
    activityDesc:
      "MSCSC is representing itself in its fullest on the national field, Muhammad Saad from MSCSC has become 1st runners-up in the national round secondary category of BDMO. Through these successes, MSCSC is effectively displaying the talent and skills of our members. We can only hope for even more prosperous days in the future of MSCSC.",
    activityLink:
      "https://www.facebook.com/photo.php?fbid=811658817668493&set=a.461248879376157&type=3",
  },
  {
    tag: "achievement",
    activitiesDate: "22-03-2024",
    activityImagePath: "2ndrunnersupbdbo.jpg",
    activityName: "2nd Runner Up at BDBO",
    activityDesc:
      "MSCSC is representing itself in its fullest on the national field, Raqin Shahrier has become the 2nd regional runners-up of BDBO. Through these successes, MSCSC is effectively displaying the talent and skills of our members. We can only hope for even more prosperous days in the future of MSCSC.",
    activityLink:
      "https://www.facebook.com/photo/?fbid=811658864335155&set=pcb.811658881001820",
  },
  {
    tag: "workshop",
    activityDate: "02-03-2024",
    activityImagePath: "wave-nature.jpg",
    activityName: "The Wave Nature of Light",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid02myHnJTczAxY8i1rzNfh4MSLUf5gAeMmk29iHYXFy362M23HyHvN3zFN4UtTndN1tl",
  },
  {
    tag: "workshop",
    activityDate: "16-12-2023",
    activityImagePath: "logicbehindcomputers.jpg",
    activityName: "Introduction to the logic behind",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid033rFyVZJR7Z1dQxp1UXhkTe55JkBSFfE7VzjWaeSP8C1UJziZk4ZY3NuAeBNPvE3ql",
  },
  {
    tag: "workshop",
    activityDate: "05-05-2023",
    activityImagePath: "hawkingradiationbigbangcipa.jpg",
    activityName: "Hawking Radiation, Big Bang, CIPA",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid06ymY657GmMvKjSXH8wsKkaP34nACtLMtUXhyerTpxwEhUDwL8nswtnBK5cEFSWgul",
  },
  {
    tag: "workshop",
    activityDate: "24-01-2023",
    activityImagePath: "matholympiad.jpg",
    activityName: "Math Olympiad",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid02JxEZscZxqRQA6xmh1GRhFkt1GM9phXT1b9xwxx95h8DeEspsoHcP9y28myZPPEoel",
  },
  {
    tag: "workshop",
    activityDate: "20-01-2023",
    activityImagePath: "projectbuilding.jpg",
    activityName: "Project Building",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid02oQcnpL88MkaUJhpKAoUGPjaqBoMyHWz1bTHnbeszSE6EbXSVxQRdbM2rSQAeaMr3l",
  },
  {
    tag: "event",
    activityDate: "26-01-2023",
    activityImagePath: "intraschool-2023.png",
    activityName: "Intraschool exploration (2023)",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/photo/?fbid=544333784400999&set=a.461248859376159",
  },
  {
    tag: "event",
    activityDate: "23-09-2022",
    activityImagePath: "scitonic2.0.png",
    activityName: "Scitonic 2.0",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/photo.php?fbid=461248866042825&set=pb.100064731457622.-2207520000&type=3",
  },
  {
    tag: "event",
    activityDate: "19-08-2021",
    activityImagePath: "chemistrycampaign.jpg",
    activityName: "Chemistry Campaign",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/photos/a.199847797167738/1169562713529570/?type=3",
  },
  {
    tag: "workshop",
    activityDate: "29-07-2021",
    activityImagePath: "robotics.jpg",
    activityName: "Robotics",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/posts/pfbid025DmM5ZHcEiUWDFTEnkBnepp5omiZ8h7uW3HtgjoXr15t7uwtZuCKhBEiCfLZPvP3l",
  },
  {
    tag: "event",
    activityDate: "07-07-2021",
    activityImagePath: "astrocampaign.jpg",
    activityName: "Astro Campaign",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/photos/a.199847797167738/1138074580011717/?type=3",
  },
  {
    tag: "event",
    activitiesDate: "03-03-2021",
    activityImagePath: "mathtcsquest.png",
    activityName: "Mathycs Quest",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/MSCSC2014/photos/pb.100064731457622.-2207520000/1057644704721372/?type=3",
  },
  {
    tag: "event",
    activityDate: "02-10-2020",
    activityImagePath: "science&cosmicspace.png",
    activityName: "Science & Cosmic Space",
    activityDesc:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus aliquid officiis provident ad molestiae consequatur facere odit voluptas veniam dignissimos!",
    activityLink:
      "https://www.facebook.com/photo?fbid=951179522034558&set=pb.100064731457622.-2207520000",
  },
  {},
];
