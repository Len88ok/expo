$(document).ready(function() {

    $(window).on('beforeunload', function(evt) {

        var message = 'При перезагрузке страницы Вы покините очередь на общение в митинг руме';

        if (typeof evt == "undefined") {
            evt = window.event;
        }

        if (evt && isInvitePopupOpen) {
            evt.returnValue = message;
        }

        if(isInvitePopupOpen) {
            return message;
        }
    });

    $('body').on('click', '.toShowExpohallVideo', function (e) {
        e.preventDefault();

        window.localStorage.setItem('toShowExpohallVideo', true);
        window.location.href = $(this).attr('href');
    });

    $('#online-help-btn').on('click', function(){
        supportAPI.openSupport();
    });

    setNavigation();

    function setNavigation() {
        var path = window.location.pathname;
        path = path.replace(/\/$/, "");
        path = decodeURIComponent(path);

        $('ul.main-menu li a').each(function () {

            var href = $(this).attr('href');

        if(href != undefined) {
            if (path.substring(0, href.length) === href) {
                $(this).closest('li').addClass('active');
            }
        }
        });
    }

    if(window.location.hash == "#registration") {
        if(!$('body').find('#userId').length) {
            $.fancybox.open(['#registration']);
        } else {
            window.location.href= '/visitor/profile/tickets';
        }
    }

    if(window.location.hash == "#confirmation") {
        $.fancybox.open('#confirmation', {
            afterShow: function() {
                window.location.hash = '';
            }
        });
    }

    if(!$('#userId').length) {
        if(unescape(window.location.href).search("#resetPassword") != '-1') {

            $.fancybox.open('#changePassword', {
                width     : '500',
                height    : 'auto',
                autoSize  : false,
                afterShow: function () {
                    $('.fancybox-skin').append('<a title="Close" id="change-password-close" class="fancybox-item fancybox-close" href="javascript:;"></a>');
                }
            });
        }

        $('body').on('click', '#change-password-close', function() {
            window.location.href="/#login";
        });

    }

    $('#main, .leave-all-queues, .close-popup, .profile a').on('click', function() {
        if (!$('#userAdditionInfo').hasClass('hidden') || !$('.leave-all-queues').hasClass('hidden')) {
            $('#userAdditionInfo, .leave-all-queues').addClass('hidden');
        }
    });

    $('body').on('click', '.profile a', function() {
        $('#userAdditionInfo').removeClass('hidden');
    });


    $('body').on('click', '.bell-btn', function() {
        $('.leave-all-queues').removeClass('hidden');
    });

    if(!$('body').find('#leaveAllQeueus').parent('li').hasClass('hide')) {
        $('.bell-btn').find('a').addClass('active');
    }

    $('body').keyup(function (e) {
        if (e.keyCode == 13) {
            if($('#registration').is(':visible')) {
                $('#regFormBtn').trigger('click');
            } else if($('#login').is(':visible')) {
                $("#logIn").trigger("click");
            }
        }
    });

    if($('select').length && !$('select').hasClass('non-select')) {
        $('select').select2({
            minimumResultsForSearch: -1
        });
    }

    /*---window height---*/
    var height_page = $(window).height();
    var search_result_shift = height_page - 280;

    $('#main').css('height', height_page );
    $('#search-result-block').css('height', search_result_shift);

    $(window).resize(function() {
        var height_page = $(window).height();
        var search_result_shift = height_page - 280;

        $('#main').css( 'height' , height_page );
        $('#search-result-block').css('height', search_result_shift);
    });

    $('.popup-open-search').click(function(e){
        e.preventDefault();
        //added js by Len88ok
        $('.popup-open-search').hide(speed);

        var li    = $('.search-input-li');
        var speed = 600;

        if (!li.is(':visible')) {
            li.show(speed, function() {
                $('#search-input-field').focus();                
            });
        } else {
            li.hide(speed);
        }
    });

    //added js by Len88ok
    $('#search-input-field').on('blur', function(){
        $('.popup-open-search').show();
        $('.search-input-li').hide();
    });


    $('#start-search').click(function(e){
        e.preventDefault();

        var search = $.trim($('#search-input-field').val());
        search = search ? search : 'all';

        window.location.href = '/search/' + search + '/all';
    });

    $('#search-input-field').on('keyup', function(e) {
        if (e.keyCode == 13) {

            var search = $.trim($('#search-input-field').val());
            search = search ? search : 'all';

            window.location.href = '/search/' + search + '/all';
        }
    });
});