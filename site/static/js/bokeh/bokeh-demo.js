Zepto(function($){

    (function(){
        var paper = new Raphael('bokeh-canvas'),
            bokeh = new Bokeh(paper);

        bokeh.makeBokeh();
    })();

});
