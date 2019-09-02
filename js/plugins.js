// init Namespace
var Wedding = Wedding || {};


// module namespace
Wedding.UIComponents = function( customSetting ) {

	// overwrite default settings
	let settings = $.extend( {
		tabletBreakpoint: 1199,
		mobileBreakpoint: 767,
		tablet: false,
		mobile: false
	},
	customSetting || {});

	// vars
	var self = this;

	// check tablet
	if( $( window ).width() <= settings.tabletBreakpoint && $( window ).width() > settings.mobileBreakpoint ) {

		// mobile view
		settings.tablet = true;
	}

	// check mobile
	if( $( window ).width() <= settings.mobileBreakpoint ) {

		// mobile view
		settings.mobile = true;
	}

	// PROTOTYPE
	// text limiter prototype
	$.fn.textLimiter = function( options ) {

		// var
		var localvar = $.extend({
			selector : this,
			textLength : 100
		}, options || {});

		// text
		var txt = $( localvar.selector ).html();
		txt = txt.trim();

		// limit text replace with '...'
		if ( txt.length > localvar.textLength ) {

			$( localvar.selector ).html( txt.substring( 0 , options.textLength ) + '...' );

		}

		// chain
		return this;
	}

	$.fn.smartResize = function( fn ) {
		return fn ? this.bind('resize', debounce(fn)) : this.trigger(smartResize);
	}

	$.fn.smartScroll = function( fn ) {
		return fn ? this.bind( 'scroll touchmove', debounce(fn)) : this.trigger(smartScroll);
	}

	this.init = function() {

		// initMakeImageCover();

		initSmoothScroll();

		initSlick();

		initCountdown();

		initHeader();

		initParallax();

		initSmartScroll();

		toggleAudio();

		wishlistInit();

		registerSW();
	}

	const registerSW = function() {

		if ('serviceWorker' in navigator) {

			$( window ).load( function() {
				navigator.serviceWorker.register('/wedding/sw.js');
			})
		}
	}

	const wishlistInit = function() {

		$.get( "https://script.googleusercontent.com/macros/echo?user_content_key=pppqj35xpZB0mox3yCTPUnaQMT8wyhtXAyT4UdcMRASBw2DzStxff4WAW1zqJ8KRnCVe4tUDWs-49YA4LInOvu8bB8_wJgUwm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnCdVHXKp37B0_z-iKuT124wlBs1DJBKz4QD_bZHp3VX3yV9wKcYJOhmGTOj1JS0QgzOmbnRGq-tk&lib=MtRbYBAOqXXx00eRfF8jUXE8jPqgvzQIJ", function( data ) {

	}).always( function(data) {
		// console.log( data.user.length );
		const user = data.user;

		for ( let i = 0; i < data.user.length; i++ ) {

			$( '.wishlist .item' ).each( function( e ){

				if ( $( this ).find( '.title h2' ).text() == data.user[i].barang ) {

					// change card state to terkabulkan
					$( this ).addClass( 'granted')
					.append( '<div class="granted-by"></div>' )
					.find( '.links a' ).text( 'terkabulkan');

					// crawl IG page for IG user and normal text for non IG user
					if ( data.user[i].users.indexOf('@') < 0 ) {
						$( this ).find( '.granted-by' ).append( '<div class="text">'+ data.user[i].users +'</div>');
					} else {
						const trimStr = data.user[i].users.replace(/\s+/g, '');
						const arrayUsers = trimStr.split( ',' );
						for( let j = 0; j < arrayUsers.length; j++ ) {
							getIG( arrayUsers[j], $( this ) );
						}
					}
				}
			})
		}
	});

	// crawl IG data
	function getIG( user, el ) {

			const userClean = user.substr(1);
			const hdUrl = '';
			const igURL = 'https://www.instagram.com/'+userClean+'/';

			$.get(igURL, function(data){

			}).always( function( data){
				// crawl img hd
				const start = data.indexOf('"profile_pic_url_hd":"');
				const end = data.indexOf( '.jpg","requested_by_viewer"');
				hdUrl = data.substring(start + 22, end + 4);
				$( el ).find( '.granted-by' ).append( '<a href="'+ igURL +'" target="_blank" ><img src="'+ hdUrl +'" title="'+ userClean +'"/></a>' );
			})
	}
}

this.reInitFunction = function() {

	$( '.masonry' ).masonry( 'destroy' );
	const $mason = $( '.masonry' ).masonry({
		itemSelector: '.card-wrap',
		columWidth: '.card-sizer',
		percentPosition: true,
		gutter: '.gutter-sizer',
		transitionDuration: '0.8s',
		horizontalOrder: true
	})
	$mason.masonry('layout');

	initNiceSelect();
}

// toggle audio
const toggleAudio = function() {

	// check
	if ( $( 'audio' ).length ) {

		// disable on mobile
		if ( $( window ).width() <= 767 ) {
			// alert( $( window ).width());
			$( 'audio,.sound-toggle' ).remove();

			return false;
		}

		// console.log( 'lel' );
		var play = true;

		$( '.sound-toggle' ).on( 'click', function(){

			// console.log( $( 'audio' ).attr( muted ) );
			if ( !play ) {
				$( 'audio' )[0].play();
				play = true;
				$( '.sound-toggle' ).removeClass( 'disable');
			} else {
				$( 'audio' )[0].pause();
				play = false;
				$( '.sound-toggle' ).addClass( 'disable');
			}
		})
	}
}

const initParallax = function() {
	var w = $(window).width();
	var h = $(window).height();

	if ( $("section").hasClass("parallax") ) {
		$( '.parallax' ).each( function(i, e) {

			Createparallaxbg(e);
		})
	}

	$(window).on( 'scroll touchmove', function() {

		if ( $("section").hasClass("parallax") ) {

			$( '.parallax' ).each( function(i, e) {
				parallaxbg(e, e);
			})

		}
	});

	// Parallax Background Image ATTR ADD
	function parallaxbg(position, parallaxImage) {
		var currentTop = $(window).scrollTop();
		var ParSecPT = $(position).position().top;
		if (currentTop > (ParSecPT - h)) {

			$(parallaxImage).css({
				"background-position": "center " + ((currentTop - ParSecPT) / 2 - (h / 5)) + "px"
			});

		}
	}

	// Parallax Background Image Create
	function Createparallaxbg(parallaxImage) {
		var ParSecImg = $(parallaxImage).attr("data-image");
		$(parallaxImage).attr("style", "background-image:url(" + ParSecImg + ");");
	}


}

const initHeader = function() {

	if ( $( 'header').length ) {
		$( document ).scrollTop() > 40 ? $( 'header' ).addClass( 'minimize' ) : '';
	}
}

const initCountdown = function() {

	const valueCss = 'font-size: 25px;' +
	'font-family: "Raleway", sans-serif;' +
	'color: #ababab;' +
	'text-transform: uppercase';

	$('.counter-init').ClassyCountdown({

		theme: "flat-colors",

		// end time
		end: new Date("2018-08-26T01:00:00.000Z").getTime(),
		now: $.now(),

		// whether to display the days/hours/minutes/seconds labels.
		labels: true,

		// object that specifies different language phrases for says/hours/minutes/seconds as well as specific CSS styles.
		labelsOptions: {
			lang: {
				days: 'Days',
				hours: 'Hours',
				minutes: 'Minutes',
				seconds: 'Seconds'
			},
			style: 'font-size: 20px;font-family: "Playfair Display", sans-serif;color: #ababab'
		},

		// custom style for the countdown
		style: {
			element: '',
			labels: false,
			days: {
				gauge: {
					thickness: 0.2,
					bgColor: 'rgba( 244,244,244,1)',
					fgColor: '#F1A9A0'
				},
				textCSS: valueCss
			},
			hours: {
				gauge: {
					thickness: 0.2,
					bgColor: 'rgba( 244,244,244,1)',
					fgColor: '#F1A9A0'
				},
				textCSS: valueCss
			},
			minutes: {
				gauge: {
					thickness: 0.2,
					bgColor: 'rgba( 244,244,244,1)',
					fgColor: '#F1A9A0'
				},
				textCSS: valueCss
			},
			seconds: {
				gauge: {
					thickness: 0.2,
					bgColor: 'rgba( 244,244,244,1)',
					fgColor: '#F1A9A0'
				},
				textCSS: valueCss
			}
		},

		// callback that is fired when the countdown reaches 0.
		onEndCallback: function() {}

	});
}

// slick initiate helper
function SlickHelper( elements ) {

	$( elements ).slick({
		dots: false,
		infinite: true,
		lazyLoad: 'ondemand',
		arrows: false,
		speed: 1000,
		fade: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000
	})
}

// method to initialize slick js
const initSlick = function() {

	// check homepage card
	if ( $( '.home' ).length ) {

		if ( !settings.tablet || !settings.mobile ) {

			// console.log( 'test');

			!$( '.home .slider-component' ).hasClass( 'slick-initialized' ) ? SlickHelper( '.home .slider-component' ) : '';

		} else {

			$( '.home .slider-component' ).hasClass( 'slick-initialized' ) ? $( '.home .slider-component' ).slick( 'unslick' ) : '';
		}
	}
}

// method to initialize mobile menu
const initMobileTrigger = function() {

	if ( $( '.mobile-trigger' ).length ) {

		// attach burger event
		function triggerMobileMainMenu() {

			$( '.mobile-trigger' ).unbind( 'click' );

			// attach event
			$( '.mobile-trigger' ).on( 'click', function() {

				// reset search
				$( '.minimize-search-wrap' ).hasClass( 'opened' ) ? $( '.close-search' ).trigger( 'click' ) : '';

				// toggle state
				if ( this.className == 'mobile-trigger opened' ) {

					this.className = 'mobile-trigger closed'
					$( 'ul.nav' ).stop().fadeOut();
				} else {
					this.className = 'mobile-trigger opened';
					$( 'ul.nav' ).stop().fadeIn();
				}
			})
		}

		// attach arrow event
		function triggerMobileArrow() {

			$( 'ul.nav' ).unbind( 'click' );

			// attach event
			$( 'ul.nav' ).on( 'click', '.arrow', function() {

				// if this list is not opened
				if ( !$( this ).hasClass( 'opened' ) ) {

					const _parent = $( this ).parent().siblings();

					// console.log( 'helow');

					// close other opened siblings list
					_parent.children( '.second-menu,ul' ).slideUp( );
					_parent.find( '.opened' ).removeClass( 'opened' );

					// then open this list
					$( this ).addClass( 'opened').siblings( '.second-menu,ul' ).slideDown( );

				} else {

					// close this list
					$( this ).removeClass( 'opened').siblings( '.second-menu,ul' ).slideUp( );

				}
			})

		}

		function triggerMethod() {

			const el = $( '.nav .nav-item' );

			// unbind hover from desktop
			el.unbind( 'mouseenter mouseleave' );

			// attach event to trigger main menu
			triggerMobileMainMenu();

			// attach event to trigger arrow inside main menu
			triggerMobileArrow();

			// console.log( settings.tablet );
			// console.log( settings.mobile );
		}

		settings.tablet || settings.mobile ? triggerMethod() : '';

		// outside click
		$( document ).on( 'click', function( e ) {

			if ( !$( '.nav-menu').find( '.mobile-trigger' ).is(e.target) && $( '.nav-menu').find( '.mobile-trigger' ).has(e.target).length === 0 && !$( '.nav-menu').find( 'ul.nav' ).is(e.target) && $( '.nav-menu').find( 'ul.nav' ).has(e.target).length === 0 ) {
				$( '.mobile-trigger' ).hasClass( 'opened') ? $( '.mobile-trigger' ).trigger( 'click' ) : '';
			}
		})
	}
}

// method to re-init function when browser is resized
const initSmartResize = function(){

	// on resize or drag
	$( window ).smartResize( function(){

		$( window ).width() <= settings.tabletBreakpoint ? settings.tablet = true : settings.tablet = false;
		// check mobile
		$( window ).width() <= settings.mobileBreakpoint ? settings.mobile = true : settings.mobile = false;

		initMinimizeHeader();

		initSlick();

	});
}

const initSmartScroll = function() {

	$( window ).smartScroll( function() {

		initMinimizeHeader();
	})
}

// method to resize font
// dependency: js/vendor/rv-jquery-fontsize plugin
const initFontResizer = function() {

	// if element exist
	if( $( 'body' ).length !== 0) {

		// call plugin
		$.rvFontsize({
			targetSection: 'html',
			store: false,
			controllers: {}
		});
	}
};

// method to initialize lazyload plugin
// dependency lazyload.js
const initLazyLoad = function() {

	// check
	if ( $( '.lazy' ).length !== 0 ) {

		// if not the award section just trigger the lazy load
		$( 'img.lazy' ).lazyload({

			// option
			threshold : 100,
			effect : 'fadeIn'
		});
	}
}

const initMakeImageCover = function() {

	// check
	if ( $('.img-wrap').length ) {

		$( window ).load( function() {

			$('.img-wrap .lazy').each( function() {

				var parent = $( this ).parent();

				$( this ).imagesLoaded( function( elem, options) {
					var cont = parent.width(),
					img = elem.elements[0].width;

					img < cont ? parent.addClass( 'portrait') : parent.addClass( 'landscape');
				})
			});
		})

	}
}

// method to set header class on scroll
const initMinimizeHeader = function() {

	if ( !settings.tablet ) {

		// toggle class
		$( 'header, .to-top, main' ).toggleClass( 'minimize', $( document ).scrollTop() > 40 );
	}

	if ( !settings.tablet && !settings.mobile ) {

		$( '.to-top' ).removeAttr( 'style' );

	} else {

		$( '.to-top' ).hide();

	}
}

const initSmoothScroll = function() {

	// go top
	if( $( '.to-top' ).length !== 0 ) {

		$( '.to-top' ).smoothScroll({

			offset: -300,
			speed : 500,
			easing: "swing"
		});
	}

	// go top
	if( $( '.nav-menu' ).length !== 0 ) {

		$( '.nav-menu li a' ).smoothScroll({

			offset: -66,
			speed : 300,
			easing: "swing"
		});
	}
}

const initMasonry = function() {

	if ( $( '.masonry' ).length ) {

		const $mason = $( '.masonry' ).masonry({
			itemSelector: '.card-wrap',
			columWidth: '.card-sizer',
			percentPosition: true,
			gutter: '.gutter-sizer',
			transitionDuration: '0.8s',
			horizontalOrder: true
		})

		$mason.imagesLoaded().progress( function() {
			$mason.masonry('layout');
		})
	}
}

// method to initialize audio player
// dependency vendor/jquery.nice-select
const initNiceSelect = function() {;
	// check
	if($('select').length !== 0) {
		$('select').niceSelect();
	}
}

const initNiceScroll = function() {

	// check
	if ( $( 'body' ).length ) {

		$( 'body' ).niceScroll({
			cursorcolor:"#00F"
		})
	}
}

// debouncing function from John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
const debounce = function (func, threshold, execAsap) {
	let timeout;

	return function debounced () {
		let obj = this, args = arguments;
		function delayed () {
			if (!execAsap)
			func.apply(obj, args);
			timeout = null;
		};

		if (timeout)
		clearTimeout(timeout);
		else if (execAsap)
		func.apply(obj, args);

		timeout = setTimeout(delayed, threshold || 150);
	};
};

}

Wedding.MapInteraction = function( customSetting ) {

	var settings = $.extend({

		MapKey : 'AIzaSyDqG408wlPZ832I5zRMmBZoJKTMqIJZ0fQ'

	}, customSetting || {});

	this.init = function() {

		initMap();

	}

	// method to init map, load marker with data from json
	// change default marker icon to custom and attach event to it
	var initMap = function() {

		CustomMarker.prototype = new google.maps.OverlayView();

		function CustomMarker(opts) {
			this.setValues(opts);
		}

		// Prototype draw
		// To create custom marker using html
		CustomMarker.prototype.draw = function() {
			var self = this,
			div = this.div;
			// console.log( self );
			var str = this.title.split(' ').join('');
			if (!div) {
				div = this.div = $('' +
				'<div class="'+ str +'">' +
				'<div class="shadow"></div>' +
				'<div class="pulse"></div>' +
				'<div class="pin-wrap">' +
				'<div class="pin"></div>' +
				'<div class="pin-label">'+ this.title +'</div>' +
				'</div>' +
				'</div>' +
				'')[0];
				this.pinLabel = this.div.getElementsByClassName('pin-label');
				this.pinWrap = this.div.getElementsByClassName('pin-wrap');
				this.pin = this.div.getElementsByClassName('pin');
				this.pinShadow = this.div.getElementsByClassName('shadow');
				div.style.position = 'absolute';
				div.style.cursor = 'pointer';
				var panes = this.getPanes();
				panes.overlayImage.appendChild(div);
				this.pinLabel.innerHTML = this.title;
				// console.log( this.pinLabel );
				google.maps.event.addDomListener(div, "click", function(event) {
					google.maps.event.trigger(self, "click", event);
				});

				google.maps.event.addListener(marker, 'click', function() {
          window.open("https://goo.gl/maps/4eyojYhPLGB2", "_blank")
     		});
			}
			var point = this.getProjection().fromLatLngToDivPixel(this.position);
			if (point) {
				div.style.left = point.x + 'px';
				div.style.top = point.y + 'px';
			}
		};

		// Create the map
		// Change the map style a bit
		var map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -6.5976283, lng: 106.8271297},
			zoom: 15,
			clickableIcons: false,
			mapTypeControl: false,
			styles: [
				{
					elementType: 'geometry',
					stylers: [{color: '#e7eaf5'}]
				},
				{
					elementType: 'labels.icon',
					stylers: [{visibility: 'on'},{"saturation": "-100"},{"lightness": "41"}]
				},
				{
					elementType: 'labels.text.fill',
					stylers: [{color: '#616161'}]
				},
				{
					elementType: 'labels.text.stroke',
					stylers: [{color: '#f5f5f5'}]
				},
				{
					featureType: 'administrative.land_parcel',
					elementType: 'labels.text.fill',
					stylers: [{color: '#bdbdbd'}]
				},
				{
					featureType: 'poi',
					elementType: 'geometry',
					stylers: [{color: '#dbdee9'},{visibility: 'off'}]
				},
				{
					featureType: 'poi',
					elementType: 'labels.text.fill',
					stylers: [{color: '#757575'}]
				},
				{
					featureType: 'poi.park',
					elementType: 'geometry',
					stylers: [{color: '#d4d7e2'}]
				},
				{
					featureType: 'poi.park',
					elementType: 'labels.text.fill',
					stylers: [{color: '#9e9e9e'}]
				},
				{
					featureType: 'road',
					elementType: 'geometry',
					stylers: [{color: '#ffffff'}]
				},
				{
					featureType: 'road.arterial',
					elementType: 'labels.text.fill',
					stylers: [{color: '#757575'}]
				},
				{
					featureType: 'road.highway',
					elementType: 'geometry',
					stylers: [{color: '#ffffff'}]
				},
				{
					featureType: 'road.highway',
					elementType: 'labels.text.fill',
					stylers: [{color: '#616161'}]
				},
				{
					featureType: 'road.local',
					elementType: 'labels.text.fill',
					stylers: [{color: '#9e9e9e'}]
				},
				{
					featureType: 'transit.line',
					elementType: 'geometry',
					stylers: [{color: '#e5e5e5'}]
				},
				{
					featureType: 'transit.station',
					elementType: 'geometry',
					stylers: [{color: '#dbdee9 '}]
				},
				{
					featureType: 'water',
					elementType: 'geometry',
					stylers: [{color: '#c2c5d0'}]
				},
				{
					featureType: 'water',
					elementType: 'labels.text.fill',
					stylers: [{color: '#9e9e9e'}]
				}
			]
		});

		var defualtLatlng = new google.maps.LatLng(-6.597362, 106.829345);
		var marker =  new CustomMarker({
			position: defualtLatlng,
			map: map,
			title: 'Bogor Lakeside View'
		});
	}
}
