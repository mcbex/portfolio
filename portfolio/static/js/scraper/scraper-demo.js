(function() {

    // do ajax call in demo, then create a visualizer instance for each data set?
    // visualizer should accept data not make service calls

    var visualizers = [];

    window.onload = function(e) {
        var visualizer;

        $.ajax({
            url: 'http://' + document.location.host + '/services/scraper/science2013';
            type: 'GET',
            dataType: 'json',
            success: function(resp) {
                debugger;
            },
            error: function(resp) {
                console && console.log(resp);
            }
        });
    };

})();
