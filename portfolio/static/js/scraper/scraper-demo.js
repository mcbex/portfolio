(function() {

    // categories should be: page, text, header, table, format,
    // form, list, image, html5, deprecated, other
    // should old elems repurposed in html5 like b, u, em, strong be considered
    // deprecated? html5?
    var tagGroups = {
        a: 'text', abbr: 'text', acronym: 'deprecated', aside: 'html5',
        b: 'text', body: 'page', br: 'format', button: 'form',
        caption: 'table', center: 'deprecated', cite: 'text', code: 'text',
        d: 'image', dd: 'list', div: 'format', dl: 'list', dt: 'list',
        em: 'text', fieldset: 'form', font: 'deprecated', footer: 'html5',
        form: 'form', g: 'image', h1: 'header', h2: 'header', h3: 'header',
        h4: 'header', h5: 'header', head: 'page', header: 'html5', hr: 'format',
        html: 'page', i: 'text', iframe: 'format', img: 'image', input: 'form',
        label: 'form', li: 'list', link: 'page', meta: 'page', nav: 'html5',
        noscript: 'page', ol: 'list', optgroup: 'form', option: 'form',
        p: 'format', path: 'image', polygon: 'image', pre: 'text',
        rect: 'image', script: 'page', section: 'html5', select: 'form',
        small: 'text', span: 'format', string: 'text', style: 'page',
        sub: 'text', sup: 'text', svg: 'image', table: 'table', tbody: 'table',
        td: 'table', textarea: 'form', th: 'table', thead: 'table',
        title: 'page', tr: 'table', u: 'text', ul: 'list'
    };

    var tagGroupColors = {
        deprecated: 'olivedrab', form: '#333333', format: '#4D4D4D',
        header: '#666666', image: '#7F7F7F', list: '#999999', page: '#B3B3B3',
        table: '#CCCCCC', text: '#E5E5E5', html5: 'darkmagenta',
        undefined: 'black'
    };

    // do ajax call in demo, then create a visualizer instance for each data set
    function fetchData(id) {
        var url = 'http://' + document.location.host + '/services/scraper/' + id;

        return $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json'
        });
    };

    function getAllTags(data) {
        var tags = _.flatten(_.pluck(data, 'tags'), true);

        return _.uniq(_.pluck(tags, 'name'));
    };

    function addTagMetadata(data) {
        return _.map(data, function(d) {
                d.tags = _.map(d.tags, function(t) {
                    t.group = tagGroups[t.name.toLowerCase()];
                    t.color = tagGroupColors[t.group];
                    t.count = parseInt(t.count);

                    return t;
                });

            return d;
        });
    };

    function sortTagsBy(data, prop) {
        return _.map(data, function(d) {
            d.tags = _.sortBy(d.tags, prop);
            return d;
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
        var visualizers, tags;

        tags = addTagMetadata(data.science2013);
        tags = sortTagsBy(tags, 'count');
        tags = sortTagsBy(tags, 'group');

        visualizers = _.map(data.science2013, function(d) {
            return new MarkupVisualizer({
                title: d.topic,
                data: d.tags,
                elem: '#demo-container',
                chartType: 'horizontalBar',
                dataProps: {
                    name: 'name',
                    value: 'count',
                    group: 'group',
                    color: 'color'
                },
                className: 'bar',
                maxHeight: 350
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

            $('.bar').tooltip({
                content: function(elem) {
                    var data = $(elem).data('visualizer');

                    return '<p>name: ' + data.name + '</p>'
                        + '<p>group: ' + data.group + '</p>'
                        + '<p>count: ' + data.count + '</p>';
                }
            });
        }, function(resp) {
            console && console.log(resp);
        });
    };

})();
