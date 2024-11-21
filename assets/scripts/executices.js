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
  $(".panel-year").removeClass("active-year");
  $(`.panel-year[year="${year}"]`).addClass("active-year");

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
  const executiveMembers = document.querySelectorAll(".executive-member");
  executiveMembers.forEach((executiveMember) => {
    observeExecutiveMember.observe(executiveMember);
  });
  window.scrollTo(0, 0);
};

// This function uses innerHTML to dynamically create the year-panel elements
// It is used to reduce the HTML code
// It is not a good practice to use innerHTML so just use react components
const createYearElement = () => {
  const yearContainer = document.querySelector(
    ".executive-panel-container > aside"
  );
  years.forEach((year) => {
    yearContainer.innerHTML += `
      <button
        class="panel-year"
        year="${year}"
      >
        ${year}
      </button>
    `;
  });

  // This event listener is used to make the triggered year panel move to the top
  $(".panel-year").click((e) => {
    const calledYearPanel = e.target.getAttribute("year");
    if (window.innerWidth <= 950) {
      const yearPanels = document.querySelectorAll(".panel-year");
      yearPanels.forEach((yearPanel) => {
        yearPanel.getAttribute("year") === calledYearPanel
          ? (yearPanel.style.order = "-1")
          : (yearPanel.style.order = "0");
      });
      toggleYearDropdown();
    }
    createExecutiveMemberElement(calledYearPanel);
  });
};

// The toggleYearDropdown function is used to toggle the year dropdown's height
const toggleYearDropdown = () => {
  const yearDropdownButton = document.querySelector(".year-dropdown");
  yearDropdownButton.classList.toggle("active");
  const yearsDropdown = document.querySelector(
    ".executive-panel-container > aside"
  );
  if (yearsDropdown.getAttribute("dropdown-active") === "false") {
    yearsDropdown.style.height = 40 * years.length + "px";
    yearsDropdown.setAttribute("dropdown-active", "true");
  } else {
    yearsDropdown.style.height = "40px";
    yearsDropdown.setAttribute("dropdown-active", "false");
  }
};

// The observeExecutiveMember function is used to observe the executive members and make scale up animation
const observeExecutiveMember = new IntersectionObserver(
  (executiveMembers) => {
    executiveMembers.forEach((executiveMember) => {
      if (executiveMember.isIntersecting) {
        executiveMember.target.classList.add("shown");
        observeExecutiveMember.unobserve(executiveMember.target);
      }
    });
  },
  {
    threshold: 0.3,
  }
);

$().ready(() => {
  createYearElement();
  createExecutiveMemberElement(years[0]);
});
