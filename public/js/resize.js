$('#map').css.height = ($(window).height() - 50);
$('#map').css("height", ($(window).height()) - 50);
$(window).on("resize", resize);
resize();

function resize(){
    $('#map').css("height", ($(window).height() - 50));
}
