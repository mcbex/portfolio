(function() {

    // do ajax call in demo, then create a visualizer instance for each data set
    function fetchData(id) {
        var url = 'http://' + document.location.host + '/services/scraper/' + id;

        return $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json'
        });
    };

    function makeDefaultChart(data) {
        return new MarkupVisualizer({
            title: 'Default',
            data: data.science2013,
            elem: '#demo-container',
            dataProps: {
                name: 'topic',
                value: 'tags.length'
            }
        });
    };

    function makePerTermCharts(data) {
        var visualizers = _.map(data.science2013, function(d) {
            return new MarkupVisualizer({
                title: d.topic,
                data: d.tags,
                elem: '#demo-container',
                chartType: 'horizontalBar',
                dataProps: {
                    name: 'name',
                    value: 'count'
                }
            });
        });

        return visualizers;
    };

    window.onload = function(e) {
        var visualizer;

        fetchData('science2013').then(function(resp) {
            visualizer = makePerTermCharts(resp);

            if (!visualizer.length) {
                visualizer.render();
            } else {
                _.each(visualizer, function(v) {
                    v.render();
                });
            }
        }, function(resp) {
            console && console.log(resp);
        });
    };

})();
