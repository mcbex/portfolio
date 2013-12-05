/* data vis module for viewing trends in scraped markup
* requires D3
*/

// TODO use _parse_prop instead of directly accessing properties
// TODO only use this.data to set up the initial chart - then manpulate data from
// chart items

// public methods: logger, init, render, getMaxValue, sortBy<x>

(function() {

    window.Visualizer = function(config) {

        for (key in config) {
            this[key] = config[key];
        }

        this.className = this.className || 'chart-item';
        this.maxHeight = this.maxHeight || 350;

        this.containerWidth = parseInt(d3.select(this.elem).style('width'));

        this.innerWidth = this.containerWidth - (this.containerWidth * 0.08);
        this.innerHeight = this.maxHeight - (this.maxHeight * 0.2);

        this.init();
    };

    Visualizer.prototype.logger = function(msg) {
        return console && console.log(msg);
    };

    // init is noop by default
    Visualizer.prototype.init = function() {};

    Visualizer.prototype._parseProp = function(data, prop) {
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

    Visualizer.prototype._pluck = function(data, prop) {
        var len = data.length,
            plucked = [];

        for (var i = 0; i < len; i++) {
            plucked.push(data[i][prop]);
        }

        return plucked;
    };

    Visualizer.prototype.getMaxValue = function() {
        var self = this;

        return d3.max(this.data, function(d) {
            return +self._parseProp(d, self.dataProps.value);
        });
    };
    // need to pass both range:arr and domain:arr
    // need to use linear scale to sort data with duplicate values
    Visualizer.prototype.getLinearScale = function(range, domain) {
        domain = domain || [0, this.getMaxValue()];

        return d3.scale.linear()
            .range(range)
            .domain(domain);
    };

    // need to pass both range:arr and domain:arr
    // range = output values domain = input values
    Visualizer.prototype.getOrdinalScale = function(range, domain) {
        domain = domain || d3.range(0, this.data.length);

        return d3.scale.ordinal()
            .rangeBands(range)
            .domain(domain);
    };

    Visualizer.prototype.getAxis = function(scale, orient, labels) {
        var axis = d3.svg.axis()
            .scale(scale)
            .orient(orient);

        if (labels) {
            axis.tickValues(labels);
        }

        return axis;
    };

    Visualizer.prototype.getTransition = function(duration, delay) {
        duration = duration || 1000;
        delay = delay || 50;

        return d3.transition()
            .duration(duration)
            .delay(function(d, i) { return i * delay; })
            .ease('linear');
    };

    Visualizer.prototype.doTransition = function(scale, callback, transition) {
        var self = this;

        transition.each(function() {
            self.chartItems.transition()
                .attr('x', callback);

            self.selection.select('.x-axis').transition()
                .call(self.getAxis(scale, 'bottom',
                    self._pluck(self.chartItems.data(), 'name')))
                .selectAll('text')
                    .style('text-anchor', 'end')
                    .attr('transform', 'rotate(-65)')
                    .attr('dx', '-0.25em')
                    .attr('dy', '-0.15em');
        });
    };

    // sorts x axis by alphabetical order
    Visualizer.prototype.sortByName = function(duration, delay, order) {
        var transition, scale, callback;

        transition = this.getTransition(duration, delay);
        scale = this.getOrdinalScale([0, this.innerWidth],
            this.chartItems.data().sort(function(a, b) {
                return d3[order](a.name, b.name)
            }).map(function(d) {
                return d.name;
            })
        ).copy();
        callback = function(d) { return scale(d.name) };

        this.doTransition(scale, callback, transition);
    };

    Visualizer.prototype.sortByValue = function(duration, delay) {
        var self = this, transition, scale, callback;

        transition = this.getTransition(duration, delay);
        scale = this.getOrdinalScale([0, this.innerWidth],
            this.chartItems.data().sort(function(a, b) {
                return b.count - a.count;
            }).map(function(d, i) {
                return d.name;
            })
        ).copy();
        callback = function(d) { return scale(d.name); };

        this.doTransition(scale, callback, transition);
    };

    Visualizer.prototype.restoreSort = function() {
        var transition, scale, callback;

        transition = this.getTransition();
        scale = this.getOrdinalScale([0, this.innerWidth]),
        callback = function(d, i) { return scale(i) };

        this.doTransition(scale, callback, transition);
    };

    // draw the chart and axis
    Visualizer.prototype.render = function() {
        var self = this, height = this.maxHeight,
            scalex, scaley;

        scalex = this.getOrdinalScale([0, this.innerWidth]);
        scaley = this.getLinearScale([5, this.innerHeight]);

        // create svg and initial selection
        this.selection = d3.select(this.elem).append('svg')
            .attr('class', 'horizontalbar-chart')
            .attr('width', this.containerWidth)
            .attr('height', height)
            .append('g')
                .attr('transform', 'translate(40, -50)');

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
            .attr('transform', 'translate(0, 75)')
            .call(this.getAxis(this.getLinearScale([this.innerHeight, 5]), 'left'));

        // add chart labels
        this.selection.append('g')
            .attr('transform', 'translate(' + (this.innerWidth / 2) + ','
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

})();
