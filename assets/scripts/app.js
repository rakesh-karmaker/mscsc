gsap.registerPlugin(ScrollTrigger);

const swiper = new Swiper('.swiper', {
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
        }
    }

});




const counter = () => {
    const numberValues = document.querySelectorAll(".number-value");
    numberValues.forEach(numberValue => {
        count(numberValue);
        numberValue.setAttribute("counted", "true");
    })
}

const count = (ele) => {
    let number = 0;
    const limit = ele.getAttribute("value");
    const interval = 1000;
    const duration = Math.floor(interval / limit);

    const counterInterval = setInterval(() => {
        number ++;
        ele.innerText = number
        if (number == limit) {
            clearInterval(counterInterval);
        }
    }, duration);
}

// const reavel = () => {
//     $(".intro-word").addClass("intro-word-revealed");
// }
// setTimeout(() => {
//     reavel();
// }, 100)


gsap.fromTo(".stats", {
    y: "50px",
    opacity: 0
}, {
    y: 0,
    opacity: 1,
    duration: 0.5,
    stagger: 0.1,
    delay: 0.1,
    scrollTrigger: ".stats"
})

// gsap.fromTo(".upper", {
//     y: "100px",
//     opacity: 0.2
// }, {
//     y: 0,
//     opacity: 1,
//     duration: 1,
//     stagger: 0.1
// })




$(".img-2").click(() => {
    $(".img-2").addClass("image-active-1");
    $(".img-1").addClass("image-active-2");
})

$(".img-1").click(() => {
    $(".img-2").removeClass("image-active-1");
    $(".img-1").removeClass("image-active-2");
})



const removeActiveClass = (ele) => {
    for (let i = 0; i < $(".button-link").length; i++) {
        const selectedEle = $(`.button-link:nth-child(${i + 1})`);
        if (selectedEle.text() == ($(ele).text())) {
            $(selectedEle).addClass("active");
            continue;
        }
        else {
            $(`.button-link:nth-child(${i + 1})`).removeClass("active");
        }
    }
}

const navLink = () => {
    $(".nav-links").slideUp(0);
    
    $(".button-link").click(() => {
        navLink();
        removeActiveClass(this);
        $(this).addClass("active");
    })

}


$(".navbar-toggler").click(() => {
    $(".nav-links").slideToggle("fast");
})








// filter function to filter through te events slide by the status
const filter = (status) => {
    const states = ["happened", "upcoming", "all"];

    for (let i = 0; i < states.length; i++) {
        const state = $(`.${states[i]}`);
        (state.is($(`.${status}`))) ? state.addClass("nav-active") : state.removeClass("nav-active");
    }


    if (status === "all") { 
        $(".swiper-slide").css("display", "flex")
    }
    else {
        $(`.swiper-slide:not([status='${status}'])`).css("display", "none");
        $(`.swiper-slide[status='${status}']`).css("display", "flex")
    }
    swiper.updateSlides();
    swiper.slideTo(0);
    swiper.autoplay.start();
}

$(".happened").click(() => { filter("happened") });
$(".upcoming").click(() => { filter("upcoming") });
$(".all").click(() => { filter("all") });









$(document).ready(() => {
    counter();
    if ($(window).width() <= 800) {
        navLink();
    }
})