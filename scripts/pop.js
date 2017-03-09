 $(document).ready(function(){
    $('.bp-popover').popover({
    html: true,
    trigger: "focus",
    placement: "bottom",
    content: "" + 
        '<div class="popover-header">'+
        '<button type="button" class="close popover-close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
        '<h4 class="popover-heading">google</h4>'+
        '</div>'+
        '<div class="popover-info">'+
        '<div class="row">'+
        '<div class="col-sm-3 block-collapse">'+
        '<div class="popover-img"><img src="images/google.png" alt="google-logo"></div>'+
        '</div>'+
        '<div class="col-sm-9">'+
        '<div class="popover-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="popover-footer">'+
        '<a href="#">www.google.com</a>'+		
        '</div>'
  });
/*  // close previously opened popovers by clicking outside them
  $(document).on('click', function(e) {
    $('a').each(function() {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });*/

});




