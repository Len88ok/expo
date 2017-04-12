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

    var baseNotif = function (notificationTextContent,fadeInDelay,fadeOutDelay) {
        baseNofifTextContent.text('').text(notificationTextContent);
        if (fadeInDelay===undefined){fadeInDelay=200;}
        if (fadeOutDelay===undefined){fadeOutDelay=200;}
        baseNotifSel.fadeIn(fadeInDelay);
        baseNotifSel.removeClass('notification-alert-hide').addClass('notification-alert-show');
        setTimeout(function() {

            baseNotifSel.fadeOut(fadeOutDelay);
            baseNotifSel.removeClass('notification-alert-show').addClass('notification-alert-hide');
        }, 2500-fadeInDelay-fadeOutDelay)
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

    var extendedNotif = function(notificationTextContent,timeOut,effectUp,effectDown) {
        timeOut = typeof timeOut !== 'undefined' ? timeOut : 1500;
        effectUp = typeof effectUp !== 'undefined' ? effectUp : "";
        effectDown = typeof effectDown !== 'undefined' ? effectDown : "";
        baseNofifTextContent.text('').text(notificationTextContent);
        if(effectUp){baseNotifSel.attr("style",effectUp);}
        baseNotifSel.removeClass('notification-alert-hide').addClass('notification-alert-show');

        setTimeout(function() {
            baseNotifSel.removeClass('notification-alert-show').addClass('notification-alert-hide');
        }, timeOut)
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
        closeConfirmNotif: closeConfirmNotif,
        extendedNotif: extendedNotif
    };
})();