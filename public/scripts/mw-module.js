angular.module('MonWeb', [])
    .config(['$locationProvider', '$interpolateProvider', function ($locationProvider, $interpolateProvider) {
        'use strict';
        $locationProvider.html5Mode(false).hashPrefix('!');
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
    }])
    .factory('dataFactory', ['$http', function ($http) {
        'use strict';
        var touchDevice = ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)) ? true : false;
        function fetchSlides (url) {
            var promise = $http.get(url);
            return promise;
        }
        function getScrollData (element) {
            var $win = $(window),
                data = {
                    'sectionContent': element.find('.sectionContent'),
                    'screenTop': $win.scrollTop(),
                    'screenHeight': $win.height(),
                    'screenBottom': $win.scrollTop() + $win.height(),
                    'sectionTop': element.offset().top,
                    'sectionBottom': element.offset().top + element.outerHeight()
                };
            return data;
        }
        return {
            fetchSlides: fetchSlides,
            getScrollData: getScrollData,
            isTouch: touchDevice
        };
    }])
    .controller('MwCtrl', ['$scope', 'dataFactory', '$location', function ($scope, dataFactory, $location) {
        'use strict';
        /* Set defaults */
        var slideReq = dataFactory.fetchSlides('public/scripts/slides.json');
        slideReq.then(function (response) {
            $scope.slides.data = response.data;
            $scope.slides.length = response.data.length;
        });
        $scope.isTouch = dataFactory.isTouch;
        $scope.slides = {};
        $scope.slides.currentSlide = 0;
        $scope.menuVisible = false;
        $scope.modal = {};
        $scope.modal.shown = false;
        $scope.modal.hidden = true;
        $location.absoluteUrl = 'http://monganweb.com';
        /* Menu Functions */
        $scope.toggleMenu = function (e) {
            var $targ = $(e.target);
            if (($targ.is('.mwMenu') && $scope.menuVisible) || (!$targ.is('.mwMenuBtn') && !$scope.menuVisible)) {
                return false;
            }
            $scope.menuVisible = !$scope.menuVisible;
        };
        $scope.goToSection = function (target) {
            var targ = target.replace('/', ''),
                sectionTop = $('.section[data-title=' + targ + ']').offset().top;
            $location.path(targ);
            $('html, body, documentElement').animate({
                scrollTop: sectionTop
            }, 1000);
        };
        /* Portfolio Functions */
        $scope.slideConStyle = function () {
            return {
                width: (220 * $scope.slides.length) + 20,
                left: $scope.slides.currentSlide * -220
            };
        };
        $scope.changeSlide = function (direction) {
            if (direction === 'next') {
                $scope.slides.currentSlide++;
                if ($scope.slides.currentSlide >= $scope.slides.length) {
                    $scope.slides.currentSlide = 0;
                }
            } else if ( direction === 'back') {
                $scope.slides.currentSlide--;
                if ($scope.slides.currentSlide < 0) {
                    $scope.slides.currentSlide = $scope.slides.length - 1;
                }
            } else {
                return false;
            }
        };
        $scope.showModal = function (e) {
            var $targ = $(e.target),
                image = 'public/images/portfolio/' + $targ.attr('data-image'),
                link = $targ.attr('data-url') || null;
            $scope.modal.link = null;
            $scope.modal.shown = true;
            $scope.modal.hidden = false;
            $scope.modal.imageCss = {
                'background-image': 'url(' + image + ')'
            };
            $scope.modal.text = $targ.next('.mwSlideText').html();
            if (link) {
                $scope.modal.link = (link.search('m.') === -1) ? 'http://www.' + link : 'http://' + link;
            }
        };
        $scope.hideModal = function () {
            $scope.modal.hidden = 'hiding';
            setTimeout(function () {
                $scope.modal.shown = false;
                $scope.modal.hidden = true;
                $scope.modal.imageCss = {
                    'background-image': 'none'
                };
                $scope.modal.text = '';
                console.log($scope.modal);
                $scope.$apply();
            }, 300);
        };
        /* Initializer */
        function init () {
            if ($location.path()) {
                setTimeout(function () {
                    var target = $location.path().replace('/', '');
                    $scope.goToSection(target);
                }, 500);
            }
        }
        init();
    }])
    /* Directives for the section scroll effects */
    .directive('spinIn', ['dataFactory', function (dataFactory) {
        'use strict';
        var spin = {
            'restrict': 'A',
            link: function (scope, elem, attrs) {
                if (!dataFactory.isTouch && !$('html').hasClass('ie')) {
                    return elem.on('winscroll', function () {
                        var scrollData = dataFactory.getScrollData(elem),
                            diff = (scrollData.sectionTop - scrollData.screenTop) / 2;
                        if(scrollData.screenTop >= 23 && scrollData.screenTop < scrollData.sectionTop) {
                            scrollData.sectionContent.css({
                                'transform': 'rotate(' + diff + 'deg)',
                                '-webkit-transform': 'rotate(' + diff + 'deg)',
                                'opacity': 1 - (diff / 200),

                            });
                        } else {
                            scrollData.sectionContent.css({
                                'transform': 'rotate(0deg)',
                                '-webkit-transform': 'rotate(0deg)',
                                'opacity':1
                            });
                        }
                    });
                } else {
                    return false;
                }
            }
        };
        return spin;

    }])
    .directive('slideInLeft', ['dataFactory', function (dataFactory) {
        'use strict';
        var slide = {
            'restrict': 'A',
            link: function (scope, elem, attrs) {
                if (!dataFactory.isTouch && !$('html').hasClass('ie')) {
                    return elem.on('winscroll', function () {
                        var scrollData = dataFactory.getScrollData(elem),
                            diff = scrollData.sectionTop -scrollData. screenTop;
                        if (scrollData.screenTop < scrollData.sectionTop) {
                            scrollData.sectionContent.css({
                                'left': -diff * 5
                            });
                        } else scrollData.sectionContent.css({
                                'left': 0
                            });
                    });
                } else {
                    return false;
                }
            }
        };
        return slide;
    }])
    .directive('scaleUp', ['dataFactory', function (dataFactory) {
        'use strict';
        var scale = {
            'restrict': 'A',
            link: function (scope, elem, attrs) {
                if (!dataFactory.isTouch && !$('html').hasClass('ie')) {
                    return elem.on('winscroll', function () {
                        var scrollData = dataFactory.getScrollData(elem),
                            diff = -1 * (scrollData.sectionTop - scrollData.screenBottom) / scrollData.screenHeight;
                        if (scrollData.screenTop > 1595 && scrollData.screenTop < scrollData.sectionTop) {
                            scrollData.sectionContent.css({
                                'transform': 'scale(' + diff + ')',
                                '-webkit-transform': 'scale(' + diff + ')'
                            });
                        } else {
                            scrollData.sectionContent.css({
                                'transform': 'scale(1)',
                                '-webkit-transform': 'scale(1)'
                            });
                        }
                    });
                } else {
                    return false;
                }
            }
        };
        return scale;
    }])
    .directive('scrollOpposite', ['dataFactory', function (dataFactory) {
        'use strict';
        var opposite = {
            'restrict': 'A',
            link: function (scope, elem, attrs) {
                if (!dataFactory.isTouch && !$('html').hasClass('ie')) {
                    return elem.on('winscroll', function () {
                        var scrollData = dataFactory.getScrollData(elem),
                            fadeDiff = -1 * (scrollData.sectionTop - scrollData.screenBottom) / scrollData.screenHeight,
                            scrollDiff = (scrollData.sectionTop - scrollData.screenTop) * 2;
                            if (scrollData.screenTop < scrollData.sectionTop) {
                                scrollData.sectionContent.css({
                                    'opacity': fadeDiff,
                                    'bottom': scrollDiff
                                });
                            } else {
                                scrollData.sectionContent.css({
                                    'opacity': 1,
                                    'bottom': 0
                                });
                            }
                    });
                } else {
                    return false;
                }
            }
        };
        return opposite;
    }]);
