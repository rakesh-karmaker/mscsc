const swiper = new Swiper('.swiper', {
    centeredSlides: "auto",
    spaceBetween: 30,
    slidesPerView: "auto",
    grabCursor: true,
    speed: 400,
    spaceBetween: 100,
    autoplay: {
        delay: 2000,
    },
    breakpoints: {
        600: {
            centeredSlides: false,
        }
    }

});












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
    if ($(window).width() <= 800) {
        navLink();
    }
})