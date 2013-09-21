/* another tooltip plugin - works with svg elements and can generate text dynamically
/ requires jQuery
/ written 9/20/2013
*/
(function($) {

    $.fn.tooltip = function(options) {

        // $this refers to the elem the plugin was called on
        // options:
        // content: string, html, or function that returns string/html. Func executes
        // in the context of the element the tooltip is called on and/or takes an arg
        // that is the element
        var $this = this,
            settings = $.extend({
                content: 'Default text'
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
                }, wrapperPos: {
                    top: $wrapper.offset().top,
                    left: $wrapper.offset().left
                }
            };
        };

        function isTooltipVisible() {
            var pos = getPositions();

            return (pos.wrapperPos.top + pos.tooltipSize.height) < pos.winSize.bottom
                && (pos.wrapperPos.left + pos.tooltipSize.width) < pos.winSize.width
                && pos.wrapperPos.top > pos.winSize.top;
        };

        function reposition(mousePos, elemWidth) {
            var pos = getPositions();

            if ((pos.wrapperPos.top + pos.tooltipSize.height) > pos.winSize.top) {
                $wrapper.css({
                    top: mousePos.y + 15
                });
            }

            // need to handle reposition for left and right
            if ((pos.wrapperPos.left + pos.tooltipSize.width) < pos.winSize.width) {
                $wrapper.css({
                    left: (mousePos.x + (elemWidth / 2)) - ($wrapper.outerWidth() / 2)
                });
            }

        };

        // make sure the plugin returns 'this' for chaining
        return $this.each(function() {

            function getTooltipText() {
                if ($.type(settings.content) != 'function') {
                    return settings.content;
                } else {
                    return settings.content.call(this, this);
                }
            };

            $(this).on('mouseenter', debounce(function(e) {
                var pos = {
                        x: e.pageX,
                        y: e.pageY
                    },
                    elemWidth = $(this).width() || parseInt($(this).attr('width'));

                $wrapper.html(getTooltipText.call(this))
                    .css({
                        position: 'absolute',
                        top: pos.y - ($wrapper.outerHeight() + 15),
                        left: (pos.x + (elemWidth / 2)) - ($wrapper.outerWidth() / 2)
                    })
                    .show();

                if (!isTooltipVisible()) {
                    reposition(pos, elemWidth);
                }
            }, 100));

            $(this).on('mouseleave', debounce(function(e) {
                $wrapper.html('').hide();
            }, 100));

        });

    };

})(jQuery);
