/**
 * Resize-functions for map based on screen-resolutions
 **/

$('#map').css.height = ($(window).height() - 50);
$('#map').css("height", ($(window).height()) - 50);
$(window).on("resize", resize);
resize();

/**
 * Resize-functions for
 **/
function resize(){
    $('#map').css("height", ($(window).height() - 50));
}
