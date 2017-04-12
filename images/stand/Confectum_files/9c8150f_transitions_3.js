var pageScript;

jQuery(document).ready(function($){
	var isAnimating = false,
			firstLoad = false,
			newScaleValue = 1;

	var dashboard = $('.cd-side-navigation'),
			mainContent = $('.cd-main'),
			loadingBar = $('#cd-loading-bar');

	$(document).on('click', '.sliding_link', function(event){
		event.preventDefault();

		var target = $(this),
        sectionTarget = target.data('menu');
		pageScript = target.data('page_script');

        $('ul.left-nav li').each(function(){
            if($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
			if($(this).find('a').hasClass('selected')) {
				$(this).find('a').removeClass('selected');
			}
        });

		if(target.hasClass('showcase-link')) {
			$('ul.left-nav li').eq(3).addClass('active')
		} else {
			target.closest('li').addClass('active');
		}

		if( !target.hasClass('selected') && !isAnimating ) {
			triggerAnimation(sectionTarget, true);
		}

		firstLoad = true;
	});

	$(window).on('popstate', function() {
		if( firstLoad ) {
			var newPageArray = location.pathname.split('/'),
                newPage = newPageArray[newPageArray.length - 1].replace('.html', '');
			if( !isAnimating ) triggerAnimation(newPage, false);
		}
		firstLoad = true;
	});

	mainContent.on('click', '.cd-scroll', function(event){
		event.preventDefault();
		var scrollId = $(this.hash);
		$(scrollId).velocity('scroll', { container: $(".cd-section") }, 200);
	});

	function triggerAnimation(newSection, bool) {
		isAnimating =  true;
		newSection = ( newSection == '' ) ? 'index' : newSection;

		dashboard.find('*[data-menu="'+newSection+'"]').addClass('selected').parent('li').siblings('li').children('.selected').removeClass('selected');
		loadNewContent(newSection, bool);
	}

	function loadNewContent(newSection, bool) {
		setTimeout(function(){
			var scaleMax = loadingBar.data('scale');
            var type = getTransitionType(newSection);
            var section = $('<section class="'+ type +' overflow-hidden ' + newSection + '"></section>').appendTo(mainContent);

			section.load(newSection+' .' + type + '> *', function(event, status, xhr){
				if ( status == "error" ) {
					var msg = "Sorry but there was an error: ";
				}

                var scaleMax = loadingBar.data('scale');

				loadingBar.velocity('stop').velocity({
					scaleY: scaleMax
				}, 400, function(){
					if(pageScript) {
						$.getScript(pageScript, function (data, textStatus, jqxhr) {
						});
					}
					section.prev('.visible').removeClass('visible').end().addClass('visible').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
						resetAfterAnimation(section);
					});

					if( $('.no-csstransitions').length > 0 ) {
						resetAfterAnimation(section);
					}

					var url = newSection;

					if(url!=window.location && bool){
						window.history.pushState({path: url},'',url);
					}
					$(document).trigger('stand:load-new-content', [url]);
				});
			});


		}, 50);
	}

    function getTransitionType(newSection) {

        var type = '';
        if($.type(newSection) == 'string') {
            var route = newSection.split('/');
            type += route[route.length - 1] == 'showcase' ? 'cd-section-stand' : 'cd-section';
        } else {
            type += 'cd-section';
        }

        return type;

    }

	function loadingBarAnimation() {
		var scaleMax = loadingBar.data('scale');
		if( newScaleValue + 1 < scaleMax) {
			newScaleValue = newScaleValue + 1;
		} else if ( newScaleValue + 0.5 < scaleMax ) {
			newScaleValue = newScaleValue + 0.5;
		}

		loadingBar.velocity({
			scaleY: newScaleValue
		}, 100, loadingBarAnimation);
	}

	function resetAfterAnimation(newSection) {
		newSection.removeClass('overflow-hidden').prev('[class^="cd-section"]').remove();
		isAnimating =  false;
		resetLoadingBar();
	}

	function resetLoadingBar() {
		loadingBar.removeClass('loading').velocity({
			scaleY: 1
		}, 1);
	}
});