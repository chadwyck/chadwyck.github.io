
$(document).ready(function(e) {
    $(".col").on("mousedown", function(e) {
        var x = e.pageX;
        var y = e.pageY;
        var clickY = y - $(this).offset().top;
        var clickX = x - $(this).offset().left;
        var box = this;

        var setX = parseInt(clickX);
        var setY = parseInt(clickY);

        $(this).find("svg").remove();

        $(this).append('<svg><g><circle class="circ-expand" cx="'+setX+'" cy="'+setY+'" r="'+1+'"></circle></g></svg>');
    });

    $('body').jKit({ 
            'plugins': {
                date: { 'path': "plugins/datepicker/js/datepicker.js", 'fn': 'DatePicker' },
                hint: { 'path': "plugins/jquery.ztinputhint-1.2.js", 'fn': 'ztInputHint' },
                maxlength: { 'path': "plugins/maxlength/jquery.maxlength-min.js", 'fn': 'maxlength' },
                confirm: { 'path': "plugins/jquery.confirm-1.3.js", 'fn': 'confirm' }
            },
            'replacements': {
                'encode': specialEncodeCommand
            }
        });
});


    function specialEncodeCommand(that, type, options){

        var s = this.settings; // we don't need this one, but I'll leave it here so you know how to get the plugin settings in case you need them
        var $that = $(that);

        this.executeCommand(that, type, options); // execute the original command

        // now add some additional functionality:

        if (options.format == 'uppercase'){
            $that.html($that.html().toUpperCase());
        }

    }