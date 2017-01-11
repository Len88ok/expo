
$(document).ready(function(){
    $("#bp-popover").popover({
   content: function() {
		          return $('#popover-content1').html();
		        }
		});
		$('#google-popover').popover({
	    content: function() {
		          return $('#popover-content2').html();
		        }
		});
		$('#nike-popover').popover({
	    content: function() {
		          return $('#popover-content3').html();
		        }
		});
		$('#intel-popover').popover({
	    content: function() {
		          return $('#popover-content4').html();
		        }
		});
		$('#mts-popover').popover({
	    content: function() {
		          return $('#popover-content5').html();
		        }
		});
		$('#samsung-popover').popover({
	    content: function() {
		          return $('#popover-content6').html();
		        }
		});
		$('#skype-popover').popover({
	    content: function() {
		          return $('#popover-content7').html();
		        }
		});
		$('#pepsi-popover').popover({
	    content: function() {
		          return $('#popover-content8').html();
		        }
		});
		$('#yandex-popover').popover({
	    content: function() {
		          return $('#popover-content9').html();
		        }
		});
		$('#7up-popover').popover({
	    content: function() {
		          return $('#popover-content10').html();
		        }
		});
		$('#eclipse-popover').popover({
	    content: function() {
		          return $('#popover-content11').html();
		        }
		});
		$('#dell-popover').popover({
	    content: function() {
		          return $('#popover-content12').html();
		        }
		});
		$('#kharkov-popover').popover({
	    content: function() {
		          return $('#popover-content13').html();
		        }
		});
		$('#peppers-popover').popover({
	    content: function() {
		          return $('#popover-content14').html();
		        }
		});$('#lviv-popover').popover({
	    content: function() {
		          return $('#popover-content15').html();
		        }
		});
		$('#rate-popover').popover({
	    content: function() {
		          return $('#popover-content16').html();
		        }
		});
		$('#profi-popover').popover({
	    content: function() {
		          return $('#popover-content17').html();
		        }
		});
				$('#057-popover').popover({
	    content: function() {
		          return $('#popover-content18').html();
		        }
		});
           
    $(document).on("click", ".partners-img img, .partners-img-min img" , function(){ 
    	 $(".cover").fadeTo(500, 0.5).css('display', 'block');
    });

		$(document).on("click", ".popover .close" , function(){
        $(this).parents(".popover").popover('hide');
        $(".cover").hide();
    });

		$(document).mouseup(function (e){ 
		var div = $(".popover"); 
		if (!div.is(e.target) 
		    && div.has(e.target).length === 0) { 
			div.hide();
			$(".cover").hide();
		}
	});	
});





