
$(document).ready(() => {
    if ($(window).width() <= 800) {
        navLink();
    }
})


const removeActiveClass = (ele) => {
    for (let i = 0; i < $(".button-link").length; i++) {
        const selectedEle = $(`.button-link:nth-child(${i + 1})`);
        if (selectedEle.text() == ($(ele).text())) {
            selectedEle.addClass("active");
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