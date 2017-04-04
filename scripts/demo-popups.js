var notificationAlerts = (function () {

    var baseNotifSel = $('#notification-alert');
    var baseNofifTextContent = baseNotifSel.find('.title');

    var confirmNotifSel = $('#notification-confirm');
    var confirmNotifHeader = confirmNotifSel.find('.title');
    var confirmNotifBody = confirmNotifSel.find('.body-notif');

    var confirmNotifCloseBtn = $('#adv-nofit-close');

    var clearNotifiType = function() {
        var notifHTMLElement = confirmNotifCloseBtn.closest('.notification');
        notifHTMLElement.hasClass('error') ? notifHTMLElement.removeClass('error') : notifHTMLElement.removeClass('success');
    };

    var baseNotif = function (notificationTextContent) {
        baseNofifTextContent.text('').text(notificationTextContent);
        baseNotifSel.removeClass('notification-alert-hide').addClass('notification-alert-show');

        setTimeout(function() {
            baseNotifSel.removeClass('notification-alert-show').addClass('notification-alert-hide');
        }, 2500)
    };

    var decodeHtml = function(confirmNotifBody ,str) {
        return confirmNotifBody.html(str).text();
    };

    var confirmNotif = function(notificationTextContent) {
        clearNotifiType();
        confirmNotifCloseBtn.closest('.notification').addClass('success');
        confirmNotifHeader.text('').text(notificationTextContent.header);
        confirmNotifBody.html('').text(decodeHtml(confirmNotifBody, notificationTextContent.body));
        confirmNotifSel.removeClass('notification-hide').addClass('notification-show');
    };

    var confirmNotificationError = function(notificationTextContent) {
        clearNotifiType();
        confirmNotifCloseBtn.closest('.notification').addClass('error');
        confirmNotifHeader.text('').text(notificationTextContent.header);
        confirmNotifBody.html('').text(decodeHtml(confirmNotifBody, notificationTextContent.body));
        confirmNotifSel.removeClass('notification-hide').addClass('notification-show');
    };

    var closeConfirmNotif = function(isRedirect, redirectUrl) {
        clearNotifiType();
        if(!isRedirect || isRedirect == undefined) {
            confirmNotifCloseBtn.click(function() {
                confirmNotifSel.removeClass('notification-show').addClass('notification-hide');
            });
        } else {
            confirmNotifCloseBtn.click(function(e) {
                e.preventDefault();

                confirmNotifCloseBtn.closest('.notification').hasClass('error') ?
                    confirmNotifSel.removeClass('notification-show').addClass('notification-hide') :
                    window.location.href = redirectUrl;
            });
        }
    };

    return {
        baseNotif: baseNotif,
        confirmNotif: confirmNotif,
        confirmNotificationError: confirmNotificationError,
        closeConfirmNotif: closeConfirmNotif
    };
})();
var xhr = false;
var element = null;
var counter;
var count;
var isNotConfirmedTimer;
var connectToMjClicked = false;
var audioInvitation;
var audioInvitationContext;
var audioInvitationAnalyzer;
var isInvitePopupOpen = false;
var isInvitePopupOpenAgain = false;
var isConfirmed = false;

$(function () {

    $(window).on('unload', function() {
        if(isInvitePopupOpen) {
            isConfirmed = true;
            isInvitePopupOpen = false;
            clearIsNotConfirmedTimer();
            socket.emit('visitor reject offer', $('body').find('#room').val());
            socket.emit('close notification popup', $('body').find('#userId').val());

            var data = {
                visitor: $('body').find('#userId').val(),
                stand: $('body').find('#stand').val()
            };

            $.ajax({
                url: "/meeting-room/queue-delete-visitor",
                method: 'POST',
                data: data,
                async: false,
                complete: function (data) {
                    enableQueueButton(data.btnText);
                    $('#leaveAllQueuesBtn').empty();
                    $('.bell-btn').find('a').removeClass('active');
                    socketManagerNamespace.emit('visitors in queue', $('body').find('#stand').val());
                }
            });

            deleteUserFromMeetingRoomQueue({
                visitor: $('body').find('#userId').val(),
                stand: $('body').find('#stand').val()
            });
        }
    });

    queueInvitationSoundInit();

    notificationAlerts.closeConfirmNotif();

    var configs = {
        closeBtn: true,
        ajax: false,
        transitionIn: 'elastic',
        transitionOut: 'elastic',
        speedIn: 600,
        speedOut: 200,
        overlayShow: false,
        padding: '0px'
        // helpers     : {
        //     overlay : {
        //         closeClick: false
        //     }
        // },
        // keys : {
        //     close : null
        // }
    };

    var fancyboxConfig = configs;

    $(".popup-open").fancybox(fancyboxConfig);

    var loginInFormFancyBoxOptions = $.extend({}, configs, {
        closeBtn: true,
        width: '500',
        height: 'auto',
        autoSize: false,
        beforeShow: function() {
            $('.fancybox-inner').css({
                'width': 500
            });

            this.width = 500;
        },
        afterClose: function () {
            $('#_password').val('');

            if ($('#_password').hasClass('showTo')) {
                $('#_password')
                    .removeClass('showTo')
                    .attr('type', 'password')
                ;
            }
            clearTmpMarkData($('#_username'), 'wrong-email', 'success-email');
            clearTmpMarkData($('#_password'), 'wrong-password', 'success-password');
        }
    });

    var demoStandPopupConfigs = $.extend({}, configs,  {
        closeBtn: true,
        'tpl': {
            closeBtn: '<a title="Close" class="close-demo-stand" href="javascript:;"></a>'
        }
    });

    function initLoginRequestPopup() {
        $.fancybox.open('#register_request', {
            closeBtn: true,
            width: '500',
            height: 'auto',
            autoSize: false
        });
    }

    $(document).on('click', '.popup-open-login-request', function(e) {
        e.preventDefault();
        initLoginRequestPopup();
    });

    $('.popup-open-login').fancybox(loginInFormFancyBoxOptions);
    $('.popup-open-demostand').fancybox(demoStandPopupConfigs);

    var resetPasswordFormFancyBoxOptions = $.extend({}, configs, {
        closeBtn: true,
        width: '500',
        height: '310',
        autoSize: false
    });

    var setSifeOfRegistrationPopup = function() {

        var h,w;

        if(window.screen.width < 1680) {
            h = 530;
            w = 500;
        } else {
            h = 670;
            w = 500;
        }

        $(".fancybox-image").css({
            "width": w,
            "height": h
        });

        this.width = w;
        this.height = h;

        $('.fancybox-overlay, .fancybox-wrap').addClass('registration-form-popup');
    };

    $('.popup-open-register').fancybox({
        closeBtn: true,
        autoSize: false,
        beforeShow: setSifeOfRegistrationPopup
    });

    $('.popup-open-register.popup-open-register-with-exh').fancybox({
        closeBtn: true,
        autoSize: false,
        beforeShow: setSifeOfRegistrationPopup,
        afterShow: function() {
            $('#goExhReg input').val('go-to-exh-reg-form');
        }
    });

    $('.popup-open-reset-pw').fancybox(resetPasswordFormFancyBoxOptions);

    document.addEventListener('DOMContentLoaded', function () {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        if (window.AudioContext || window.webkitAudioContext) {
            initAudioAlertAnnouncement();
        }
    });
    if (typeof socket !="undefined") {
        socket.on('suggest user', function (data) {
            if (data.userId == $('#userId').val()) {
                confirmInviteByVisitor(data);
            }
        });
    }

    $('body').on('click', '#close, .close, #declineInvitation, #declineInvitationAgain', function () {
        $.fancybox.close();
    });

    $('body').on('click', '#logoutV', function(e) {
        e.preventDefault();

        socketManagerNamespace.emit('visitors in queue', $('#stand').val());
        window.location.href = $(this).attr('href');
    });

    if (window.location.hash == '#login') {
        $('.popup-open-login').fancybox(loginInFormFancyBoxOptions).click();
    }

    $('#_username').on('keyup', function() {
        clearTmpMarkData($(this), 'wrong-email', 'success-email');
        clearTmpMarkData($('#_password'), 'wrong-password', 'success-password');
    });

    $('#_password').on('keyup', function() {
        clearTmpMarkData($(this), 'wrong-password', 'success-password');
        clearTmpMarkData($('#_username'), 'wrong-email', 'success-email');
    });

    function clearTmpMarkData(element, wrongClass, successClass) {
        var rootElement = element.closest('div.form-group-outer');
        if(!rootElement.find('.' + wrongClass).addClass('hidden')) {
            rootElement.find('.' + wrongClass).addClass('hidden');
        }
        if(!rootElement.find('.' + successClass).hasClass('hidden')) {
            rootElement.find('.' + successClass).addClass('hidden');
        }

        $('.wrong-email-title').text('');
        $('.wrong-password-title').text('');
    }

    $('body').on('click', '#leaveAllQeueus', function (e) {
        e.preventDefault();
        var that = $(this);
        var isLeaveQueues = confirm('Вы уверены что хотите покинуть все очереди?');

        if (isLeaveQueues) {
            $.post($(this).attr('href'), {user: $('#userId').val() })
                .done(function (data) {
                    if (!data.error) {
                        that.closest('#leaveAllQueuesBtn').empty();
                        $('.bell-btn').find('a').removeClass('active');
                        enableQueueButton(data.btnText);

                        if($('#isProfileQueue') != undefined && $('#isProfileQueue').val()) {

                            var tableElements = $('#innerTable tbody tr');

                            if(tableElements.length) {
                                $.each(tableElements, function(index, element) {
                                        $(element).addClass('removed-item')
                                            .one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                                                function(e) {
                                                    $(this).remove();
                                    });
                                });
                            }

                            $('.profile-queue-tab').fadeOut(500);
                        }

                        if(data.standIds.length) {
                            $.each(data.standIds, function(index, element) {
                                socketManagerNamespace.emit('visitors in queue', element);
                            });
                        }

                    }
                })
                .complete(function() {
                    $('#visitor_leave_all_queues_menu_item').addClass('hide');
                    alert('Вы покинули все очереди');
                });
        }
    });

    function isIEorEDGE() {
        return navigator.appName == 'Microsoft Internet Explorer' || (navigator.appName == "Netscape" && navigator.appVersion.indexOf('Trident') > -1);
    }

    function leaveMRQeueuBtn() {
        $('#visitor_leave_all_queues_menu_item').removeClass('hide');
        var leaveBtnSelector = $('#leaveAllQueuesBtn');
        var title = "Покинуть все очереди";
        if(leaveBtnSelector.find('#leaveAllQeueus').length == 0) {
            leaveBtnSelector.append
            ("<a href='/meeting-room/visitor/leave-all-queues' id='leaveAllQeueus' title='" + title + "'>" + title + "</a>");
            $('#leaveAllQeueus').fadeIn(1000);
            $('.bell-btn').find('a').addClass('active');
        }
    }

    function confirmInviteByVisitor(data) {

        var userId = $('#userId').val();
        var username = $('#username').val();
        var standId = $('body').find('#stand');

        if (data.userId == userId && !data.error && data.room != 'undefined') {

            var params = {
                visitor: userId,
                stand: standId.val()
            };

            if (data.next) {

                $('#popups').empty().append(data.popupContent);

                count = 90;
                counter = setInterval(timer, 1000);

                if(!isInvitePopupOpen) {
                    $.fancybox.open('#meeting-invite', setSizesForPopups('390', '500', 'main'));
                }

                $('#acceptInvitation').on('click', function () {

                    isConfirmed = true;
                    isInvitePopupOpen = false;

                    var settedObject = {
                        room: data.room,
                        route: data.route
                    };

                    socket.emit('close notification popup', userId);

                    setTimeout(function () {
                        window.localStorage.setItem(userId, JSON.stringify(settedObject));
                        window.location.href = "/visitor/" + data.room + "/meetingroom";
                    }, 1000);

                });

                $('body').on('click', '#declineInvitation, .close-invite', function (e) {
                    e.preventDefault();

                    isConfirmed = true;
                    isInvitePopupOpen = false;

                    socket.emit('visitor reject offer', data.room);
                    socket.emit('close notification popup', userId);

                    enableQueueButton(data.btnText);
                    clearTimer();
                    deleteUserFromMeetingRoomQueue({
                        visitor: userId,
                        stand: $('body').find('#stand').val()
                    });
                });

                isNotConfirmedTimer = setTimeout(function () {
                    if (!isConfirmed) {

                        socket.emit('visitor reject offer', data.room);

                        deleteUserFromMeetingRoomQueue({
                            visitor: userId,
                            stand: $('body').find('#stand').val()
                        });

                        $.fancybox.open('#meeting-invite-again', setSizesForPopups('274', '500', 'again'));
                        $('#acceptInvitationAgain').click(function () {
                            addToMJQueue();
                            handleInvitationAgain();
                        });
                        $('#declineInvitationAgain').click(handleInvitationAgain);
                        clearTimer();
                    }
                }, 90000);
            }
        }
    }

    function handleInvitationAgain() {
        isConfirmed = true;
        socket.emit('close notification popup', $('#userId').val());
        $.fancybox.close();
    }

    function setSizesForPopups(h, w, type) {

        return {
            closeBtn: true,
            'tpl': {
                closeBtn: '<a title="Close" class="close-invite" href="javascript:;"></a>'
            },
            helpers     : {
                overlay : {
                    closeClick: false
                }
            },
            keys : {
                close : null
            },
            autoSize: false,
            beforeShow: function() {

                $(".fancybox-image").css({
                    "width": w,
                    "height": h
                });

                this.width = w;
                this.height = h;

                isConfirmed = false;

                if(type == 'main') {
                    isInvitePopupOpen = true;
                }

                if(type === 'again') {
                    isInvitePopupOpen = false;
                    isInvitePopupOpenAgain = true;
                }

                $('.fancybox-overlay').addClass('invite-popup-outer');
                $('.fancybox-wrap').addClass('invite-popup-outer');
            },
            afterShow: function() {
                queueInvitationPlay();
            }
        };
    }

    function timer() {
        if (count-- <= 0) {
            clearTimer();
            return;
        }

        count = count >= 10 ? count : '0' + count;
        $('.timer').text('(00:' + count + ')');
    }

    function clearTimer() {
        clearInterval(counter);
        $('.timer').text('(00:90)');
    }

    function clearIsNotConfirmedTimer() {
        clearTimeout(isNotConfirmedTimer);
    }

    function deleteUserFromMeetingRoomQueue(data) {

        if (xhr) {
            xhr.abort();
        }

        xhr = $.ajax({
            url: "/meeting-room/queue-delete-visitor",
            method: 'POST',
            data: data,
            async: false,
            beforeSend: function () {
                $.fancybox.close();
            },
            success: function (data) {
                if(!data.error &&  data.isHideQueueBtn) {
                    enableQueueButton(data.btnText);
                    $('#leaveAllQueuesBtn').empty();
                }
                $('.bell-btn').find('a').removeClass('active');
                xhr = false;
            },
            complete: function() {
                socketManagerNamespace.emit('visitors in queue', $('#stand').val());
            },
            fail: function () {
            }
        });
    }

    $('body').on('click', '.connect-to-mj', function (e) {
        e.preventDefault();

        if(connectToMjClicked) { return false; }

        if (typeof socket == 'undefined') {
            notificationAlerts.confirmNotificationError({'body': 'Извините, на данный момент связь с сервером конференций отсутствует. Пожалуйста, попробуйте позже.'});
            return false;
        }

        if ((navigator.webkitGetUserMedia != undefined || navigator.mozGetUserMedia != undefined) && !isIEorEDGE()) {
            if((DetectRTC.browser.isChrome && DetectRTC.browser.version >= 40) || (DetectRTC.browser.isFirefox && DetectRTC.browser.version >= 45) || DetectRTC.browser.isOpera) {
                element = $(this);
                addToMJQueue();
            } else {
                notificationAlerts.confirmNotificationError({'body': 'Для более стабильной работы митинг рума, обновите пожалуйста браузер до последней версии.'});
            }
        } else {
            notificationAlerts.confirmNotificationError({'body': 'Извините, Ваш браузер не поддерживает работу в митинг-руме. Для связи с менеджером стенда рекомендуем браузеры Google Chrome, Opera или Mozilla Firefox в Windows, Mac OS и Linux.'});
        }
    });

    function addToMJQueue() {

        if (xhr) {
            xhr.abort();
        }

        var params = {};

        if(element != null && element != undefined) {
            if(element.is('[data-item-id]') && element.attr('data-item-id')) {
                params.itemToShow = element.data('item-id');
            }
            params.stand =  element.attr('id');
        } else {
            params.stand = $('body').find('#again-non-stand').val();
        }

        params.visitor = $('#userId').val();

        xhr = $.ajax({
            url: "/meetingroom/add-visitor-to-queue",
            method: 'POST',
            async: false,
            data: params,
            success: function (data) {
                if ($('#popups').is(':empty')) {
                    $('#popups').append(data.popupContent);
                }
                if (!data.isUserInQueue) {

                    if(!data.error && data.isManagersOffline) {
                        notificationAlerts.confirmNotif({'body': data.offlineMessage});
                    }

                    if (!data.error && data.position != 'undefined' && !data.isManagersOffline) {
                        if (data.room != 'undefined') {
                            var orderInQueue = data.position == '0' ? '1' : + data.position + 1;
                            if (!data.isUserInQueue) {
                                socketManagerNamespace.emit('visitors in queue', $('#stand').val());
                                socketManagerNamespace.emit('add visitor in queue', $('#stand').val());
                            }
                            leaveMRQeueuBtn();
                            disableQueueButton(data.btnText);
                            notifyMe('Ваша позиция в очереди: ' + orderInQueue);
                        }
                    }
                } else {
                    alert('Вы уже находитесь в очереди на общение с менеджером');
                }

                xhr = false;
            },
            complete: function() {
                connectToMjClicked = false;
            }
        });
    }
});

function disableQueueButton(btnText) {

    var connectBtn = $('body').find('a.connect-to-mj');

    connectBtn.hasClass('catalog-item-button') ?
        connectBtn.addClass('inactiveLink'):
        connectBtn.removeClass('green').addClass('gray inactiveLink');
        connectBtn.text(btnText);
}

function enableQueueButton(btnText) {

    var connectBtn = $('body').find('a.connect-to-mj');

    connectBtn.hasClass('catalog-item-button') ?
        connectBtn.removeClass('inactiveLink') :
        connectBtn.removeClass('gray inactiveLink').addClass('green');
        connectBtn.text(btnText);
}

function queueInvitationSoundInit()
{
    audioInvitation = new Audio();
    audioInvitation.src = '/bundles/featurebundlemeetingroom/sound/notification_connection.ogg';
    audioInvitation.controls = false;
    audioInvitation.autoplay = false;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioInvitationContext = new AudioContext();
    audioInvitationAnalyzer  = audioInvitationContext.createAnalyser();
}

function queueInvitationPlay()
{
    audioInvitation.play();
}

function notifyMe(text) {
    if (!Notification) {
        alert('Desktop notifications not available in your browser.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification('', {
            tag: '',
            icon: '',
            iconUrl: '',
            body: text
        });
    }

    if(Notification.permission === "granted") {
        notification.onshow = function () {
            setTimeout(function () {
                notification.close();
            }, 3000);
        };
    }
}

$(document).on({
    ajaxSend: function(e, xhr) {
        if($('.loading') != undefined && $('.loading').length) {
            $('.loading').addClass('loader');
        }
    },
    ajaxStop: function() {
        $('.loading').removeClass('loader');
    }
});

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