/**
 * jQuery Store Scroll Offset
 *
 * @author:		Devin Smith (http://devin.la)
 * @date:		2012-04-21
 *
 * Stores the scrollleft and scroll top positions in cookies.
 * requires that each item has a unique id to track the scrolling.
 *
 * requires cookie plugin
 * https://github.com/carhartl/jquery-cookie
 *
 *
 * Usage:
 * $('.items').storeScrollOffset();
 *
 * License:
 * MIT & GPLv2
 *
 */

(function($){
	$.fn.storeScrollOffset = function (options) {
		var settings = $.extend({
			snap: null,						// will snap to the closest el on load
			timeout: 200,					// timeout to store. this prevents spaming on osx
			cookie: 'storeScrollOffset',	// cookie name
			padding: {left: 0, top: 0}	// extra padding in case its not lining up
		}, options || {});

		var self = {
			readCookie: function(el) {
				var cookie = self.cookie();
				return cookie && cookie[self.getId(el)] || null;
			},

			cookie: function() {
				return JSON.parse($.cookie(settings.cookie)) || {};
			},

			storeCookie: function(el, vals) {
				var cookie = self.cookie();
				cookie[self.getId(el)] = vals;
				$.cookie(settings.cookie, JSON.stringify(cookie));
			},

			getId: function(el) {
				return el.attr('id');
			},
			
			// thanks to Sagi @ http://stackoverflow.com/a/2337775/654970
			closestToOffset: function(els,parent,offset) {
				var el = null, elOffset, x = offset.left, y = offset.top, distance, dx, dy, minDistance, parentOffset = parent.offset();
				els.each(function() {
					elOffset = {
						left: $(this).offset().left-parentOffset.left,
						top: $(this).offset().top-parentOffset.top
					};
			
					if (
					(x >= elOffset.left)  && (x <= elOffset.right) &&
					(y >= elOffset.top)   && (y <= elOffset.bottom)
					) {
						el = $(this);
						return false;
					}
			
					var offsets = [[elOffset.left, elOffset.top], [elOffset.right, elOffset.top], [elOffset.left, elOffset.bottom], [elOffset.right, elOffset.bottom]];
					for (off in offsets) {
						dx = offsets[off][0] - x;
						dy = offsets[off][1] - y;
						distance = Math.sqrt((dx*dx) + (dy*dy));
						if (minDistance === undefined || distance < minDistance) {
							minDistance = distance;
							el = $(this);
						}
					}
				});
				return el;
			}
		};

		return this.each(function() {
			var pos = self.readCookie($(this));
			if (pos) {
				if (settings.snap) {
					var closest = self.closestToOffset($(this).find(settings.snap),$(this),pos);
					pos = {
						left: closest.offset().left-$(this).offset().left+settings.padding.left,
						top: closest.offset().top-$(this).offset().top+settings.padding.left,
					};
				}

				$(this).scrollLeft(pos.left);
				$(this).scrollTop(pos.top);
			}

			var timer;
			$(this).live('scroll', function() {
				clearTimeout(timer);
				var el = $(this);
				timer = setTimeout(function() {
					self.storeCookie(el, {left: el.scrollLeft(), top: el.scrollTop()});
				},settings.timeout);
			});
		});
	};
})(jQuery);