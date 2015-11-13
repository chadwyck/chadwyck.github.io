;(function ($, window, document, undefined) {
    
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

        fastestTime: 2000
    };

    function Plugin(container, userOptions) {
        var $container = $(container);
        var options = $.extend(true, {}, defaultOptions, userOptions);

        var rotateInterval;
        var currentSpriteStage = options.startingSpriteStage;

        (function _initialize() {
            options.tiltRange = Math.min(Math.abs(options.tiltRange), 90);

            $container.css({
                'background-image': 'url(' + options.imageUrl + ')',
                'background-position': '0 0'
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
        })();

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
            var time = ((options.tiltRange - Math.abs(gamma)) / options.tiltRange) * options.rotateTime;
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
            if (Math.abs(event.gamma) >= options.tiltRange) {
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
            //$('#console').val(text);
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

    debugger;
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);

$(function() {
                    setTimeout(function(){
                        debugger;
                    var widget = $('#tilter').view360Widget({
                        imageUrl: 'http://chadwickjones.com/thebes.png',
                        steps: 36,
                        startingSpriteStage: 0,
                        displayMode: 'fill',
                        rotateMode: 'with-device',
                        rotateTime: 6000,
                        autoRotateDir: 'ltr'
                    }).data('view360Widget');
                    }, 5000);
                });