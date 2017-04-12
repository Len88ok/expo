$(document).ready(function () {

    setInterval(refreshManagers, 30000);

    function refreshManagers() {

        $.post('/refresh-status', {stand_id: $('#stand').val()})
            .done(function (data) {
                if (!data.error) {
                    var managers = data.managers;

                    for (m in managers) {
                        data = managers[m];
                        var smStatusSelector = $('#sm_' + data.roomId);
                        smStatusSelector.removeAttr('class');
                        var smClass;

                        switch (data.status) {
                            case 'online':
                                smClass = 'sm-status-online';
                                break;
                            case 'busy':
                                smClass = 'sm-status-busy';
                                break;
                            default:
                                smClass = 'sm-status-offline';
                                break;
                        }
                        smStatusSelector.addClass(smClass);
                    }
                }
            });
    }

    $('.manager-slick-slider').slick({
        dots: false,
        infinite: true,
        centerPadding: 90,
       // centerMode: true,
        //respondTo: "window",
        speed: 400,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [{
            breakpoint: 1366,
            settings: {                                
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    if (typeof socket != "undefined") {
        socket.on('change sm status', function (data) {
            var smStatusSelector = $('#sm_' + data.roomId);
            smStatusSelector.removeAttr('class');
            var smStatusTestSelector = $('#ts_' + data.roomId);

            var smClass;

            switch (data.status) {
                case 'online':
                    smClass = 'sm-status-online';
                    break;
                case 'busy':
                    smClass = 'sm-status-busy';
                    break;
                default:
                    smClass = 'sm-status-offline';
                    break;
            }

            smStatusTestSelector.text(data.status);
            smStatusSelector.addClass(smClass);
        });
    }
});



