$(document).ready(() => {
    if ($(window).width <= 800) {
        $(".nav-links").slideUp(0);
    }
})

$(".navbar-toggler").click(() => {
    $(".nav-links").slideToggle("fast");
})

$(".happened").click(() => {
    $(".all").removeClass("nav-active");
    $(".upcoming").removeClass("nav-active");
    $(".happened").addClass("nav-active");
    $(".swiper-slide[status='happened']").slideDown("fast");
    $(".swiper-slide:not([status='happened'])").slideUp("fast");
})

$(".upcoming").click(() => {
    $(".all").removeClass("nav-active");
    $(".happened").removeClass("nav-active");
    $(".upcoming").addClass("nav-active");
    $(".swiper-slide[status='upcoming']").slideDown("fast");
    $(".swiper-slide:not([status='upcoming'])").slideUp("fast");
})

$(".all").click(() => {
    $(".all").addClass("nav-active");
    $(".happened").removeClass("nav-active");
    $(".upcoming").removeClass("nav-active");
    $(".swiper-slide").slideDown("fast");
})