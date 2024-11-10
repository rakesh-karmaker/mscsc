gsap.registerPlugin(ScrollTrigger);

// This callback function is called when the user will press something on the page or the nav-links and
// will close the navbar
if (window.innerWidth <= 800) {
  $("main, footer, .nav-link a").click(() => {
    $(".nav-links-container").slideUp("fast");
  });
}

// This callback function is called when the user will press the hamburger button and
// will open/close the navbar
$(".navbar-toggler").click(() => {
  $(".nav-links-container").slideToggle("fast");
});

// This part will add the active class to the nav-link that the user is currently on
const sections = document.querySelectorAll(".page-section");
let active = [];
let thresHold = 0.55;
if (window.innerWidth <= 900) {
  thresHold = 0.3;
}

const observer = new IntersectionObserver(
  (entities) => {
    entities.forEach((entity) => {
      const id = entity.target.id;
      if (entity.isIntersecting) {
        if (active.length > 0) {
          $(`.nav-link a[href='#${active[0]}']`).removeClass("active");
          active.pop(active[0]);
        }

        id == "event" || id == "articles"
          ? $(`.nav-link:has(ul.activities) > a`).addClass("active")
          : $(`.nav-link:has(ul.activities) > a`).removeClass("active");

        active.push(id);
        $(`.nav-link a[href='#${id}']`).addClass("active");
      }
    });
  },
  {
    threshold: thresHold,
  }
);

sections.forEach((section) => {
  observer.observe(section);
});

// This part will add/remove the active class so that the image's orientations will change
$(".img-2").click(() => {
  $(".img-2").addClass("image-active-1");
  $(".img-1").addClass("image-active-2");
});

$(".img-1").click(() => {
  $(".img-2").removeClass("image-active-1");
  $(".img-1").removeClass("image-active-2");
});

// The count function will count to the value of the number-value element
const count = (ele) => {
  let number = 0;
  const limit = ele.getAttribute("value");
  const interval = 1000;
  const duration = Math.floor(interval / limit);

  const counterInterval = setInterval(() => {
    number++;
    ele.innerText = number;
    if (number == limit) {
      clearInterval(counterInterval);
    }
  }, duration);
};

// The counter function will assign a intersectionObserver to each number-value element and
// will call the count function when the element is in the viewport
const counter = () => {
  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        count(entry.target);
        numberObserver.unobserve(entry.target);
      }
    });
  });

  const numberValues = document.querySelectorAll(".number-value");
  numberValues.forEach((numberValue) => {
    numberObserver.observe(numberValue);
  });
};

// This gsap animation will animate a fade up animation to the stats section
gsap.fromTo(
  ".stats",
  {
    y: "50px",
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 0.5,
    stagger: 0.1,
    delay: 0.1,
    scrollTrigger: ".stats",
  }
);

// This swiper object will initialize the event slider
const swiper = new Swiper(".swiper", {
  slidesPerView: "auto",
  grabCursor: true,
  speed: 400,
  spaceBetween: 20,
  autoplay: {
    delay: 3000,
  },
  breakpoints: {
    1200: {
      spaceBetween: 30,
    },
    1600: {
      spaceBetween: 20,
      autoplay: {
        delay: 2000,
      },
    },
  },
});

// This gsap animation will animate a fade up animation to the events section
gsap.fromTo(
  ".swiper",
  {
    y: "100px",
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 1,
    scrollTrigger: ".swiper",
  }
);

// This filterEventsSlider function will filter through the events slide by the status
const filterEventsSlider = (status) => {
  const states = document.querySelectorAll(".event-status-nav > button");

  for (let i = 0; i < states.length; i++) {
    const state = states[i];
    state.getAttribute("status-name") == status
      ? state.classList.add("nav-active")
      : state.classList.remove("nav-active");
  }

  if (status === "all") {
    $(".activity").css("display", "flex");
  } else {
    $(`.activity:not([status='${status}'])`).css("display", "none");
    $(`.activity[status='${status}']`).css("display", "flex");
  }
};

$(".event-status-nav > button").click((e) => {
  filterEventsSlider(e.target.getAttribute("status-name"));
  swiper.updateSlides();
  swiper.slideTo(0);
  swiper.autoplay.start();
});

// This gsap animation will animate a fade up animation for each article
gsap.utils.toArray(".article").forEach((article) => {
  gsap.fromTo(
    article,
    {
      y: "100px",
      opacity: 0.4,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      scrollTrigger: article,
    }
  );
});

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

$(document).ready(() => {
  counter();
});
