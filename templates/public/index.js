$(document).ready(function() {
    hsize = $(window).height() - 40;
    $(".timeline-container").css("height", hsize + "px");
});

$(window).resize(function() {
    hsize = $(window).height() - 40;
    $(".timeline-container").css("height", hsize + "px");
});
