// init Namespace
var Lib = Lib || {};

// module namespace
Lib.PopupNotification = function( customSetting ) {

	// overwrite default settings
	var settings = $.extend( {

	}, 
	customSetting || {});

	this.success = function(text) {
		generateMessage('success', text);
		generateClikHandling();
		return false;
	}

	this.error = function(text) {
		generateMessage('error', text);
		generateClikHandling();
		return false;
	}

	this.warning = function(text, yesCallback, noCallback) {
		generateMessage('warning', text);
		generateClikHandlingWithCallback(yesCallback, noCallback);
		return false;
	}

	this.info = function(text) {
		generateMessage('info', text);
		generateClikHandling();
		return false;
	}

	var generateMessage = function(type, text) {
		var btnContent = '';
		if (type === "warning" ) {
			btnContent = 	'<a href="#" class="notification-btn submit-btn">OK</a><a href="#" class="notification-btn close-btn">CANCEL</a>';
		} else {
			btnContent = 	'<a href="#" class="notification-btn close-btn">OK</a>';
		}
		
		var message = 	'<section class="popup-notification">' +
							'<a href="#" class="close close-btn"></a>' +
							'<div class="notification '+ type +'">' +
								'<div class="notification-title">' + type.toUpperCase() + '</div>' +
								'<p>' + text + '</p>' +
								'<div class="btn-wrap">' + btnContent + '</div>' +
							'</div>' +
						'</section>';
		$( 'body' ).append('<div class="popup-wrapper">' + message + '</div>');
	}

	var generateClikHandling = function() {
		// check
		if ( $( '.popup-wrapper' ).length !== 0 ) {
			$( '.popup-wrapper' ).click( function(e) {
				e.preventDefault();
				if ( $( e.target ).closest('.popup-notification').length === 0 ) {
					$( this ).remove();
				}
			});
		}

		if ( $( '.popup-notification .close-btn' ).length !== 0 ) {
			$( '.popup-notification .close-btn' ).click( function(e) {
				e.preventDefault();
				$( this ).closest( '.popup-wrapper' ).remove();
			});
		}
	}

	var generateClikHandlingWithCallback = function(yesCallback, noCallback) {
		// check
		if ( $( '.popup-notification .close-btn' ).length !== 0 ) {
			$( '.popup-notification .close-btn' ).click( function(e) {
				e.preventDefault();
				$( this ).closest( '.popup-wrapper' ).remove();
				if ( noCallback !== undefined ) {
					noCallback();
				}
			});
		}
		if ( $( '.popup-notification .submit-btn' ).length !== 0 ) {
			$( '.popup-notification .submit-btn' ).click( function(e) {
				e.preventDefault();
				$( this ).closest( '.popup-wrapper' ).remove();
				if ( yesCallback !== undefined ) {
					yesCallback();
				}
			});
		}
	}
}