gsap.registerPlugin(ScrollTrigger);

//* Below the codes are just to store the data for the executive-panel, not for to convert to React
const executivesData = {
  "2024-2025": [
    {
      name: "Alvi Adib",
      position: "President",
      image: "2024-2025/alvipfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/Higashi.Yagami",
        linkedin: "https://www.linkedin.com/in/alvi-abid-2076012a6/",
      },
    },
    {
      name: "Taharat Rahman",
      position: "VP of Administration",
      image: "2023-2024/taharatpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/taharat.rahman.18",
      },
    },
    {
      name: "Muhammad Saad",
      position: "VP of Learning & Head of Physics and Math Dpt.",
      image: "2023-2024/saadpfp.jpg",
    },
    {
      name: "Raqin Shahrier",
      position: "VP of management",
      image: "2023-2024/raqinpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/raqin.shahrier",
      },
    },
    {
      name: "Md Tanvir Ahmed",
      position: "General Secretary",
      image: "2024-2025/tanvirpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/virtangog",
        github: "https://github.com/TanvirPlayzXX",
      },
    },
    {
      name: "Arham Akhyar",
      position: "Assistant General Secretary",
      image: "2024-2025/arhampfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/arham.akhyar.31",
      },
    },
    {
      name: "Alif Khandaker",
      position: "Organizing Secretary",
      image: "2024-2025/alifpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/profile.php?id=100026608211528",
      },
    },
    {
      name: "Mohammed Safoan",
      position: "Assistant Organizing Secretary",
      image: "2024-2025/safoanpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/profile.php?id=100091412962644",
      },
    },
    {
      name: "Rakesh Karmaker",
      position: "Web Developer",
      image: "2024-2025/rakeshpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/rakesh.karmaker.980",
        github: "https://github.com/rakesh-karmaker",
      },
    },
    {
      name: "Shaikh Sadi",
      position: "Graphics Designer",
      image: "2024-2025/sadipfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/ShaikhSadi2008",
      },
    },
    {
      name: "Zannatul Zafrin",
      position: "Press and Publication",
      image: "2024-2025/zannatulpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/profile.php?id=100058734297302",
      },
    },
  ],

  "2023-2024": [
    {
      name: "Nur Saba",
      position: "President",
      image: "placeholderpfp.jpg",
      socials: {},
    },
    {
      name: "Faiza Karim",
      position: "General Secretary",
      image: "placeholderpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/faizakarim1311",
      },
    },
    {
      name: "Turjo Ghosh",
      position: "Organizing Secretary",
      image: "2023-2024/turjopfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/profile.php?id=100074396814474",
      },
    },
    {
      name: "Raqin Shahrier",
      position: "Assistant General Secretary",
      image: "2023-2024/raqinpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/raqin.shahrier",
      },
    },
    {
      name: "Muhammad Saad",
      position: "Assistant General Secretary",
      image: "2023-2024/saadpfp.jpg",
      socials: {},
    },
    {
      name: "Ahanaf Muntasir",
      position: "Assistant General Secretary",
      image: "placeholderpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/MD.AHANAF.4741",
      },
    },
    {
      name: "MD. Sheam Haque",
      position: "Assistant Organizing Secretary",
      image: "placeholderpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/mdsheam.haque",
      },
    },
    {
      name: "Taharat Rahman",
      position: "Assistant Organizing Secretary",
      image: "2023-2024/taharatpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/taharat.rahman.18",
      },
    },
    {
      name: "Adnan Adib",
      position: "Assistant Organizing Secretary",
      image: "2023-2024/adnanpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/kamaboko.gonpachiro.393",
      },
    },
    {
      name: "Dhrubo Nur Ahammed",
      position: "Head of IT & Graphics Team",
      image: "placeholderpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/the.legendary.boy.134",
      },
    },
    {
      name: "Kazi Maisha",
      position: "Secretary of Press and Publication",
      image: "placeholderpfp.jpg",
      socials: {},
    },
    {
      name: "Sadaf Bin Azhar",
      position: "Secretary of Press and Publication",
      image: "placeholderpfp.jpg",
      socials: {},
    },
  ],
};

const years = Object.keys(executivesData);
let constructedHtml = {};

// This function uses innerHTML to dynamically create the executive members' elements
// It is used to reduce the HTML code
// It is not a good practice to use innerHTML so just use react components
const createExecutiveMemberElement = (year) => {
  if (!constructedHtml[year]) {
    constructedHtml[year] = "";
    const PanelData = executivesData[year];
    PanelData.forEach((member) => {
      const { name, position, image, socials } = member;

      let memberSocialHTML = "";
      if (socials) {
        Object.keys(socials).forEach((social) => {
          let socialLink = socials[social];
          memberSocialHTML += `
          <a href=${socialLink} target="_blank" title=${social}><i class="row-center fa-brands fa-${social}"></i></a>
        `;
        });
      }

      constructedHtml[year] += `
        <div class="executive-member">
          <div>
            <div class="executive-upper">
              <img
                src="../assets/images/executive-members/${image}"
                alt="A picture of ${name}"
              />
              <div class="member-socials row-center">
                ${memberSocialHTML}
              </div>
            </div>
            <div class="executive-lower col-center">
              <p>${name}</p>
              <p class="secondary-text">${position}</p>
            </div>
          </div>
        </div>
    `;
    });
  }
  const executivesContainer = document.querySelector(".executives-container");
  executivesContainer.innerHTML = constructedHtml[year];
};

$().ready(() => {
  createExecutiveMemberElement(years[0]);
  // This gsap animation will animate a scale up animation for each executive member
  gsap.utils.toArray(".executive-member").forEach((executive) => {
    gsap.fromTo(
      executive,
      {
        scale: 0.7,
        opacity: 0.5,
      },
      {
        scale: 1,
        opacity: 1,
        delay: 0.01,
        duration: 0.2,
        ease: "none",
        scrollTrigger: executive,
      }
    );
  });
});
