gsap.registerPlugin(ScrollTrigger);

//* Below the codes are just to store the data for the executive-panel, not for to convert to React
const executivesData = {
  "2024-2025": [
    {
      name: "Alvi Adib",
      position: "President",
      image: "alvipfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/Higashi.Yagami",
        linkedin: "https://www.linkedin.com/in/alvi-abid-2076012a6/",
      },
    },
    {
      name: "Taharat Rahman",
      position: "VP of Administration",
      image: "taharatpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/taharat.rahman.18",
      },
    },
    {
      name: "Muhammad Saad",
      position: "VP of Learning & Head of Physics and Math Dpt.",
      image: "saadpfp.jpg",
    },
    {
      name: "Raqin Shahrier",
      position: "VP of management",
      image: "raqinpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/raqin.shahrier",
      },
    },
    {
      name: "Md Tanvir Ahmed",
      position: "General Secretary",
      image: "tanvirpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/virtangog",
        github: "https://github.com/TanvirPlayzXX",
      },
    },
    {
      name: "Arham Akhyar",
      position: "Assistant General Secretary",
      image: "arhampfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/arham.akhyar.31",
      },
    },
    {
      name: "Alif Khandaker",
      position: "Organizing Secretary",
      image: "alifpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/profile.php?id=100026608211528",
      },
    },
    {
      name: "Mohammed Safoan",
      position: "Assistant Organizing Secretary",
      image: "safoanpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/profile.php?id=100091412962644",
      },
    },
    {
      name: "Rakesh Karmaker",
      position: "Web Developer",
      image: "rakeshpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/rakesh.karmaker.980",
        github: "https://github.com/rakesh-karmaker",
      },
    },
    {
      name: "Shaikh Sadi",
      position: "Graphics Designer",
      image: "sadipfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/ShaikhSadi2008",
      },
    },
    {
      name: "Zannatul Zafrin",
      position: "Press and Publication",
      image: "zannatulpfp.jpg",
      socials: {
        facebook: "https://www.facebook.com/profile.php?id=100058734297302",
      },
    },
  ],

  "2023-2024": [],
};

const years = Object.keys(executivesData);
let constructedHtml = "";

// This function uses innerHTML to dynamically create the executive members' elements
// It is used to reduce the HTML code
// It is not a good practice to use innerHTML so just use react components
const createExecutiveMemberElement = (year) => {
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

    constructedHtml += `
      <div class="executive-member">
        <div>
          <div class="executive-upper">
            <img
              src="../assets/images/executive-members/${year}/${image}"
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

  const executivesContainer = document.querySelector(".executives-container");
  executivesContainer.innerHTML = constructedHtml;
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
