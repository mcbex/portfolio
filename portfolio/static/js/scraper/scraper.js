/* data vis module for viewing trends in scraped markup
* requires D3
*/

function MarkupVisualizer(config) {
    var self = this;

    _.each(config, function(val, key) {
        self[key] = val;
    });

    this.init();
};

MarkupVisualizer.prototype.logger = function(msg) {
    return console && console.log(msg);
};

// init is noop by default
MarkupVisualizer.prototype.init = function() {};

MarkupVisualizer.prototype.render = function() {
    // if no chart type is specified use the default

    if (this.chartType) {
        this[this.chartType]();
    } else {
        this.defaultChart();
    }
};

MarkupVisualizer.prototype._parseProp = function(data, prop) {
    var test = /\./.test(prop),
        props;

    if (test) {
        props = prop.split('.');

        for (var i = 0; i < props.length; i++) {
            if (data[props[i]]) {
                data = data[props[i]];
            } else {
                data = undefined;
            }
        }
    } else {
        data = data[prop];
    }

    return data;
};

MarkupVisualizer.prototype.appendTitle = function() {
    this.selection.append('div')
        .attr('class', 'chart-title')
        .text(this.title);
MarkupVisualizer.prototype.pluck = function(data, prop) {
    var len = data.length,
        plucked = [];

    for (var i = 0; i < len; i++) {
        plucked.push(data[i][prop]);
    }

    return plucked;
};

MarkupVisualizer.prototype.getMaxValue = function() {
    var self = this;

    return d3.max(this.data, function(d) {
        return +self._parseProp(d, self.dataProps.value);
    });
};

MarkupVisualizer.prototype.getLinearScale = function(minRange, maxRange) {
    return d3.scale.linear()
        .range([minRange, maxRange])
        .domain([0, this.getMaxValue()]);
};

MarkupVisualizer.prototype.getOrdinalScale = function(minRange, maxRange) {
    return d3.scale.ordinal()
        .rangeBands([minRange, maxRange])
        .domain(d3.range(0, this.data.length));
};

MarkupVisualizer.prototype.getAxis = function(scale, orient, labels) {
    var axis = d3.svg.axis()
        .scale(scale)
        .orient(orient);

    if (labels) {
        axis.tickValues(labels);
    }

    return axis;
};

MarkupVisualizer.prototype.horizontalBar = function() {
    var self = this, height = 320,
        containerWidth, barWidth, scale,
        textx, texty;

    containerWidth = parseInt(d3.select(this.elem).style('width'));
    barWidth = Math.floor(containerWidth / this.data.length);

    scale = d3.scale.linear()
        .range([5, height - 50])
        .domain([0, d3.max(this.data, function(d) {
            return +self._parseProp(d, self.dataProps.value);
        })]);

    this.selection = d3.select(this.elem).append('svg')
        .attr('class', 'horizontalbar-chart')
        .attr('width', '100%')
        .attr('height', height)
        .append('g')

    this.selection.selectAll('.bar')
        .data(this.data).enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', barWidth + 'px')
        .attr('height', function(d, i) {
            return scale(self._parseProp(d, self.dataProps.value));
        })
        .attr('x', function(d, i) {
            return i * barWidth;
        })
        .attr('y', function(d) {
            return height - scale(self._parseProp(d, self.dataProps.value));
        });

    this.selection.selectAll('text')
        .data(this.data).enter()
        .append('text')
        .attr('x', function(d, i) {
            return i * barWidth;
        })
        .attr('y', function(d) {
            return height - scale(self._parseProp(d, self.dataProps.value));
        })
        .attr('transform', function(d, i) { 
            textx = i * barWidth;
            texty = height - scale(self._parseProp(d, self.dataProps.value));
            return 'rotate(-90,' + textx + ',' + texty + ')'
        })
        .attr('dx', 5)
        .attr('dy', (barWidth / 2) + 1)
        .text(function(d) {
            return self._parseProp(d, self.dataProps.name);
        });

    this.appendTitle();
};

MarkupVisualizer.prototype.defaultChart = function() {
    var self = this;

    this.selection = d3.select(this.elem).append('div')
        .attr('class', 'default-chart');

    this.selection.selectAll('div')
        .data(this.data).enter()
        .append('p').style('width', function(d) {
            return (self._parseProp(d, self.dataProps.value) * 10) + 'px';
        }).text(function(d) {
            return self._parseProp(d, self.dataProps.name)
                + ' (' + self._parseProp(d, self.dataProps.value) + ')';
        });

    this.appendTitle();
};

