var isFileChanged = false;
var isFileCleared = false;
var isCompanyImageCleared = false;

var ajaxQuery = function (url, data, options, isFile) {
    var defaultOptions = {
        type: 'POST',
        url: url,
        width: 400,
        data: data,
        dataType: 'json',
        timeout: 20000
    };

    if(isFile) {
        defaultOptions.processData = false;
        defaultOptions.contentType = false;
    }

    options = $.extend({}, defaultOptions, options);
    var successUser = function (data) {
    };
    if (typeof options.success != 'undefined') {
        successUser = options.success;
    }
    var errorUser = function (xhr, status, error) {
    };
    if (typeof options.error != 'undefined') {
        errorUser = options.error;
    }
    options.success = function (data) {
        successUser(data);
    };
    options.error = function (xhr, status, error) {
        errorUser(xhr, status, error);
        if (error != 'abort') {

        }
    };

    var xhr = $.ajax(options);

    return xhr;
};

var clearFormData = function(form) {

if(form)
    form.find('.field-valid').each(function () {
        row = $(this);
        row.removeClass('error');
        row.find('.error-text').html('');
    });

    if(form[0].id == 'registrationForm') {
        $('.i-agree .icheckbox').eq(0).css('error-checkbox');
        if(!$('#fos_user_registration_form_termsOfUser').prop('checked')) {
            $('.i-agree .icheckbox').eq(0).addClass('error-checkbox').closest('.form-group-outer').addClass('error');
        }
    }
};

var bindFormErrors = function (form, errors) {

    form.find('.field-valid').removeClass('error');

    for (field in errors) {

        var row = $(form.find('#' + field).parents('.field-valid')[0]);
        row.addClass('error');

        if(form.attr('id') == 'registrationForm' && field == 'fos_user_registration_form_email' && $('#'+ field).val() == "") {
            row.find('.error-text').html($('<span class="red">' + errors[field][1] + '</span>'));
        } else {
            row.find('.error-text').html($('<span class="red">' + errors[field][0] + '</span>'));
        }

            var isHasPwError = $('#fos_user_registration_form_plainPassword_first').closest('.field-valid').hasClass('error');

            if(isHasPwError) {
                $('#fos_user_registration_form_plainPassword_second').closest('.field-valid').addClass('error');
                var secondPasswordFieldMain = $('#fos_user_registration_form_plainPassword_second').closest('.field-valid');
                    secondPasswordFieldMain.find('.success-password').addClass('hidden');
                    secondPasswordFieldMain.find('.wrong-password').removeClass('hidden');
            } else {
                $('#fos_user_registration_form_plainPassword_second').closest('.field-valid').removeClass('error');
                var secondPasswordFieldMain = $('#fos_user_registration_form_plainPassword_second').closest('.field-valid');
                secondPasswordFieldMain.find('.wrong-password').addClass('hidden');
                secondPasswordFieldMain.find('.success-password').removeClass('hidden');
            }

        if(form.attr('id') != 'exhibitor_registration_form' && row.parent().find('.necessary-string-icon').length) {
            row.parent().find('.necessary-string-icon').remove();
        }

        row.find('.success-password').addClass('hidden');
        row.find('.wrong-password').removeClass('hidden');
    }

    $.each(form.find('.field-valid'), function() {
        if(!$(this).hasClass('error')) {
            $(this).find('.wrong-password').addClass('hidden');
            $(this).find('.success-password').removeClass('hidden');
        }

    });
};

var ajaxForm = function (form, options, isFile) {
    if (!form.length){
        console.log('ajaxForm on Empty');
        return;
    }
    console.log('Called AjaxForm for:'+((form instanceof jQuery)?form[0].tagName+'#'+form[0].id+'.'+form[0].className:'uNKnown')+' ('+(form.length?'found':'not found')+')');
    //console.log(form.length);
    var xhr;
    if (typeof options != 'object')
        var options = {};
    if (typeof options.before == 'function')
        options.before();

    form.submit(function (e) {
        console.log("Form Submit AJAX (FormValidation.JS). Form:"+this.id);
        e.preventDefault();
        if (xhr && xhr.readyState != 4) {
            return false;
        }
        var form = $(this);
        var url = $(this).attr('action');

        if(isFile) {
            var data = new FormData();

            if(isFileChanged) {
                data.append('file', $('input[type=file]')[0].files[0]);
            }
            if(isFileCleared) {
                data.append('isFileCleared', isFileCleared);
            }
            if (isCompanyImageCleared){
                data.append('isCompanyImageCleared',isCompanyImageCleared);
            }
                data.append(form.attr('id'), form.serialize());

        } else {
            var data = $(this).serialize();
        }

        xhr = ajaxQuery(url, data, {
            beforeSend: function (xhr) {
                clearFormData(form);
            },
            success: function (data) {
                if (data.error) {
                    bindFormErrors(form, data.data);
                    if (typeof options.error == 'function') {
                        options.error(data);
                    }
                } else if (typeof options.success == 'function') {
                    options.success(data);
                }
            },
            complete: function () {
                $.fancybox.hideLoading();
            }
        }, isFile);
        return false;
    });
};

var redirect = function(url) {
    window.location.href = url;
};

var clearFileInputField = function(Id, error) {
    $('#preview, #previewM').attr('src', '/bundles/sitebundlefrontend/images/no-photo.png');
    document.getElementById(Id).innerHTML = document.getElementById(Id).innerHTML;
    $('#clearProfileImage').addClass('hidden').fadeOut('1000');
};
var clearCompanyImageField = function(Id, error) {
    $('#exhCompanyPhoto img.exhibitor_image').attr('src', '/bundles/sitebundlefrontend/images/no-photo.png');
    document.getElementById(Id).innerHTML = document.getElementById(Id).innerHTML;
    $('#clearCompanyImage').addClass('hidden').fadeOut('1000');
};
var imageIploadValidation = function(image) {

    var fileObj = image.files[0];
    var error = false;
    if(fileObj) {
        var fileName = fileObj.name;
        var fileSize = fileObj.size;
        var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        if((fileExtension != "png" && fileExtension != "jpeg" && fileExtension != "jpg") || fileSize > 10000000) {
            notificationAlerts.confirmNotificationError({'body' : Translator.trans('front:profile:exhibitor:upload:image:constraint:msg')});
            error = true;
        }
    }

    if(error) {
        clearFileInputField('fileInputContainer', error);
    }

    return error;
};

function showPassword(element) {

    var passwordField = $(element).closest('.field-valid').find('input').attr('id');
    var selector = $('#' + passwordField);

    if(selector.val() != '') {
        if (selector.hasClass('showTo')) {

            selector
                .removeClass('showTo')
                .attr('type', 'password');

            $(element).attr('title', "Показать пароль");

        } else {

            selector
                .addClass('showTo')
                .attr('type', 'text');

            $(element).attr('title', "Скрыть пароль");
        }
    }
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            isFileChanged = true;
            $('#preview, #previewM').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);

        if ($('#clearProfileImage').hasClass('hidden')) {
            $('#clearProfileImage').removeClass('hidden').fadeIn('1000');
        }
    }
}

function readImageUrlExhibitor(input) {
    if (input.classList.contains('personal-data-form-input')){
        return;
    }
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        isFileChanged = true;

        reader.onload = function (e) {
            $('.exhibitor_image, /* .userCropPhoto,*/#previewM').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

var clearNotificationIcons = function(form, toClear) {

    if(toClear) {
        form.find('input[type="text"], input[type="password"], input[type="email"]').val('');
    }

    $.each(form.find('.field-valid'), function() {
        if(!$(this).hasClass('error')) {
            $(this).find('.wrong-password').addClass('hidden');
            $(this).find('.success-password').addClass('hidden');
        }
    });
};

var visitorProfileChangePasswordForm = $('#fos_user_change_password_form');

ajaxForm(visitorProfileChangePasswordForm, {
    success: function (data) {
        clearNotificationIcons(visitorProfileChangePasswordForm, true);
        if(!data.error) {
            notificationAlerts.baseNotif(data.text);
        }
    },
    error: function () {
    }
});

var visitorProfileChangeEmailForm = $('#fos_user_change_email_form');
var currentPasswordField = $('#currentEmailAddress');

ajaxForm(visitorProfileChangeEmailForm, {
    success: function (data) {
        clearNotificationIcons(visitorProfileChangeEmailForm, true);
        if(!data.error) {
            if(data.email != undefined) {
                currentPasswordField.text('').text(data.email);
            }
            notificationAlerts.baseNotif(data.text);
        }
    },
    error: function () {
    }
});

var exhibitorRegistrationForm = $('#exhibitor_registration_form');

ajaxForm(exhibitorRegistrationForm, {
    success: function (data) {
        clearNotificationIcons(exhibitorRegistrationForm, false);
        if(!data.error) {
            $('.page-registration, .drop-zone').addClass('inactiveLink');
            $('#sendRequestToBecomeExhibitor').attr('disabled', 'disabled');
            $('.fileupload').attr('disabled', 'disabled');
            $('.remove').addClass('inactiveLink');
            $('.user-login-panel-list .remark').text('Заявка в обработке');
            $('#reg-exh-status-notif').removeClass('hidden');
            var photoElement = $('#preview').parent('a');

            if(photoElement.attr('href') != undefined) {
                photoElement.removeAttr('href').removeAttr('id').addClass('inactiveLink');
            }

            notificationAlerts.confirmNotif(data.message);
        }
    },
    error: function (data) {
        if (data.file_error) {
            notificationAlerts.confirmNotificationError({'body' : data.file_error_msg});
        }
    }
}, true);

var visitorProfileForm = $('#fos_user_profile_form');

ajaxForm(visitorProfileForm, {
    success: function (data) {
        if(!data.error) {
            isFileChanged = false;
            isFileCleared = false;
            isCompanyImageCleared = false;
            notificationAlerts.baseNotif(data.text);
        }
    },
    error: function () {
    }
}, true);


$('body').on('change', '#fos_user_profile_form_file, #file-input', function () {
    if (!imageIploadValidation(this)) {
        readURL(this);
    }
});

$('body').on('click', '#clearProfileImage', function () {
    isFileCleared = true;
    $('.editBtn').addClass('hidden');
    clearFileInputField('fileInputContainer', false);
});

$('body').on('click', '#clearCompanyImage', function () {
    isCompanyImageCleared = true;
    clearCompanyImageField('fileInputContainer', false);
});

$('body').on('change', '#file-input-exhibitor', function() {
    console.log('input change exhibitor image');
    if (!imageIploadValidation(this)) {
        readImageUrlExhibitor(this);
    }
});

var registerForm = $('#registrationForm');

ajaxForm(registerForm, {
    success: function (data) {
        if (!data.error) {
            clearFormData($('#registrationForm'));
            $.fancybox.close();
            if (data.redirect != undefined) {
                window.location.href = data.redirect;
                return;
            }
            notificationAlerts.confirmNotif(data.message);
        }
    },
    error: function () {
    }
});

$('.datepicker').datepicker({format: 'dd-mm-yyyy'});

var amountOfUploadedFiles = $('#uploadedDocumentsAmount');
var fileUploadSelector = $('#document-fileupload');
var filesContainer = $('#files');
var dropZoneContainer = $('.drop-zone');
var userId = $('#userId').val();

if(fileUploadSelector.length) {
    fileUploadSelector.fileupload({
        maxChunkSize: 50000000,
        maxNumberOfFiles: 1,
        url: '/registration/exhibitor/documents-upload',
        dataType: 'json',
        autoUpload : false,
        add: function (e, data) {

            var isError = false;
            var acceptFileTypes = /^application\/(pdf|msword|doc|docx|vnd.openxmlformats-officedocument.wordprocessingml.document)/i;
            var acceptImagesFileTypes = /^image\/(jpe?g|png)$/i;

            if (!acceptFileTypes.test(data.originalFiles[0]['type']) && !acceptImagesFileTypes.test(data.originalFiles[0]['type'])) {
                isError = true;
                notificationAlerts.confirmNotificationError({'body' : Translator.trans('front:profile:exhibitor:upload:file:constraint:msg') });
            }
            if (acceptFileTypes.test(data.originalFiles[0]['type']) && data.originalFiles[0]['size'] > 50000000) {
                isError = true;
                notificationAlerts.confirmNotificationError({'body' : Translator.trans('front:profile:exhibitor:upload:file:constraint:msg')});
            }

            if (acceptImagesFileTypes.test(data.originalFiles[0]['type']) && data.originalFiles[0]['size'] > 50000000) {
                isError = true;
                notificationAlerts.confirmNotificationError({'body' : Translator.trans('front:profile:exhibitor:upload:file:constraint:msg')});
            }

            if($('.page-registration').hasClass('inactiveLink')) {
                isError = true;
                notificationAlerts.confirmNotificationError({'body' : Translator.trans('front:profile:exhibitor:upload:file:constraint:pending:msg')});
            }

            if (!isError) {
                data.submit();
            }
        },

        done: function (e, data) {
            if (!data.result.error) {
                filesContainer.append('<li><span class="doc-name">' + data.result.file.docName + '</span><span class="remove" id="' + data.result.file.id + '"></span></li>');
                countUploadedFiles('add');
            }
        },
        dropZone: dropZoneContainer,
        progressall: function (e, data) {
        }

    }).bind('fileuploadsubmit', function (e, data) {
        data.formData = {
            userId: userId
        }
    });
}

$('body').on('click', '.remove', function () {
    deleteUploadedFile($(this).attr('id'));
});

function deleteUploadedFile(fileId) {
    $.post('/registration/exhibitor/document-delete', {'id': fileId}).done(function () {
        $('#' + fileId).parent('li').remove();
        countUploadedFiles('sub');
    });
}

function countUploadedFiles(operationType) {
    var currentFilesAmount = parseInt(amountOfUploadedFiles.text());

    switch (operationType) {
        case 'add':
            var newValueOfFiles = currentFilesAmount + 1;
            break;
        case 'sub':
            var newValueOfFiles = currentFilesAmount - 1;
            break;
    }
    amountOfUploadedFiles.text(newValueOfFiles);
};

var panelIsOpen = false;
$('body').on('click', '#toggle_navigation', function () {

    if (panelIsOpen) {
        $("#navagation_panel").removeClass('exhibitor-panel-open').addClass('exhibitor-panel-close');
        $(".navigation-button").removeClass('closed');

        panelIsOpen = false;
    } else {
        $("#navagation_panel").removeClass('exhibitor-panel-close').addClass('exhibitor-panel-open');
        $(".navigation-button").addClass('closed');

        panelIsOpen = true;
    }
});

$(document).bind('dragover', function (e) {

    var dropElement = $(e.target);

    if(!$('.page-registration').hasClass('inactiveLink')) {
        return true
    }

    e.preventDefault();

    return false;

}).bind('drop', function (e) {
    var dropElement = $(e.target);

    if(!$('.page-registration').hasClass('inactiveLink')) {
        return true
    }

    e.preventDefault();

    return false;
});

