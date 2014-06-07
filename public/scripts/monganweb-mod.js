(function ($) {
    var origImgWidth;
    /* Resize the background to fit the screen */
    function imgResizr () {
        var winWidth = $(window).outerWidth(),
            $daImage = $('.singleBG .absImg'),
            imageGrew = false;
        if (winWidth >= origImgWidth) {
            $daImage.css({
                'width': winWidth
            });
            imageGrew = true;
        } else if (imageGrew && winWidth <= origImgWidth) {
            $daImage.css({
                'width': origImgWidth
            }); imageGrew = false;
        }
    }
    /* Initialize everything */
    function init () {
        /* Parallax plugin */
        $('.mwWrap').parallaxScroller({
            'parallaxIntensity':9,
            'singleBG':true
        });
        /* Trigger custom event to fire off the section scroll events */
        $(window)
            .on('scroll.mw', function () {
                $('.section').trigger('winscroll');
            })
            .on('resize', imgResizr);
        /* Set initial bg image size */
        $('html').on('parallaxLoaded', function () {
            origImgWidth = $('.singleBG .absImg').outerWidth();
            imgResizr();
        });
    }
    init();
})(jQuery);