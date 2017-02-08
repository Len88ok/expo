
$(document).ready(function(){
    $("#bp-popover").popover({
		 	html: true,   	
			trigger: "focus",
			content: function() {
		          return $('#popover-content1').html();
		        }
	});

	$('#google-popover').popover({
	 	html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content2').html();
	        }
	});
	$('#nike-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content3').html();
	        }
	});
	$('#intel-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content4').html();
	        }
	});
	$('#mts-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content5').html();
	        }
	});
	$('#samsung-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content6').html();
	        }
	});
	$('#skype-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content7').html();
	        }
	});
	$('#pepsi-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content8').html();
	        }
	});
	$('#yandex-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content9').html();
	        }
	});
	$('#7up-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content10').html();
	        }
	});
	$('#eclipse-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content11').html();
	        }
	});
	$('#dell-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content12').html();
	        }
	});
	$('#kharkov-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content13').html();
	        }
	});
	$('#peppers-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content14').html();
	        }
	});$('#lviv-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content15').html();
	        }
	});
	$('#rate-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content16').html();
	        }
	});
	$('#profi-popover').popover({
		html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content17').html();
	        }
	});
			$('#057-popover').popover({
				html: true,   	
		trigger: "focus",
    content: function() {
	          return $('#popover-content18').html();
	        }
	});

// $(document).on("click", ".partners-img img, .partners-img-min img" , function(){ 
//     	 $(".cover").show().fadeTo(500,.5);
//     });
});

$(document).ready(function($) {
	var on = 0;
	function load() {
		if(on == 0) {
			$(".cover").show().fadeTo(500,.5);
			on = 1;
		}
	}
	function off() {
		if(on == 1) {
			$(".cover").fadeOut("normal");
			on = 0;
		}
	}
	$(document).on("click", ".partners-img img, .partners-img-min img" , function(){ 
		load();
	});
	/* при клике на фоне HTML страницы, вне самого окна, окно закрывается */
	$(document).on("click", "div.cover" , function(){ 
		off();
	});
	/* закрыть окно при клике на блоке с классом "close"*/
	$(document).on("click", ".close" , function(){ 
		off();
	});
});





