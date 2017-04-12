$(function() {

    var configs = {
        padding         : 0,
        margin          : [ 100, 100, 100, 100],
        fitToView       : true,
        openEffect	    : 'elastic',
        closeEffect	    : 'elastic',
        prevEffect		: 'none',
        nextEffect		: 'none',
        beforeShow: function () {
            var alt = this.element.find('img').attr('alt');
            this.inner.find('img').attr('alt', alt);
            this.title = alt;
        },
        afterShow: function () {
            var wrap = $('.fancybox-wrap');
            var route = this.element.find('img').attr('data-route');
            setTimeout(function () {
                wrap.append('<div class="item-pop-up-outer"><a class="button-base green-light showcase-catalog-item-view">Показать в каталоге</a></div>')
                    .on('click', '.showcase-catalog-item-view', function () {
                        window.location.href = route;
                    });
            }, 50);
        }
    };

    $('.showcase-stand-popup-open').attr('rel', 'showcase-stand').fancybox(configs);

});
