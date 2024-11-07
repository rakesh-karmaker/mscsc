gsap.registerPlugin(ScrollTrigger);

const swiper = new Swiper(".swiper", {
  centeredSlides: "auto",
  slidesPerView: "auto",
  grabCursor: true,
  speed: 400,
  spaceBetween: 50,
  autoplay: {
    delay: 2000,
  },
  breakpoints: {
    600: {
      centeredSlides: false,
    },
  },
});

const counter = () => {
  const numberValues = document.querySelectorAll(".number-value");
  numberValues.forEach((numberValue) => {
    count(numberValue);
    numberValue.setAttribute("counted", "true");
  });
};

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

//! nav-link status change on section scroll

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

$(".img-2").click(() => {
  $(".img-2").addClass("image-active-1");
  $(".img-1").addClass("image-active-2");
});

$(".img-1").click(() => {
  $(".img-2").removeClass("image-active-1");
  $(".img-1").removeClass("image-active-2");
});

const navLink = () => {
  if ($(window).width() <= 800) {
    $("main").click(() => {
      $(".nav-links").slideUp("fast");
    });
  }
};

$(".navbar-toggler").click(() => {
  $(".nav-links").slideToggle("fast");
});

// filter function to filter through te events slide by the status
const filter = (status) => {
  const states = ["happened", "upcoming", "all"];

  for (let i = 0; i < states.length; i++) {
    const state = $(`.${states[i]}`);
    state.is($(`.${status}`))
      ? state.addClass("nav-active")
      : state.removeClass("nav-active");
  }

  if (status === "all") {
    $(".swiper-slide").css("display", "flex");
  } else {
    $(`.swiper-slide:not([status='${status}'])`).css("display", "none");
    $(`.swiper-slide[status='${status}']`).css("display", "flex");
  }
  swiper.updateSlides();
  swiper.slideTo(0);
  swiper.autoplay.start();
};

$(".happened").click(() => {
  filter("happened");
});
$(".upcoming").click(() => {
  filter("upcoming");
});
$(".all").click(() => {
  filter("all");
});

$(document).ready(() => {
  counter();
  if ($(window).width() <= 800) {
    navLink();
  }
});
