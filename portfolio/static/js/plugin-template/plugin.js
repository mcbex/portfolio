(function($){

	$.fn.plugin = function(options){

		// $this refers to the elem the plugin was called on
		// options:
		var $this = this,
			settings = $.extend({
			}, options);

		// make sure the plugin returns 'this' for chaining
		return this.each(function(){

			// setup and bind events
			(function(){
			})();

		});

	};

})(jQuery);
