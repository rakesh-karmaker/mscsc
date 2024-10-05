
$(document).ready(() => {
    if ($(window).width() <= 800) {
        navLink();
    }
})


const swiper = new Swiper('.swiper', {
    centeredSlides: "auto",
    loop: true,
    initialSlide: 0,
    slidesPerView: "auto",
    grabCursor: true,
    speed: 400,
    spaceBetween: 40,
    autoplay: {
        delay: 2000,
    },

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        600: {
            loop: true,
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

const filter = (status) => {
    const states = ["happened", "upcoming", "all"];
    for (let i = 0; i < states.length; i++) {
        const selectedEle = $(`.${states[i]}`);
        (selectedEle === status) ? selectedEle.addClass("nav-active") : selectedEle.removeClass("nav-active");
    }
    if (status === "all") { 
        $(".swiper-slide").css("display", "flex")
        $(".swiper-slide").slideDown("fast");
    }
    else {
        $(`.swiper-slide[status='${status}']`).css("display", "flex")
        $(`.swiper-slide[status='${status}']`).slideDown("fast");
        $(`.swiper-slide:not([status='${status}'])`).slideUp("fast");
        $(`.swiper-slide:not([status='${status}'])`).css("display", "none");
    }
    swiper.updateSlides();
    swiper.slideTo(0);
    swiper.autoplay.start();
}

$(".happened").click(() => { filter("happened") });
$(".upcoming").click(() => { filter("upcoming") });
$(".all").click(() => { filter("all") });