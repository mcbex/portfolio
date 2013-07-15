function Bokeh(paper){
    this.canvas = paper,
    this.width = paper.width,
    this.height = paper.height
};

Bokeh.prototype.randRange = function(max, min){
    return Math.random() * (max - min) + min;
};

Bokeh.prototype.randColor = function(){
    return '#' + Math.floor(Math.random()*16777215).toString(16);
};

Bokeh.prototype.generateCircles = function(){
    //create random circles
    var circles = [],
        numCircles = this.randRange(this.width * 0.05, this.width * 0.04),
        circle;

    for (var i = 0; i < Math.round(numCircles); i++){
        circle = {
            type : 'circle',
            r : this.randRange(this.height * 0.07, 5),
            cx : this.randRange(this.width - 50, 50),
            cy : this.randRange(this.height - 100, 100)
        }
        circles.push(circle)
    }

    return circles
};

Bokeh.prototype.drawCircles = function(){
    var paper = this.canvas,
        circles = this.generateCircles();

    this.circles = paper.add(circles);
};

Bokeh.prototype.addGlow = function(){
    var self = this;

    self.glow = this.canvas.set();

    _.each(this.circles, function(circle){
        self.glow.push(
            circle.glow({
                width : self.randRange(90, 0),
                fill : true,
                color : self.randColor(),
                opacity : self.randRange(0.9, 0.2)
            })
        );
    });
};

Bokeh.prototype.styleCircles = function(){
    var circles = this.circles;

    circles.attr({
        'stroke-opacity' : 0.0
    });

    this.addGlow();
};

Bokeh.prototype.animate = function(){
    this.circles.animate({transform: 't ' + Math.random() * 1000 + ',0'}, 5000)
    this.glow.animate({transform: 't ' + Math.random() * 1000 + ',0'}, 5000)
};

Bokeh.prototype.makeBokeh = function(){
    var circles = this.drawCircles();

    this.styleCircles();
//			this.animate();
};


