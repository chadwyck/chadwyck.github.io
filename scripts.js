
$("document").ready(function(e) {
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
});