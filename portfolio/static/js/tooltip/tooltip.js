/* another tooltip plugin - works with svg elements and can generate text dynamically
/ requires jQuery
/ written 9/20/2013
*/
(function($) {

    $.fn.tooltip = function(options) {

        // $this refers to the elem/collection the plugin was called on
        // options:
        // content: string, html, or function that returns string/html. Func executes
        // in the context of the element the tooltip is called on and/or takes an arg
        // that is the element
        // padding: space between arrow and mouse pointer
        var $this = this,
            settings = $.extend({
                content: 'Default text',
                padding: 20
            }, options),
            $wrapper = $('<div class="tooltip">');

        $wrapper.appendTo('body').hide();

        // http://remysharp.com/2010/07/21/throttling-function-calls/
        function debounce(func, delay) {
            var timer;

            return function() {
                var self = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function(){
                    func.apply(self, args)
                }, delay);
            };
        };

        function getPositions() {
            return {
                winSize: {
                    width: $(window).width(),
                    top: $(window).scrollTop(),
                    bottom: $(window).scrollTop() + $(window).height()
                }, tooltipSize: {
                    width: $wrapper.outerWidth(),
                    height: $wrapper.outerHeight()
                }
            };
        };

        function setTooltipPosition(mousePos) {
            var pos = getPositions();

            // put below cursor
            if ((mousePos.y - pos.tooltipSize.height) < pos.winSize.top) {
                $wrapper.css({
                    top: mousePos.y + settings.padding,
                    left: mousePos.x - (pos.tooltipSize.width / 2)
                }).addClass('tooltip-top');
            }

            // reposition left of cursor
            else if ((mousePos.x + pos.tooltipSize.width) > pos.winSize.width) {
                $wrapper.css({
                    top: mousePos.y - (pos.tooltipSize.height/ 2),
                    left: (mousePos.x - pos.tooltipSize.width) - settings.padding
                }).addClass('tooltip-right');
            }

            //reposition right of cursor
            else if ((mousePos.x - pos.tooltipSize.width) < 0) {
                $wrapper.css({
                    top: mousePos.y - (pos.tooltipSize.height/ 2),
                    left: mousePos.x + settings.padding
                }).addClass('tooltip-left');
            }

            // position above cursor
            else {
                $wrapper.css({
                    top: mousePos.y - (pos.tooltipSize.height + settings.padding),
                   left: mousePos.x - (pos.tooltipSize.width / 2)
                }).addClass('tooltip-bottom');
            }

        };

        function getTooltipText() {
            if ($.type(settings.content) != 'function') {
                return settings.content;
            } else {
                return settings.content.call(this, this);
            }
        };

        // make sure the plugin returns 'this' for chaining
        return $this.each(function() {

            $(this).on('mouseenter', debounce(function(e) {
                // check this for browser compatibility
                var pos = {
                        x: e.pageX,
                        y: e.pageY
                    };

                $wrapper.html(getTooltipText.call(this))
                    .removeClass('tooltip-left tooltip-right tooltip-top '
                        + 'tooltip-bottom');

                setTooltipPosition(pos);

                $wrapper.show();

            }, 50));

            $(this).on('mouseleave', debounce(function(e) {
                $wrapper.html('').hide();
            }, 50));

        });

    };

})(jQuery);
