Zepto(function($){

    var paper = new Raphael('bokeh-canvas'),
        bokeh = new Bokeh(paper);

    bokeh.makeBokeh();

    $('#bg-switcher').on('change', function(e){
        var darken = $(e.currentTarget).is(':checked');

        $('#bokeh-canvas').toggleClass('dark-background', darken);
    });

    $('#generate').on('click', function(){
        bokeh.makeBokeh();
    });

});
