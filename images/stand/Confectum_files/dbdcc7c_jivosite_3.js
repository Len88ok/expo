
function jivo_onLoadCallback(){

    window.jivo_cstm_widget = document.createElement('div');
    jivo_cstm_widget.setAttribute('id', 'jivo_custom_widget');
    document.body.appendChild(jivo_cstm_widget);

    jivo_cstm_widget.onclick = function(){
        jivo_api.open();
    }

    if (jivo_config.chat_mode == "online"){
        jivo_cstm_widget.setAttribute("class", "jivo_online");
    }

    window.jivo_cstm_widget.style.display='block';
}

function jivo_onOpen(){

    if (jivo_cstm_widget)
        jivo_cstm_widget.style.display = 'none';
}
function jivo_onClose(){

    if (jivo_cstm_widget)
        jivo_cstm_widget.style.display = 'block';
}