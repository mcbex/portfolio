/* data vis module for viewing trends in scraped markup
* requires D3
*/

// TODO namespace/encapsulate methods for each chart type

function MarkupVisualizer(config) {
    for (key in config) {
        this[key] = config[key];
    }

    if (!config.className) {
        this.className = 'chart-item';
    }

    this.containerWidth = parseInt(d3.select(this.elem).style('width'));

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

MarkupVisualizer.prototype._pluck = function(data, prop) {
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
// need to pass both range:arr and domain:arr
// need to use linear scale to sort data with duplicate values
MarkupVisualizer.prototype.getLinearScale = function(minRange, maxRange) {
    return d3.scale.linear()
        .range([minRange, maxRange])
        .domain([0, this.getMaxValue()]);
};

// need to pass both range:arr and domain:arr
// range = output values domain = input values
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

// sorts x axis by alphabetical order (ascending or descending)
MarkupVisualizer.prototype.sortByName = function(order, duration, delay) {
    var scale = this.getOrdinalScale(0, this.containerWidth - 50)
            .domain(this.data.sort(function(a, b) {
                return d3[order](a.name, b.name)
            })
            .map(function(d) {
                return d.name;
            }))
            .copy();

    this.chartItems.transition().duration(duration)
        .delay(function(d, i) { return i * delay; })
        .attr("x", function(d) { return scale(d.name); });
};

// TODO need to calculate paddings etc to get rid of 'magic numbers'
MarkupVisualizer.prototype.horizontalBar = function() {
    var self = this, height = this.maxHeight,
        containerWidth = this.containerWidth,
        scalex, scaley;

    scalex = this.getOrdinalScale(0, containerWidth - 50);
    scaley = this.getLinearScale(5, height - 75);

    // create svg and initial selection
    this.selection = d3.select(this.elem).append('svg')
        .attr('class', 'horizontalbar-chart')
        .attr('width', containerWidth)
        .attr('height', height)
        .append('g')
            .attr('transform', 'translate(40,-50)');

    // add data bars
    this.chartItems = this.selection.selectAll('g')
        .data(this.data).enter()
        .append('rect')
            .attr('class', this.className)
            .attr('data-visualizer', function(d) {
                return JSON.stringify(d);
            })
            .attr('width', Math.floor(scalex.rangeBand()) + 'px')
            .attr('height', function(d, i) {
                return scaley(self._parseProp(d, self.dataProps.value));
            })
            .attr('x', function(d, i) {
                return scalex(i);
            })
            .attr('y', function(d) {
                return height - scaley(self._parseProp(d, self.dataProps.value));
            });

    // add x axis
    this.selection.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(this.getAxis(scalex, 'bottom', this._pluck(this.data, 'name')))
        .selectAll('text')
            .style('text-anchor', 'end')
            .attr('transform', 'rotate(-65)')
            .attr('dx', '-0.25em')
            .attr('dy', '-0.15em');

    // add y axis
    this.selection.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(0,75)')
        .call(this.getAxis(this.getLinearScale(height - 75, 5), 'left'));

    // add chart labels
    this.selection.append('g')
        .attr('transform', 'translate(' + ((containerWidth / 2) - 50) + ','
            + (height + 50) + ')')
        .append('text')
            .style('text-anchor', 'middle')
            .text(this.title);

    // color bars
    if (this.dataProps.color) {
        this.chartItems
            .style('fill', function(d) {
                return d.color;
            });
    }
};

MarkupVisualizer.prototype.appendTitle = function() {
    this.selection.append('div')
        .attr('class', 'chart-title')
        .text(this.title);
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
