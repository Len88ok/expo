$('body').on('init', '.showcase-carousel1', function(event, slick){
    $('.slick-prev').hide();
    $('.slick-next').show();
});

$(".showcase-carousel1").slick({
    dots: true,
    infinite: false,
    arrows: true,
    adaptiveHeight: true,
    accessibility: true,
    draggable: false,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [{
        breakpoint: 1367,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 3
        }
    }]
});

$('body').on('afterChange', '.showcase-carousel1', function (event, slick, currentSlide, nextSlide) {

    if($('.slick-dots').find('li:first').hasClass('slick-active')) {
        $('.slick-prev').hide();
        $('.slick-next').show();
    } else if($('.slick-dots').find('li:last').hasClass('slick-active')) {
        $('.slick-next').hide();
        $('.slick-prev').show();
    }

    if(
        !$('.slick-dots').find('li:first').hasClass('slick-active') &&
        !$('.slick-dots').find('li:last').hasClass('slick-active')
    ) {
        $('.slick-prev, .slick-next').show();
    }
});