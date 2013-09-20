// TODO write service that accepts svg and returns png

(function($){

    $(document).ready(function() {

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

})(jQuery);
