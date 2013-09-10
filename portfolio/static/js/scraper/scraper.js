/* data vis module for viewing trends in scraped markup
* requires jQuery/Zepto, D3
* updated 8/19/2013
*/

function MarkupVisualizer(data) {
    // different graph types?
    this.data = data;
};

MarkupVisualizer.prototype.logger = function(data) {
    console && console.log(data);
};

MarkupVisualizer.prototype.render = function(elem) {
    // pass a dom elem for the graph to be rendered into
};

