/* Temporary Iframe Generator           */
/* Author: Muhammad Bintang Adinandra   */
/* V 1.00                               */

$.fn.tempIframe = function(options){

    //setting up variable
    var _ = this;
    _.addClass('tempIframe');

    //set default property
    _.defaults = {
        playButton : true, //if you want play button
        alternateButton : '', //the class name for the desired play button
        autoplay: true, //autoplayer
        iframe_src : _.attr('data-url').replace("watch?v=", "v/"),
        youtube_video_id : _.attr('data-url').match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop()
    } || {};

    //overwrite defaults into settings property
    _.settings = $.extend({}, _.defaults , options);

    if ( _.defaults.youtube_video_id.length == 11 ) {
    	var backgroundimage = "//img.youtube.com/vi/" + _.settings.youtube_video_id + "/0.jpg";
    	_.css('background', "url('" + backgroundimage + "') no-repeat center");
    	_.css('background-size', 'cover');
    }

    if (_.settings.playButton){
        $('<div></div>', { class: "play-button" }).appendTo(this);
    }

    //autoplay settings
    var autoplay = '0';
    if (_.settings.autoplay) {
        autoplay = '1';
    }

    //iframe settings
    _.iframe = $('<iframe></iframe>',
                {
                    "class": "embed-responsive-item" ,
                    "src" : _.settings.iframe_src + "?rel=0&autoplay=" + autoplay,
                    "frameborder": 0,
                    "allowfullscreen" : ""
                } );;

    if (_.settings.alternateButton !== ''){
        $(_.settings.alternateButton).click(function(){
            $(_).append( _.iframe );
        })
    }

    //handler for the play button
    $( ' .play-button ' ).click(function(){
    	$(this).addClass('gone');
        $(this).parent().append(_.iframe);
    })

}
