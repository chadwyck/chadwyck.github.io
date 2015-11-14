var View360Widget = (function($, window, document, undefined) {

    'use strict';

    var pluginName = 'view360Widget';
    var defaultOptions = {
        imageUrl: '',
        steps: 0,
        startingSpriteStage: 0,
        spriteWidth: 0, // required if in 'fixed' displayMode
        displayMode: 'fill', // or 'fixed'
        rotateMode: 'with-device', // or 'tilt-motion' or 'auto'
        stopRotateThreshold: 5,
        rotateTime: 3000,
        autoRotateDir: 'ltr',
        tiltRange: 30,

        enableGoogleCardboard: false,

        fastestTime: 2000
    };

    function Plugin(container, userOptions) {
        var $container = $(container);
        var options = $.extend(true, {}, defaultOptions, userOptions);

        var rotateInterval;
        var currentSpriteStage = options.startingSpriteStage;

        var $cardboardIcon;
        var $cardboardOverlay, $cardboardOverlayMessage, $cardboardOverlayClose;
        var $cardboardImageLeft, $cardboardImageRight;
        var isInCardboardMode = false;

        (function _initialize() {
            options.tiltRange = Math.min(Math.abs(options.tiltRange), 90);

            $container.addClass('view360widget');
            $container.css({
                'background-image': 'url(' + options.imageUrl + ')',
            });

            switch (options.displayMode.toLowerCase()) {
                case 'fixed':
                    $container.css({
                        'width': options.spriteWidth,
                        'height': options.spriteWidth
                    });

                    break;
                case 'fill':
                default:
                    $container.css({
                        'background-size': 'auto 100%'
                    });

                    break;
            }

            if (options.enableGoogleCardboard) {
                _createCardboardIcon();
            }
        })();

        function _createCardboardIcon() {
            $cardboardIcon = $('<div>').attr({
                'class': 'view360widget-google-cardboard-icon'
            }).appendTo($container);

            $cardboardIcon.on('click', function(event) {
                event.preventDefault();



                if (!isInCardboardMode) {
                    isInCardboardMode = true;
                    _showCardboardModeOverlay();
                }
            });
        }

        function _createCardboardOverlayElements() {
            $cardboardOverlay = $('<div>').attr({
                'class': 'view360widget-overlay',
            }).appendTo(document);

            $cardboardOverlayMessage = $('<div>').attr({
                'class': 'view360widget-overlay-message',
            }).html(
                '<h1>Google Cardboard</h1>' +
                '<p>Google Cardboard is cool, and stuff.</p>'
            ).appendTo($cardboardOverlay);

            
        }

        function _showCardboardOverlay() {

        }

        function _hideCardboardOverlay() {

        }

        function _setSpriteStage(spriteStage) {
            spriteStage = spriteStage % options.steps;
            var containerWidth = $container.width();
            var spriteStagePosition = spriteStage * containerWidth;

            $container.css({
                'background-position': spriteStagePosition +'px 0'
            }); 
        }

        function _rotateWithDevice(alpha, beta, gamma) {
            var spriteStage = (Math.round(gamma / (options.tiltRange / options.steps)) + options.startingSpriteStage) % options.steps;
            _setSpriteStage(spriteStage);

            // log(
            //     'alpha: ' + alpha + '\n'
            //     + 'beta: ' + beta + '\n'
            //     + 'gamma: ' + gamma + '\n'
            //     + 'spriteStage: ' + spriteStage + '\n'
            //     + 'containerWidth: ' + containerWidth + '\n'
            //     + 'background-position-x: ' + spriteStagePosition + '\n'
            // );
        }

        function _tiltRotate(alpha, beta, gamma) {
            clearInterval(rotateInterval);

            if (Math.abs(gamma) <= options.stopRotateThreshold) 
                return;

            var dir = gamma >= 0 ? 'ltr' : 'rtl';
            var time = ((options.tiltRange - Math.abs(gamma)) / options.tiltRange) * options.rotateTime * 2;
            time = Math.max(time, options.fastestTime);

            log(time);

            _autoRotate(dir, time);
        }

        function _autoRotate(dir, time) {            
            clearInterval(rotateInterval);

            rotateInterval = setInterval(function() {
                if (dir !== 'ltr')
                    currentSpriteStage = (currentSpriteStage - 1) % options.steps;
                else
                    currentSpriteStage = (currentSpriteStage + 1) % options.steps;

                _setSpriteStage(currentSpriteStage);
            }, (time / options.steps));
        }

        // Attach events
        window.addEventListener('deviceorientation', function(event) {
            if (isInCardboardMode || Math.abs(event.gamma) >= options.tiltRange) {
                event.preventDefault();
                return;
            }

            switch (options.rotateMode.toLowerCase()) {
                case 'auto':
                    // handled already
                    break;
                case 'tilt-motion':
                    _tiltRotate(event.alpha, event.beta, event.gamma);
                    break;
                case 'with-device':
                default:
                    _rotateWithDevice(event.alpha, event.beta, event.gamma);
                    break;
            }

        }, false);

        if (options.rotateMode === 'auto') {
            _autoRotate(options.autoRotateDir, options.rotateTime);
        }

        // Temporary function
        function log(text) {
            $('#console').val(text);
        }

        // Public Methods
        this.setRotateMode = function(rotateMode) {  
            clearInterval(rotateInterval);
            options.rotateMode = rotateMode;

            switch (options.rotateMode.toLowerCase()) {
                case 'auto':
                    _autoRotate(options.autoRotateDir, options.rotateTime);
                    break;
                case 'tilt-motion':
                    _tiltRotate(0, 0, 0);
                    break;
                case 'with-device':
                default:
                    _rotateWithDevice(0, 0, 0);
                    break;
            }
        };
    }

    return {
        init: function(element, options) {
            var plugin = new Plugin(element, options)
            $(element).data(pluginName, plugin);
            return plugin;
        }
    };

})(jQuery, window, document);


$(function() {
    var widget = View360Widget.init($('#tilter'), {
        imageUrl: 'http://chadwickjones.com/thebes.png',
        steps: 36,
        startingSpriteStage: 0,
        displayMode: 'fill',
        rotateMode: 'with-device',
        rotateTime: 3000,
        autoRotateDir: 'ltr',

        enableGoogleCardboard: false
    });
});