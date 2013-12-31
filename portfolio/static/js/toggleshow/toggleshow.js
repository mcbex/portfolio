(function($) {

    var $this, images, settings;

    _bindClicks = function(container) {
        if (settings.mapContainers) {
            $(container).on('click', 'img.toggleshow-image', function(e) {
                $(this).siblings('.toggleshow-inner').toggle();
                $(this).siblings('.toggleshow-image').toggle();

                $(this).toggle();
                e.stopPropagation();
            });
        } else {
            $(container).on('click', 'img.toggleshow-image', function(e) {
                $(this).siblings().toggle();

                $(this).toggle();
                e.stopPropagation();
            });
        }
    };

    _hasChildren = function(container) {
        if (settings.mapContainers) {
            return $(container).children('.toggleshow-inner').length;
        } else {
            return $(container).children().length;
        }
    };

    _setUpWrappers = function() {
        var $bigWrappers = $this,
            $smallWrappers = $this.children('div'),
            $main;

        if (settings.mapContainers) {
            $bigWrappers = $([]);
            $smallWrappers = $([]);

            $.each(settings.mapContainers, function(i, s) {
                if ($this.is(s.main)) {
                    $main = $this;
                } else {
                    $main = $this.find(s.main);
                }

                if (s.largeIcon) {
                    $bigWrappers = $bigWrappers.add($main);
                } else {
                    $main.addClass('toggleshow-small');
                    $smallWrappers = $smallWrappers.add($main);
                }
                $.each(s.inner, function(i, m) {
                    $main.children(m).addClass('toggleshow-inner');
                });
            });
        } else {
            $.each($smallWrappers, function(i, s) {
                $(s).addClass('toggleshow-small');
            });
        }

        return {
            containers: $bigWrappers,
            children: $smallWrappers
        };
    };

    _setWrapperState = function() {
        var wrappers = _setUpWrappers(),
            $wrappers = wrappers.containers.add(wrappers.children),
            $wrapper;

        $.each($wrappers, function(i, w) {
            $wrapper = $(w);
            $wrapper.addClass('toggleshow-wrapper');

            if (_hasChildren($wrapper)) {

                if ($wrapper.hasClass('toggleshow-small')) {
                    $wrapper.prepend(images.childrenOn, images.childrenOff);
                } else {
                    $wrapper.prepend(images.containerOn, images.containerOff);
                }

                if (settings.mapContainers) {
                    $wrapper.find('.toggleshow-inner').hide();
                    $wrapper.children('.toggleshow-on').hide();
                } else {
                    $wrapper.children().not('.toggleshow-off').hide();
                }

                _bindClicks($wrapper);
            }
        });
    };

    _doToggleshow = function(visible) {
        var wrappers = $this.add($this.find('.toggleshow-wrapper'));

        $.each(wrappers, function(i, w) {

            if ($(w).find('.toggleshow-inner').length) {
                $(w).children('.toggleshow-inner').toggle(visible);
                $(w).children('img.toggleshow-on').toggle(visible);
                $(w).children('img.toggleshow-off').toggle(!visible);
            } else {
                $(w).children().toggle();
            }
        });
    };

    var methods = {

        _init: function(options) {
            // $this refers to the elem the plugin was called on
            // options:
            // mapContainers - array of config objects ie:
            // [{ main: 'string parent selector', inner: 'space delimited string of child selectors', largeIcon: bool }]
            $this = $(this),
            images = {
                containerOff: '<img class="toggleshow-image toggleshow-off" src="/static/js/toggleshow/images/chevron-right.png">',
                containerOn: '<img class="toggleshow-image toggleshow-on" src="/static/js/toggleshow/images/chevron-down.png">',
                childrenOff: '<img class="toggleshow-image toggleshow-off" src="/static/js/toggleshow/images/ios7-arrow-right.png">',
                childrenOn: '<img class="toggleshow-image toggleshow-on" src="/static/js/toggleshow/images/ios7-arrow-down.png">'
            },
            settings = $.extend({
                mapContainers: null
            }, options);

            if (settings.mapContainers) {
                $.each(settings.mapContainers, function(i, s) {
                    s.inner = [].concat(s.inner.split(' '));
                });
            }

            _setWrapperState();
        },

        expand: function() {
            $this = $(this);
            _doToggleshow(true);
        },

        contract: function() {
            $this = $(this);
            _doToggleshow(false);
        }

    };

    $.fn.toggleshow = function(args) {

        var method = arguments[0];

        if (methods[method]) {
            method = methods[method];
            args = Array.prototype.slice.call(arguments, 1);
        } else if (typeof args == 'object' || !args) {
            method = methods._init;
        } else {
            return this;
        }

        return this.each(function() {
            method.call(this, args);
        });

    };

})(jQuery);
