$(document).ready(() => {
    if ($(window).width <= 900) {
        $(".nav-links").slideUp(0);
    }
})

$(".navbar-toggler").click(() => {
    $(".nav-links").slideToggle("fast");
})