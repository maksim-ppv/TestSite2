
window.onload = function() {
    setTimeout(function(){
        let preloader = document.getElementById('cube-loader');
        
        if(!preloader.classList.contains('done')){
            preloader.classList.add('done');
        }
    }, 1000);
};;
const menu = document.querySelector('.menu');
const btn = document.querySelector('.menu-button');
const navbar = document.querySelector('.navbar');
const body = document.querySelector('body');



const modal = ()=>{

 
      menu.classList.toggle('show');
   btn.classList.toggle('line_active');
   body.classList.toggle('lock');

}

menu.addEventListener('click', event => {
   const target = event.target
   if(!target.closest('.menu')){
      modal();
   }
});
btn.addEventListener('click', modal);
;
/*! rangeslider.js - v2.3.0 | (c) 2016 @andreruffert | MIT license | https://github.com/andreruffert/rangeslider.js */
var rangeto = document.querySelector('.rangeto');
(function(factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    'use strict';

    // Polyfill Number.isNaN(value)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
    Number.isNaN = Number.isNaN || function(value) {
        return typeof value === 'number' && value !== value;
    };

    /**
     * Range feature detection
     * @return {Boolean}
     */
    function supportsRange() {
        var input = document.createElement('input');
        input.setAttribute('type', 'range');
        return input.type !== 'text';
    }

    var pluginName = 'rangeslider',
        pluginIdentifier = 0,
        hasInputRangeSupport = supportsRange(),
        defaults = {
            polyfill: true,
            orientation: 'horizontal',
            rangeClass: 'rangeslider',
            disabledClass: 'rangeslider--disabled',
            activeClass: 'rangeslider--active',
            horizontalClass: 'rangeslider--horizontal',
            verticalClass: 'rangeslider--vertical',
            fillClass: 'rangeslider__fill',
            handleClass: 'rangeslider__handle',
            startEvent: ['mousedown', 'touchstart', 'pointerdown'],
            moveEvent: ['mousemove', 'touchmove', 'pointermove'],
            endEvent: ['mouseup', 'touchend', 'pointerup']
        },
        constants = {
            orientation: {
                horizontal: {
                    dimension: 'width',
                    direction: 'left',
                    directionStyle: 'left',
                    coordinate: 'x'
                },
                vertical: {
                    dimension: 'height',
                    direction: 'top',
                    directionStyle: 'bottom',
                    coordinate: 'y'
                }
            }
        };

    /**
     * Delays a function for the given number of milliseconds, and then calls
     * it with the arguments supplied.
     *
     * @param  {Function} fn   [description]
     * @param  {Number}   wait [description]
     * @return {Function}
     */
    function delay(fn, wait) {
        var args = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function(){ return fn.apply(null, args); }, wait);
    }

    /**
     * Returns a debounced function that will make sure the given
     * function is not triggered too much.
     *
     * @param  {Function} fn Function to debounce.
     * @param  {Number}   debounceDuration OPTIONAL. The amount of time in milliseconds for which we will debounce the function. (defaults to 100ms)
     * @return {Function}
     */
    function debounce(fn, debounceDuration) {
        debounceDuration = debounceDuration || 100;
        return function() {
            if (!fn.debouncing) {
                var args = Array.prototype.slice.apply(arguments);
                fn.lastReturnVal = fn.apply(window, args);
                fn.debouncing = true;
            }
            clearTimeout(fn.debounceTimeout);
            fn.debounceTimeout = setTimeout(function(){
                fn.debouncing = false;
            }, debounceDuration);
            return fn.lastReturnVal;
        };
    }

    /**
     * Check if a `element` is visible in the DOM
     *
     * @param  {Element}  element
     * @return {Boolean}
     */
    function isHidden(element) {
        return (
            element && (
                element.offsetWidth === 0 ||
                element.offsetHeight === 0 ||
                // Also Consider native `<details>` elements.
                element.open === false
            )
        );
    }

    /**
     * Get hidden parentNodes of an `element`
     *
     * @param  {Element} element
     * @return {[type]}
     */
    function getHiddenParentNodes(element) {
        var parents = [],
            node    = element.parentNode;

        while (isHidden(node)) {
            parents.push(node);
            node = node.parentNode;
        }
        return parents;
    }

    /**
     * Returns dimensions for an element even if it is not visible in the DOM.
     *
     * @param  {Element} element
     * @param  {String}  key     (e.g. offsetWidth …)
     * @return {Number}
     */
    function getDimension(element, key) {
        var hiddenParentNodes       = getHiddenParentNodes(element),
            hiddenParentNodesLength = hiddenParentNodes.length,
            inlineStyle             = [],
            dimension               = element[key];

        // Used for native `<details>` elements
        function toggleOpenProperty(element) {
            if (typeof element.open !== 'undefined') {
                element.open = (element.open) ? false : true;
            }
        }

        if (hiddenParentNodesLength) {
            for (var i = 0; i < hiddenParentNodesLength; i++) {

                // Cache style attribute to restore it later.
                inlineStyle[i] = hiddenParentNodes[i].style.cssText;

                // visually hide
                if (hiddenParentNodes[i].style.setProperty) {
                    hiddenParentNodes[i].style.setProperty('display', 'block', 'important');
                } else {
                    hiddenParentNodes[i].style.cssText += ';display: block !important';
                }
                hiddenParentNodes[i].style.height = '0';
                hiddenParentNodes[i].style.overflow = 'hidden';
                hiddenParentNodes[i].style.visibility = 'hidden';
                toggleOpenProperty(hiddenParentNodes[i]);
            }

            // Update dimension
            dimension = element[key];

            for (var j = 0; j < hiddenParentNodesLength; j++) {

                // Restore the style attribute
                hiddenParentNodes[j].style.cssText = inlineStyle[j];
                toggleOpenProperty(hiddenParentNodes[j]);
            }
        }
        return dimension;
    }

    /**
     * Returns the parsed float or the default if it failed.
     *
     * @param  {String}  str
     * @param  {Number}  defaultValue
     * @return {Number}
     */
    function tryParseFloat(str, defaultValue) {
        var value = parseFloat(str);
        return Number.isNaN(value) ? defaultValue : value;
    }

    /**
     * Capitalize the first letter of string
     *
     * @param  {String} str
     * @return {String}
     */
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }

    /**
     * Plugin
     * @param {String} element
     * @param {Object} options
     */
    function Plugin(element, options) {
        this.$window            = $(window);
        this.$document          = $(document);
        this.$element           = $(element);
        this.options            = $.extend( {}, defaults, options );
        this.polyfill           = this.options.polyfill;
        this.orientation        = this.$element[0].getAttribute('data-orientation') || this.options.orientation;
        this.onInit             = this.options.onInit;
        this.onSlide            = this.options.onSlide;
        this.onSlideEnd         = this.options.onSlideEnd;
        this.DIMENSION          = constants.orientation[this.orientation].dimension;
        this.DIRECTION          = constants.orientation[this.orientation].direction;
        this.DIRECTION_STYLE    = constants.orientation[this.orientation].directionStyle;
        this.COORDINATE         = constants.orientation[this.orientation].coordinate;

        // Plugin should only be used as a polyfill
        if (this.polyfill) {
            // Input range support?
            if (hasInputRangeSupport) { return false; }
        }

        this.identifier = 'js-' + pluginName + '-' +(pluginIdentifier++);
        this.startEvent = this.options.startEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.moveEvent  = this.options.moveEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.endEvent   = this.options.endEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.toFixed    = (this.step + '').replace('.', '').length - 1;
        this.$fill      = $('<div class="' + this.options.fillClass + '" />');
        this.$handle    = $('<div class="' + this.options.handleClass + '" />');
        this.$range     = $('<div class="' + this.options.rangeClass + ' ' + this.options[this.orientation + 'Class'] + '" id="' + this.identifier + '" />').insertAfter(this.$element).prepend(this.$fill, this.$handle);
        // visually hide the input
        this.$element.css({
            'position': 'absolute',
            'width': '1px',
            'height': '1px',
            'overflow': 'hidden',
            'opacity': '0'
        });

        // Store context
        this.handleDown = $.proxy(this.handleDown, this);
        this.handleMove = $.proxy(this.handleMove, this);
        this.handleEnd  = $.proxy(this.handleEnd, this);

        this.init();

        // Attach Events
        var _this = this;
        this.$window.on('resize.' + this.identifier, debounce(function() {
            // Simulate resizeEnd event.
            delay(function() { _this.update(false, false); }, 300);
        }, 20));

        this.$document.on(this.startEvent, '#' + this.identifier + ':not(.' + this.options.disabledClass + ')', this.handleDown);

        // Listen to programmatic value changes
        this.$element.on('change.' + this.identifier, function(e, data) {
            if (data && data.origin === _this.identifier) {
                return;
            }

            var value = e.target.value,
                pos = _this.getPositionFromValue(value);
            _this.setPosition(pos);
        });
    }

    Plugin.prototype.init = function() {
        this.update(true, false);

        if (this.onInit && typeof this.onInit === 'function') {
            this.onInit();
        }
    };

    Plugin.prototype.update = function(updateAttributes, triggerSlide) {
        updateAttributes = updateAttributes || false;

        if (updateAttributes) {
            this.min    = tryParseFloat(this.$element[0].getAttribute('min'), 0);
            this.max    = tryParseFloat(this.$element[0].getAttribute('max'), 100);
            this.value  = tryParseFloat(this.$element[0].value, Math.round(this.min + (this.max-this.min)/2));
            this.step   = tryParseFloat(this.$element[0].getAttribute('step'), 1);
        }

        this.handleDimension    = getDimension(this.$handle[0], 'offset' + ucfirst(this.DIMENSION));
        this.rangeDimension     = getDimension(this.$range[0], 'offset' + ucfirst(this.DIMENSION));
        this.maxHandlePos       = this.rangeDimension - this.handleDimension;
        this.grabPos            = this.handleDimension / 2;
        this.position           = this.getPositionFromValue(this.value);

        // Consider disabled state
        if (this.$element[0].disabled) {
            this.$range.addClass(this.options.disabledClass);
        } else {
            this.$range.removeClass(this.options.disabledClass);
        }

        this.setPosition(this.position, triggerSlide);
    };

    Plugin.prototype.handleDown = function(e) {
        e.preventDefault();
        this.$document.on(this.moveEvent, this.handleMove);
        this.$document.on(this.endEvent, this.handleEnd);

        // add active class because Firefox is ignoring
        // the handle:active pseudo selector because of `e.preventDefault();`
        this.$range.addClass(this.options.activeClass);

        // If we click on the handle don't set the new position
        if ((' ' + e.target.className + ' ').replace(/[\n\t]/g, ' ').indexOf(this.options.handleClass) > -1) {
            return;
        }

        var pos         = this.getRelativePosition(e),
            rangePos    = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            handlePos   = this.getPositionFromNode(this.$handle[0]) - rangePos,
            setPos      = (this.orientation === 'vertical') ? (this.maxHandlePos - (pos - this.grabPos)) : (pos - this.grabPos);

        this.setPosition(setPos);

        if (pos >= handlePos && pos < handlePos + this.handleDimension) {
            this.grabPos = pos - handlePos;
        }
    };

    Plugin.prototype.handleMove = function(e) {
        e.preventDefault();
        var pos = this.getRelativePosition(e);
        var setPos = (this.orientation === 'vertical') ? (this.maxHandlePos - (pos - this.grabPos)) : (pos - this.grabPos);
        this.setPosition(setPos);
    };

    Plugin.prototype.handleEnd = function(e) {
        e.preventDefault();
        this.$document.off(this.moveEvent, this.handleMove);
        this.$document.off(this.endEvent, this.handleEnd);

        this.$range.removeClass(this.options.activeClass);

        // Ok we're done fire the change event
        this.$element.trigger('change', { origin: this.identifier });

        if (this.onSlideEnd && typeof this.onSlideEnd === 'function') {
            this.onSlideEnd(this.position, this.value);
        }
    };

    Plugin.prototype.cap = function(pos, min, max) {
        if (pos < min) { return min; }
        if (pos > max) { return max; }
        return pos;
    };

    Plugin.prototype.setPosition = function(pos, triggerSlide) {
        var value, newPos;
        if (triggerSlide === undefined) {
            triggerSlide = true;
        }

        // Snapping steps
        value = this.getValueFromPosition(this.cap(pos, 0, this.maxHandlePos));
        newPos = this.getPositionFromValue(value);

        // Update ui
        this.$fill[0].style[this.DIMENSION] = (newPos + this.grabPos) + 'px';
        this.$handle[0].style[this.DIRECTION_STYLE] = newPos + 'px';
        rangeto.style[this.DIRECTION_STYLE] = (newPos + this.grabPos) + 'px';
        this.setValue(value);
        // Update globals
        this.position = newPos;
        this.value = value;

        if (triggerSlide && this.onSlide && typeof this.onSlide === 'function') {
            this.onSlide(newPos, value);
        }
    };

    // Returns element position relative to the parent
    Plugin.prototype.getPositionFromNode = function(node) {
        var i = 0;
        while (node !== null) {
            i += node.offsetLeft;
            node = node.offsetParent;
        }
        return i;
    };

    Plugin.prototype.getRelativePosition = function(e) {
        // Get the offset DIRECTION relative to the viewport
        var ucCoordinate = ucfirst(this.COORDINATE),
            rangePos = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            pageCoordinate = 0;

        if (typeof e.originalEvent['client' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e.originalEvent['client' + ucCoordinate];
        }
        else if (
          e.originalEvent.touches &&
          e.originalEvent.touches[0] &&
          typeof e.originalEvent.touches[0]['client' + ucCoordinate] !== 'undefined'
        ) {
            pageCoordinate = e.originalEvent.touches[0]['client' + ucCoordinate];
        }
        else if(e.currentPoint && typeof e.currentPoint[this.COORDINATE] !== 'undefined') {
            pageCoordinate = e.currentPoint[this.COORDINATE];
        }

        return pageCoordinate - rangePos;
    };

    Plugin.prototype.getPositionFromValue = function(value) {
        var percentage, pos;
        percentage = (value - this.min)/(this.max - this.min);
        pos = (!Number.isNaN(percentage)) ? percentage * this.maxHandlePos : 0;
        return pos;
    };

    Plugin.prototype.getValueFromPosition = function(pos) {
        var percentage, value;
        percentage = ((pos) / (this.maxHandlePos || 1));
        value = this.step * Math.round(percentage * (this.max - this.min) / this.step) + this.min;
        return Number((value).toFixed(this.toFixed));
    };

    Plugin.prototype.setValue = function(value) {
        if (value === this.value && this.$element[0].value !== '') {
            return;
        }

        // Set the new value and fire the `input` event
        this.$element
            .val(value)
            .trigger('input', { origin: this.identifier });
    };

    Plugin.prototype.destroy = function() {
        this.$document.off('.' + this.identifier);
        this.$window.off('.' + this.identifier);

        this.$element
            .off('.' + this.identifier)
            .removeAttr('style')
            .removeData('plugin_' + pluginName);

        // Remove the generated markup
        if (this.$range && this.$range.length) {
            this.$range[0].parentNode.removeChild(this.$range[0]);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = $(this),
                data  = $this.data('plugin_' + pluginName);

            // Create a new instance.
            if (!data) {
                $this.data('plugin_' + pluginName, (data = new Plugin(this, options)));
            }

            // Make it possible to access methods from public.
            // e.g `$element.rangeslider('method');`
            if (typeof options === 'string') {
                data[options].apply(data, args);
            }
        });
    };

    return 'rangeslider.js is available in jQuery context e.g $(selector).rangeslider(options);';

}));
;
// Dynamic Adapt v.1
// HTML data-move="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-move="item,2,992"
// Andrikanych Yevhen 2020

var move_array = [];
var move_objects = document.querySelectorAll("[data-move]");

if (move_objects.length > 0) {
	for (var _index10 = 0; _index10 < move_objects.length; _index10++) {
		var _el6 = move_objects[_index10];

		var data_move = _el6.getAttribute("data-move");

		if (data_move != "" || data_move != null) {
			_el6.setAttribute("data-move-index", _index10);

			move_array[_index10] = {
				parent: _el6.parentNode,
				index: index_in_parent(_el6)
			};
		}
	}
}

function dynamic_adapt() {
	var w = document.querySelector("body").offsetWidth;

	if (move_objects.length > 0) {
		for (var _index11 = 0; _index11 < move_objects.length; _index11++) {
			var _el7 = move_objects[_index11];

			var _data_move = _el7.getAttribute("data-move");

			if (_data_move != "" || _data_move != null) {
				var data_array = _data_move.split(",");

				var data_parent = document.querySelector("." + data_array[0]);
				var data_index = data_array[1];
				var data_bp = data_array[2];

				if (w < data_bp) {
					if (!_el7.classList.contains("js-move_done_" + data_bp)) {
						if (data_index > 0) {
							//insertAfter
							var actual_index = index_of_elements(data_parent)[data_index];
							data_parent.insertBefore(_el7, data_parent.childNodes[actual_index]);
						} else {
							data_parent.insertBefore(_el7, data_parent.firstChild);
						}

						_el7.classList.add("js-move_done_" + data_bp);
					}
				} else {
					if (_el7.classList.contains("js-move_done_" + data_bp)) {
						dynamic_adaptive_back(_el7);

						_el7.classList.remove("js-move_done_" + data_bp);
					}
				}
			}
		}
	}

	custom_adapt(w);
}

function dynamic_adaptive_back(el) {
	var index_original = el.getAttribute("data-move-index");
	var move_place = move_array[index_original];
	var parent_place = move_place["parent"];
	var index_place = move_place["index"];

	if (index_place > 0) {
		//insertAfter
		var actual_index = index_of_elements(parent_place)[index_place];
		parent_place.insertBefore(el, parent_place.childNodes[actual_index]);
	} else {
		parent_place.insertBefore(el, parent_place.firstChild);
	}
}

function index_in_parent(node) {
	var children = node.parentNode.childNodes;
	var num = 0;

	for (var _i2 = 0; _i2 < children.length; _i2++) {
		if (children[_i2] == node) return num;
		if (children[_i2].nodeType == 1) num++;
	}

	return -1;
}

function index_of_elements(parent) {
	var children = [];

	for (var _i3 = 0; _i3 < parent.childNodes.length; _i3++) {
		if (parent.childNodes[_i3].nodeType == 1 && parent.childNodes[_i3].getAttribute("data-move") == null) {
			children.push(_i3);
		}
	}

	return children;
}

window.addEventListener("resize", function (event) {
	dynamic_adapt();
});
dynamic_adapt();

function custom_adapt(w) { };
! function (t, n) {
    "object" == typeof exports && "object" == typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define([], n) : "object" == typeof exports ? exports.Scrollbar = n() : t.Scrollbar = n()
}(this, (function () {
    return function (t) {
        var n = {};

        function e(r) {
            if (n[r]) return n[r].exports;
            var o = n[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return t[r].call(o.exports, o, o.exports, e), o.l = !0, o.exports
        }
        return e.m = t, e.c = n, e.d = function (t, n, r) {
            e.o(t, n) || Object.defineProperty(t, n, {
                enumerable: !0,
                get: r
            })
        }, e.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }, e.t = function (t, n) {
            if (1 & n && (t = e(t)), 8 & n) return t;
            if (4 & n && "object" == typeof t && t && t.__esModule) return t;
            var r = Object.create(null);
            if (e.r(r), Object.defineProperty(r, "default", {
                    enumerable: !0,
                    value: t
                }), 2 & n && "string" != typeof t)
                for (var o in t) e.d(r, o, function (n) {
                    return t[n]
                }.bind(null, o));
            return r
        }, e.n = function (t) {
            var n = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return e.d(n, "a", n), n
        }, e.o = function (t, n) {
            return Object.prototype.hasOwnProperty.call(t, n)
        }, e.p = "", e(e.s = 58)
    }([function (t, n, e) {
        var r = e(25)("wks"),
            o = e(16),
            i = e(2).Symbol,
            u = "function" == typeof i;
        (t.exports = function (t) {
            return r[t] || (r[t] = u && i[t] || (u ? i : o)("Symbol." + t))
        }).store = r
    }, function (t, n) {
        t.exports = function (t) {
            return "object" == typeof t ? null !== t : "function" == typeof t
        }
    }, function (t, n) {
        var e = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = e)
    }, function (t, n) {
        var e = t.exports = {
            version: "2.6.9"
        };
        "number" == typeof __e && (__e = e)
    }, function (t, n, e) {
        t.exports = !e(13)((function () {
            return 7 != Object.defineProperty({}, "a", {
                get: function () {
                    return 7
                }
            }).a
        }))
    }, function (t, n, e) {
        var r = e(2),
            o = e(3),
            i = e(11),
            u = e(6),
            c = e(10),
            s = function (t, n, e) {
                var a, f, l, p, h = t & s.F,
                    d = t & s.G,
                    v = t & s.S,
                    y = t & s.P,
                    m = t & s.B,
                    g = d ? r : v ? r[n] || (r[n] = {}) : (r[n] || {}).prototype,
                    b = d ? o : o[n] || (o[n] = {}),
                    x = b.prototype || (b.prototype = {});
                for (a in d && (e = n), e) l = ((f = !h && g && void 0 !== g[a]) ? g : e)[a], p = m && f ? c(l, r) : y && "function" == typeof l ? c(Function.call, l) : l, g && u(g, a, l, t & s.U), b[a] != l && i(b, a, p), y && x[a] != l && (x[a] = l)
            };
        r.core = o, s.F = 1, s.G = 2, s.S = 4, s.P = 8, s.B = 16, s.W = 32, s.U = 64, s.R = 128, t.exports = s
    }, function (t, n, e) {
        var r = e(2),
            o = e(11),
            i = e(9),
            u = e(16)("src"),
            c = e(60),
            s = ("" + c).split("toString");
        e(3).inspectSource = function (t) {
            return c.call(t)
        }, (t.exports = function (t, n, e, c) {
            var a = "function" == typeof e;
            a && (i(e, "name") || o(e, "name", n)), t[n] !== e && (a && (i(e, u) || o(e, u, t[n] ? "" + t[n] : s.join(String(n)))), t === r ? t[n] = e : c ? t[n] ? t[n] = e : o(t, n, e) : (delete t[n], o(t, n, e)))
        })(Function.prototype, "toString", (function () {
            return "function" == typeof this && this[u] || c.call(this)
        }))
    }, function (t, n, e) {
        var r = e(8),
            o = e(41),
            i = e(43),
            u = Object.defineProperty;
        n.f = e(4) ? Object.defineProperty : function (t, n, e) {
            if (r(t), n = i(n, !0), r(e), o) try {
                return u(t, n, e)
            } catch (t) {}
            if ("get" in e || "set" in e) throw TypeError("Accessors not supported!");
            return "value" in e && (t[n] = e.value), t
        }
    }, function (t, n, e) {
        var r = e(1);
        t.exports = function (t) {
            if (!r(t)) throw TypeError(t + " is not an object!");
            return t
        }
    }, function (t, n) {
        var e = {}.hasOwnProperty;
        t.exports = function (t, n) {
            return e.call(t, n)
        }
    }, function (t, n, e) {
        var r = e(44);
        t.exports = function (t, n, e) {
            if (r(t), void 0 === n) return t;
            switch (e) {
                case 1:
                    return function (e) {
                        return t.call(n, e)
                    };
                case 2:
                    return function (e, r) {
                        return t.call(n, e, r)
                    };
                case 3:
                    return function (e, r, o) {
                        return t.call(n, e, r, o)
                    }
            }
            return function () {
                return t.apply(n, arguments)
            }
        }
    }, function (t, n, e) {
        var r = e(7),
            o = e(17);
        t.exports = e(4) ? function (t, n, e) {
            return r.f(t, n, o(1, e))
        } : function (t, n, e) {
            return t[n] = e, t
        }
    }, function (t, n, e) {
        var r = e(1);
        t.exports = function (t, n) {
            if (!r(t) || t._t !== n) throw TypeError("Incompatible receiver, " + n + " required!");
            return t
        }
    }, function (t, n) {
        t.exports = function (t) {
            try {
                return !!t()
            } catch (t) {
                return !0
            }
        }
    }, function (t, n) {
        t.exports = {}
    }, function (t, n, e) {
        var r = e(10),
            o = e(49),
            i = e(50),
            u = e(8),
            c = e(19),
            s = e(51),
            a = {},
            f = {};
        (n = t.exports = function (t, n, e, l, p) {
            var h, d, v, y, m = p ? function () {
                    return t
                } : s(t),
                g = r(e, l, n ? 2 : 1),
                b = 0;
            if ("function" != typeof m) throw TypeError(t + " is not iterable!");
            if (i(m)) {
                for (h = c(t.length); h > b; b++)
                    if ((y = n ? g(u(d = t[b])[0], d[1]) : g(t[b])) === a || y === f) return y
            } else
                for (v = m.call(t); !(d = v.next()).done;)
                    if ((y = o(v, g, d.value, n)) === a || y === f) return y
        }).BREAK = a, n.RETURN = f
    }, function (t, n) {
        var e = 0,
            r = Math.random();
        t.exports = function (t) {
            return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++e + r).toString(36))
        }
    }, function (t, n) {
        t.exports = function (t, n) {
            return {
                enumerable: !(1 & t),
                configurable: !(2 & t),
                writable: !(4 & t),
                value: n
            }
        }
    }, function (t, n, e) {
        var r = e(31),
            o = e(28);
        t.exports = function (t) {
            return r(o(t))
        }
    }, function (t, n, e) {
        var r = e(27),
            o = Math.min;
        t.exports = function (t) {
            return t > 0 ? o(r(t), 9007199254740991) : 0
        }
    }, function (t, n, e) {
        var r = e(28);
        t.exports = function (t) {
            return Object(r(t))
        }
    }, function (t, n, e) {
        var r = e(16)("meta"),
            o = e(1),
            i = e(9),
            u = e(7).f,
            c = 0,
            s = Object.isExtensible || function () {
                return !0
            },
            a = !e(13)((function () {
                return s(Object.preventExtensions({}))
            })),
            f = function (t) {
                u(t, r, {
                    value: {
                        i: "O" + ++c,
                        w: {}
                    }
                })
            },
            l = t.exports = {
                KEY: r,
                NEED: !1,
                fastKey: function (t, n) {
                    if (!o(t)) return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;
                    if (!i(t, r)) {
                        if (!s(t)) return "F";
                        if (!n) return "E";
                        f(t)
                    }
                    return t[r].i
                },
                getWeak: function (t, n) {
                    if (!i(t, r)) {
                        if (!s(t)) return !0;
                        if (!n) return !1;
                        f(t)
                    }
                    return t[r].w
                },
                onFreeze: function (t) {
                    return a && l.NEED && s(t) && !i(t, r) && f(t), t
                }
            }
    }, function (t, n, e) {
        "use strict";
        var r = e(23),
            o = {};
        o[e(0)("toStringTag")] = "z", o + "" != "[object z]" && e(6)(Object.prototype, "toString", (function () {
            return "[object " + r(this) + "]"
        }), !0)
    }, function (t, n, e) {
        var r = e(24),
            o = e(0)("toStringTag"),
            i = "Arguments" == r(function () {
                return arguments
            }());
        t.exports = function (t) {
            var n, e, u;
            return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof (e = function (t, n) {
                try {
                    return t[n]
                } catch (t) {}
            }(n = Object(t), o)) ? e : i ? r(n) : "Object" == (u = r(n)) && "function" == typeof n.callee ? "Arguments" : u
        }
    }, function (t, n) {
        var e = {}.toString;
        t.exports = function (t) {
            return e.call(t).slice(8, -1)
        }
    }, function (t, n, e) {
        var r = e(3),
            o = e(2),
            i = o["__core-js_shared__"] || (o["__core-js_shared__"] = {});
        (t.exports = function (t, n) {
            return i[t] || (i[t] = void 0 !== n ? n : {})
        })("versions", []).push({
            version: r.version,
            mode: e(40) ? "pure" : "global",
            copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
        })
    }, function (t, n, e) {
        "use strict";
        var r = e(61)(!0);
        e(29)(String, "String", (function (t) {
            this._t = String(t), this._i = 0
        }), (function () {
            var t, n = this._t,
                e = this._i;
            return e >= n.length ? {
                value: void 0,
                done: !0
            } : (t = r(n, e), this._i += t.length, {
                value: t,
                done: !1
            })
        }))
    }, function (t, n) {
        var e = Math.ceil,
            r = Math.floor;
        t.exports = function (t) {
            return isNaN(t = +t) ? 0 : (t > 0 ? r : e)(t)
        }
    }, function (t, n) {
        t.exports = function (t) {
            if (null == t) throw TypeError("Can't call method on  " + t);
            return t
        }
    }, function (t, n, e) {
        "use strict";
        var r = e(40),
            o = e(5),
            i = e(6),
            u = e(11),
            c = e(14),
            s = e(62),
            a = e(33),
            f = e(68),
            l = e(0)("iterator"),
            p = !([].keys && "next" in [].keys()),
            h = function () {
                return this
            };
        t.exports = function (t, n, e, d, v, y, m) {
            s(e, n, d);
            var g, b, x, _ = function (t) {
                    if (!p && t in O) return O[t];
                    switch (t) {
                        case "keys":
                        case "values":
                            return function () {
                                return new e(this, t)
                            }
                    }
                    return function () {
                        return new e(this, t)
                    }
                },
                w = n + " Iterator",
                E = "values" == v,
                S = !1,
                O = t.prototype,
                T = O[l] || O["@@iterator"] || v && O[v],
                A = T || _(v),
                M = v ? E ? _("entries") : A : void 0,
                P = "Array" == n && O.entries || T;
            if (P && (x = f(P.call(new t))) !== Object.prototype && x.next && (a(x, w, !0), r || "function" == typeof x[l] || u(x, l, h)), E && T && "values" !== T.name && (S = !0, A = function () {
                    return T.call(this)
                }), r && !m || !p && !S && O[l] || u(O, l, A), c[n] = A, c[w] = h, v)
                if (g = {
                        values: E ? A : _("values"),
                        keys: y ? A : _("keys"),
                        entries: M
                    }, m)
                    for (b in g) b in O || i(O, b, g[b]);
                else o(o.P + o.F * (p || S), n, g);
            return g
        }
    }, function (t, n, e) {
        var r = e(64),
            o = e(46);
        t.exports = Object.keys || function (t) {
            return r(t, o)
        }
    }, function (t, n, e) {
        var r = e(24);
        t.exports = Object("z").propertyIsEnumerable(0) ? Object : function (t) {
            return "String" == r(t) ? t.split("") : Object(t)
        }
    }, function (t, n, e) {
        var r = e(25)("keys"),
            o = e(16);
        t.exports = function (t) {
            return r[t] || (r[t] = o(t))
        }
    }, function (t, n, e) {
        var r = e(7).f,
            o = e(9),
            i = e(0)("toStringTag");
        t.exports = function (t, n, e) {
            t && !o(t = e ? t : t.prototype, i) && r(t, i, {
                configurable: !0,
                value: n
            })
        }
    }, function (t, n, e) {
        for (var r = e(69), o = e(30), i = e(6), u = e(2), c = e(11), s = e(14), a = e(0), f = a("iterator"), l = a("toStringTag"), p = s.Array, h = {
                CSSRuleList: !0,
                CSSStyleDeclaration: !1,
                CSSValueList: !1,
                ClientRectList: !1,
                DOMRectList: !1,
                DOMStringList: !1,
                DOMTokenList: !0,
                DataTransferItemList: !1,
                FileList: !1,
                HTMLAllCollection: !1,
                HTMLCollection: !1,
                HTMLFormElement: !1,
                HTMLSelectElement: !1,
                MediaList: !0,
                MimeTypeArray: !1,
                NamedNodeMap: !1,
                NodeList: !0,
                PaintRequestList: !1,
                Plugin: !1,
                PluginArray: !1,
                SVGLengthList: !1,
                SVGNumberList: !1,
                SVGPathSegList: !1,
                SVGPointList: !1,
                SVGStringList: !1,
                SVGTransformList: !1,
                SourceBufferList: !1,
                StyleSheetList: !0,
                TextTrackCueList: !1,
                TextTrackList: !1,
                TouchList: !1
            }, d = o(h), v = 0; v < d.length; v++) {
            var y, m = d[v],
                g = h[m],
                b = u[m],
                x = b && b.prototype;
            if (x && (x[f] || c(x, f, p), x[l] || c(x, l, m), s[m] = p, g))
                for (y in r) x[y] || i(x, y, r[y], !0)
        }
    }, function (t, n, e) {
        var r = e(6);
        t.exports = function (t, n, e) {
            for (var o in n) r(t, o, n[o], e);
            return t
        }
    }, function (t, n) {
        t.exports = function (t, n, e, r) {
            if (!(t instanceof n) || void 0 !== r && r in t) throw TypeError(e + ": incorrect invocation!");
            return t
        }
    }, function (t, n, e) {
        "use strict";
        var r = e(2),
            o = e(5),
            i = e(6),
            u = e(35),
            c = e(21),
            s = e(15),
            a = e(36),
            f = e(1),
            l = e(13),
            p = e(52),
            h = e(33),
            d = e(73);
        t.exports = function (t, n, e, v, y, m) {
            var g = r[t],
                b = g,
                x = y ? "set" : "add",
                _ = b && b.prototype,
                w = {},
                E = function (t) {
                    var n = _[t];
                    i(_, t, "delete" == t || "has" == t ? function (t) {
                        return !(m && !f(t)) && n.call(this, 0 === t ? 0 : t)
                    } : "get" == t ? function (t) {
                        return m && !f(t) ? void 0 : n.call(this, 0 === t ? 0 : t)
                    } : "add" == t ? function (t) {
                        return n.call(this, 0 === t ? 0 : t), this
                    } : function (t, e) {
                        return n.call(this, 0 === t ? 0 : t, e), this
                    })
                };
            if ("function" == typeof b && (m || _.forEach && !l((function () {
                    (new b).entries().next()
                })))) {
                var S = new b,
                    O = S[x](m ? {} : -0, 1) != S,
                    T = l((function () {
                        S.has(1)
                    })),
                    A = p((function (t) {
                        new b(t)
                    })),
                    M = !m && l((function () {
                        for (var t = new b, n = 5; n--;) t[x](n, n);
                        return !t.has(-0)
                    }));
                A || ((b = n((function (n, e) {
                    a(n, b, t);
                    var r = d(new g, n, b);
                    return null != e && s(e, y, r[x], r), r
                }))).prototype = _, _.constructor = b), (T || M) && (E("delete"), E("has"), y && E("get")), (M || O) && E(x), m && _.clear && delete _.clear
            } else b = v.getConstructor(n, t, y, x), u(b.prototype, e), c.NEED = !0;
            return h(b, t), w[t] = b, o(o.G + o.W + o.F * (b != g), w), m || v.setStrong(b, t, y), b
        }
    }, function (t, n, e) {
        "use strict";
        var r = e(5);
        t.exports = function (t) {
            r(r.S, t, {
                of: function () {
                    for (var t = arguments.length, n = new Array(t); t--;) n[t] = arguments[t];
                    return new this(n)
                }
            })
        }
    }, function (t, n, e) {
        "use strict";
        var r = e(5),
            o = e(44),
            i = e(10),
            u = e(15);
        t.exports = function (t) {
            r(r.S, t, {
                from: function (t) {
                    var n, e, r, c, s = arguments[1];
                    return o(this), (n = void 0 !== s) && o(s), null == t ? new this : (e = [], n ? (r = 0, c = i(s, arguments[2], 2), u(t, !1, (function (t) {
                        e.push(c(t, r++))
                    }))) : u(t, !1, e.push, e), new this(e))
                }
            })
        }
    }, function (t, n) {
        t.exports = !1
    }, function (t, n, e) {
        t.exports = !e(4) && !e(13)((function () {
            return 7 != Object.defineProperty(e(42)("div"), "a", {
                get: function () {
                    return 7
                }
            }).a
        }))
    }, function (t, n, e) {
        var r = e(1),
            o = e(2).document,
            i = r(o) && r(o.createElement);
        t.exports = function (t) {
            return i ? o.createElement(t) : {}
        }
    }, function (t, n, e) {
        var r = e(1);
        t.exports = function (t, n) {
            if (!r(t)) return t;
            var e, o;
            if (n && "function" == typeof (e = t.toString) && !r(o = e.call(t))) return o;
            if ("function" == typeof (e = t.valueOf) && !r(o = e.call(t))) return o;
            if (!n && "function" == typeof (e = t.toString) && !r(o = e.call(t))) return o;
            throw TypeError("Can't convert object to primitive value")
        }
    }, function (t, n) {
        t.exports = function (t) {
            if ("function" != typeof t) throw TypeError(t + " is not a function!");
            return t
        }
    }, function (t, n, e) {
        var r = e(8),
            o = e(63),
            i = e(46),
            u = e(32)("IE_PROTO"),
            c = function () {},
            s = function () {
                var t, n = e(42)("iframe"),
                    r = i.length;
                for (n.style.display = "none", e(67).appendChild(n), n.src = "javascript:", (t = n.contentWindow.document).open(), t.write("<script>document.F=Object<\/script>"), t.close(), s = t.F; r--;) delete s.prototype[i[r]];
                return s()
            };
        t.exports = Object.create || function (t, n) {
            var e;
            return null !== t ? (c.prototype = r(t), e = new c, c.prototype = null, e[u] = t) : e = s(), void 0 === n ? e : o(e, n)
        }
    }, function (t, n) {
        t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
    }, function (t, n) {
        t.exports = function (t, n) {
            return {
                value: n,
                done: !!t
            }
        }
    }, function (t, n, e) {
        "use strict";
        var r = e(7).f,
            o = e(45),
            i = e(35),
            u = e(10),
            c = e(36),
            s = e(15),
            a = e(29),
            f = e(47),
            l = e(72),
            p = e(4),
            h = e(21).fastKey,
            d = e(12),
            v = p ? "_s" : "size",
            y = function (t, n) {
                var e, r = h(n);
                if ("F" !== r) return t._i[r];
                for (e = t._f; e; e = e.n)
                    if (e.k == n) return e
            };
        t.exports = {
            getConstructor: function (t, n, e, a) {
                var f = t((function (t, r) {
                    c(t, f, n, "_i"), t._t = n, t._i = o(null), t._f = void 0, t._l = void 0, t[v] = 0, null != r && s(r, e, t[a], t)
                }));
                return i(f.prototype, {
                    clear: function () {
                        for (var t = d(this, n), e = t._i, r = t._f; r; r = r.n) r.r = !0, r.p && (r.p = r.p.n = void 0), delete e[r.i];
                        t._f = t._l = void 0, t[v] = 0
                    },
                    delete: function (t) {
                        var e = d(this, n),
                            r = y(e, t);
                        if (r) {
                            var o = r.n,
                                i = r.p;
                            delete e._i[r.i], r.r = !0, i && (i.n = o), o && (o.p = i), e._f == r && (e._f = o), e._l == r && (e._l = i), e[v]--
                        }
                        return !!r
                    },
                    forEach: function (t) {
                        d(this, n);
                        for (var e, r = u(t, arguments.length > 1 ? arguments[1] : void 0, 3); e = e ? e.n : this._f;)
                            for (r(e.v, e.k, this); e && e.r;) e = e.p
                    },
                    has: function (t) {
                        return !!y(d(this, n), t)
                    }
                }), p && r(f.prototype, "size", {
                    get: function () {
                        return d(this, n)[v]
                    }
                }), f
            },
            def: function (t, n, e) {
                var r, o, i = y(t, n);
                return i ? i.v = e : (t._l = i = {
                    i: o = h(n, !0),
                    k: n,
                    v: e,
                    p: r = t._l,
                    n: void 0,
                    r: !1
                }, t._f || (t._f = i), r && (r.n = i), t[v]++, "F" !== o && (t._i[o] = i)), t
            },
            getEntry: y,
            setStrong: function (t, n, e) {
                a(t, n, (function (t, e) {
                    this._t = d(t, n), this._k = e, this._l = void 0
                }), (function () {
                    for (var t = this._k, n = this._l; n && n.r;) n = n.p;
                    return this._t && (this._l = n = n ? n.n : this._t._f) ? f(0, "keys" == t ? n.k : "values" == t ? n.v : [n.k, n.v]) : (this._t = void 0, f(1))
                }), e ? "entries" : "values", !e, !0), l(n)
            }
        }
    }, function (t, n, e) {
        var r = e(8);
        t.exports = function (t, n, e, o) {
            try {
                return o ? n(r(e)[0], e[1]) : n(e)
            } catch (n) {
                var i = t.return;
                throw void 0 !== i && r(i.call(t)), n
            }
        }
    }, function (t, n, e) {
        var r = e(14),
            o = e(0)("iterator"),
            i = Array.prototype;
        t.exports = function (t) {
            return void 0 !== t && (r.Array === t || i[o] === t)
        }
    }, function (t, n, e) {
        var r = e(23),
            o = e(0)("iterator"),
            i = e(14);
        t.exports = e(3).getIteratorMethod = function (t) {
            if (null != t) return t[o] || t["@@iterator"] || i[r(t)]
        }
    }, function (t, n, e) {
        var r = e(0)("iterator"),
            o = !1;
        try {
            var i = [7][r]();
            i.return = function () {
                o = !0
            }, Array.from(i, (function () {
                throw 2
            }))
        } catch (t) {}
        t.exports = function (t, n) {
            if (!n && !o) return !1;
            var e = !1;
            try {
                var i = [7],
                    u = i[r]();
                u.next = function () {
                    return {
                        done: e = !0
                    }
                }, i[r] = function () {
                    return u
                }, t(i)
            } catch (t) {}
            return e
        }
    }, function (t, n) {
        n.f = {}.propertyIsEnumerable
    }, function (t, n, e) {
        var r = e(23),
            o = e(77);
        t.exports = function (t) {
            return function () {
                if (r(this) != t) throw TypeError(t + "#toJSON isn't generic");
                return o(this)
            }
        }
    }, function (t, n, e) {
        var r = e(10),
            o = e(31),
            i = e(20),
            u = e(19),
            c = e(87);
        t.exports = function (t, n) {
            var e = 1 == t,
                s = 2 == t,
                a = 3 == t,
                f = 4 == t,
                l = 6 == t,
                p = 5 == t || l,
                h = n || c;
            return function (n, c, d) {
                for (var v, y, m = i(n), g = o(m), b = r(c, d, 3), x = u(g.length), _ = 0, w = e ? h(n, x) : s ? h(n, 0) : void 0; x > _; _++)
                    if ((p || _ in g) && (y = b(v = g[_], _, m), t))
                        if (e) w[_] = y;
                        else if (y) switch (t) {
                    case 3:
                        return !0;
                    case 5:
                        return v;
                    case 6:
                        return _;
                    case 2:
                        w.push(v)
                } else if (f) return !1;
                return l ? -1 : a || f ? f : w
            }
        }
    }, function (t, n, e) {
        "use strict";
        var r = e(4),
            o = e(30),
            i = e(90),
            u = e(53),
            c = e(20),
            s = e(31),
            a = Object.assign;
        t.exports = !a || e(13)((function () {
            var t = {},
                n = {},
                e = Symbol(),
                r = "abcdefghijklmnopqrst";
            return t[e] = 7, r.split("").forEach((function (t) {
                n[t] = t
            })), 7 != a({}, t)[e] || Object.keys(a({}, n)).join("") != r
        })) ? function (t, n) {
            for (var e = c(t), a = arguments.length, f = 1, l = i.f, p = u.f; a > f;)
                for (var h, d = s(arguments[f++]), v = l ? o(d).concat(l(d)) : o(d), y = v.length, m = 0; y > m;) h = v[m++], r && !p.call(d, h) || (e[h] = d[h]);
            return e
        } : a
    }, function (t, n, e) {
        "use strict";
        (function (t) {
            var e = "object" == typeof t && t && t.Object === Object && t;
            n.a = e
        }).call(this, e(99))
    }, function (t, n, e) {
        t.exports = e(100)
    }, function (t, n, e) {
        e(22), e(26), e(34), e(71), e(76), e(78), e(79), t.exports = e(3).Map
    }, function (t, n, e) {
        t.exports = e(25)("native-function-to-string", Function.toString)
    }, function (t, n, e) {
        var r = e(27),
            o = e(28);
        t.exports = function (t) {
            return function (n, e) {
                var i, u, c = String(o(n)),
                    s = r(e),
                    a = c.length;
                return s < 0 || s >= a ? t ? "" : void 0 : (i = c.charCodeAt(s)) < 55296 || i > 56319 || s + 1 === a || (u = c.charCodeAt(s + 1)) < 56320 || u > 57343 ? t ? c.charAt(s) : i : t ? c.slice(s, s + 2) : u - 56320 + (i - 55296 << 10) + 65536
            }
        }
    }, function (t, n, e) {
        "use strict";
        var r = e(45),
            o = e(17),
            i = e(33),
            u = {};
        e(11)(u, e(0)("iterator"), (function () {
            return this
        })), t.exports = function (t, n, e) {
            t.prototype = r(u, {
                next: o(1, e)
            }), i(t, n + " Iterator")
        }
    }, function (t, n, e) {
        var r = e(7),
            o = e(8),
            i = e(30);
        t.exports = e(4) ? Object.defineProperties : function (t, n) {
            o(t);
            for (var e, u = i(n), c = u.length, s = 0; c > s;) r.f(t, e = u[s++], n[e]);
            return t
        }
    }, function (t, n, e) {
        var r = e(9),
            o = e(18),
            i = e(65)(!1),
            u = e(32)("IE_PROTO");
        t.exports = function (t, n) {
            var e, c = o(t),
                s = 0,
                a = [];
            for (e in c) e != u && r(c, e) && a.push(e);
            for (; n.length > s;) r(c, e = n[s++]) && (~i(a, e) || a.push(e));
            return a
        }
    }, function (t, n, e) {
        var r = e(18),
            o = e(19),
            i = e(66);
        t.exports = function (t) {
            return function (n, e, u) {
                var c, s = r(n),
                    a = o(s.length),
                    f = i(u, a);
                if (t && e != e) {
                    for (; a > f;)
                        if ((c = s[f++]) != c) return !0
                } else
                    for (; a > f; f++)
                        if ((t || f in s) && s[f] === e) return t || f || 0;
                return !t && -1
            }
        }
    }, function (t, n, e) {
        var r = e(27),
            o = Math.max,
            i = Math.min;
        t.exports = function (t, n) {
            return (t = r(t)) < 0 ? o(t + n, 0) : i(t, n)
        }
    }, function (t, n, e) {
        var r = e(2).document;
        t.exports = r && r.documentElement
    }, function (t, n, e) {
        var r = e(9),
            o = e(20),
            i = e(32)("IE_PROTO"),
            u = Object.prototype;
        t.exports = Object.getPrototypeOf || function (t) {
            return t = o(t), r(t, i) ? t[i] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? u : null
        }
    }, function (t, n, e) {
        "use strict";
        var r = e(70),
            o = e(47),
            i = e(14),
            u = e(18);
        t.exports = e(29)(Array, "Array", (function (t, n) {
            this._t = u(t), this._i = 0, this._k = n
        }), (function () {
            var t = this._t,
                n = this._k,
                e = this._i++;
            return !t || e >= t.length ? (this._t = void 0, o(1)) : o(0, "keys" == n ? e : "values" == n ? t[e] : [e, t[e]])
        }), "values"), i.Arguments = i.Array, r("keys"), r("values"), r("entries")
    }, function (t, n, e) {
        var r = e(0)("unscopables"),
            o = Array.prototype;
        null == o[r] && e(11)(o, r, {}), t.exports = function (t) {
            o[r][t] = !0
        }
    }, function (t, n, e) {
        "use strict";
        var r = e(48),
            o = e(12);
        t.exports = e(37)("Map", (function (t) {
            return function () {
                return t(this, arguments.length > 0 ? arguments[0] : void 0)
            }
        }), {
            get: function (t) {
                var n = r.getEntry(o(this, "Map"), t);
                return n && n.v
            },
            set: function (t, n) {
                return r.def(o(this, "Map"), 0 === t ? 0 : t, n)
            }
        }, r, !0)
    }, function (t, n, e) {
        "use strict";
        var r = e(2),
            o = e(7),
            i = e(4),
            u = e(0)("species");
        t.exports = function (t) {
            var n = r[t];
            i && n && !n[u] && o.f(n, u, {
                configurable: !0,
                get: function () {
                    return this
                }
            })
        }
    }, function (t, n, e) {
        var r = e(1),
            o = e(74).set;
        t.exports = function (t, n, e) {
            var i, u = n.constructor;
            return u !== e && "function" == typeof u && (i = u.prototype) !== e.prototype && r(i) && o && o(t, i), t
        }
    }, function (t, n, e) {
        var r = e(1),
            o = e(8),
            i = function (t, n) {
                if (o(t), !r(n) && null !== n) throw TypeError(n + ": can't set as prototype!")
            };
        t.exports = {
            set: Object.setPrototypeOf || ("__proto__" in {} ? function (t, n, r) {
                try {
                    (r = e(10)(Function.call, e(75).f(Object.prototype, "__proto__").set, 2))(t, []), n = !(t instanceof Array)
                } catch (t) {
                    n = !0
                }
                return function (t, e) {
                    return i(t, e), n ? t.__proto__ = e : r(t, e), t
                }
            }({}, !1) : void 0),
            check: i
        }
    }, function (t, n, e) {
        var r = e(53),
            o = e(17),
            i = e(18),
            u = e(43),
            c = e(9),
            s = e(41),
            a = Object.getOwnPropertyDescriptor;
        n.f = e(4) ? a : function (t, n) {
            if (t = i(t), n = u(n, !0), s) try {
                return a(t, n)
            } catch (t) {}
            if (c(t, n)) return o(!r.f.call(t, n), t[n])
        }
    }, function (t, n, e) {
        var r = e(5);
        r(r.P + r.R, "Map", {
            toJSON: e(54)("Map")
        })
    }, function (t, n, e) {
        var r = e(15);
        t.exports = function (t, n) {
            var e = [];
            return r(t, !1, e.push, e, n), e
        }
    }, function (t, n, e) {
        e(38)("Map")
    }, function (t, n, e) {
        e(39)("Map")
    }, function (t, n, e) {
        e(22), e(26), e(34), e(81), e(82), e(83), e(84), t.exports = e(3).Set
    }, function (t, n, e) {
        "use strict";
        var r = e(48),
            o = e(12);
        t.exports = e(37)("Set", (function (t) {
            return function () {
                return t(this, arguments.length > 0 ? arguments[0] : void 0)
            }
        }), {
            add: function (t) {
                return r.def(o(this, "Set"), t = 0 === t ? 0 : t, t)
            }
        }, r)
    }, function (t, n, e) {
        var r = e(5);
        r(r.P + r.R, "Set", {
            toJSON: e(54)("Set")
        })
    }, function (t, n, e) {
        e(38)("Set")
    }, function (t, n, e) {
        e(39)("Set")
    }, function (t, n, e) {
        e(22), e(34), e(86), e(92), e(93), t.exports = e(3).WeakMap
    }, function (t, n, e) {
        "use strict";
        var r, o = e(2),
            i = e(55)(0),
            u = e(6),
            c = e(21),
            s = e(56),
            a = e(91),
            f = e(1),
            l = e(12),
            p = e(12),
            h = !o.ActiveXObject && "ActiveXObject" in o,
            d = c.getWeak,
            v = Object.isExtensible,
            y = a.ufstore,
            m = function (t) {
                return function () {
                    return t(this, arguments.length > 0 ? arguments[0] : void 0)
                }
            },
            g = {
                get: function (t) {
                    if (f(t)) {
                        var n = d(t);
                        return !0 === n ? y(l(this, "WeakMap")).get(t) : n ? n[this._i] : void 0
                    }
                },
                set: function (t, n) {
                    return a.def(l(this, "WeakMap"), t, n)
                }
            },
            b = t.exports = e(37)("WeakMap", m, g, a, !0, !0);
        p && h && (s((r = a.getConstructor(m, "WeakMap")).prototype, g), c.NEED = !0, i(["delete", "has", "get", "set"], (function (t) {
            var n = b.prototype,
                e = n[t];
            u(n, t, (function (n, o) {
                if (f(n) && !v(n)) {
                    this._f || (this._f = new r);
                    var i = this._f[t](n, o);
                    return "set" == t ? this : i
                }
                return e.call(this, n, o)
            }))
        })))
    }, function (t, n, e) {
        var r = e(88);
        t.exports = function (t, n) {
            return new(r(t))(n)
        }
    }, function (t, n, e) {
        var r = e(1),
            o = e(89),
            i = e(0)("species");
        t.exports = function (t) {
            var n;
            return o(t) && ("function" != typeof (n = t.constructor) || n !== Array && !o(n.prototype) || (n = void 0), r(n) && null === (n = n[i]) && (n = void 0)), void 0 === n ? Array : n
        }
    }, function (t, n, e) {
        var r = e(24);
        t.exports = Array.isArray || function (t) {
            return "Array" == r(t)
        }
    }, function (t, n) {
        n.f = Object.getOwnPropertySymbols
    }, function (t, n, e) {
        "use strict";
        var r = e(35),
            o = e(21).getWeak,
            i = e(8),
            u = e(1),
            c = e(36),
            s = e(15),
            a = e(55),
            f = e(9),
            l = e(12),
            p = a(5),
            h = a(6),
            d = 0,
            v = function (t) {
                return t._l || (t._l = new y)
            },
            y = function () {
                this.a = []
            },
            m = function (t, n) {
                return p(t.a, (function (t) {
                    return t[0] === n
                }))
            };
        y.prototype = {
            get: function (t) {
                var n = m(this, t);
                if (n) return n[1]
            },
            has: function (t) {
                return !!m(this, t)
            },
            set: function (t, n) {
                var e = m(this, t);
                e ? e[1] = n : this.a.push([t, n])
            },
            delete: function (t) {
                var n = h(this.a, (function (n) {
                    return n[0] === t
                }));
                return ~n && this.a.splice(n, 1), !!~n
            }
        }, t.exports = {
            getConstructor: function (t, n, e, i) {
                var a = t((function (t, r) {
                    c(t, a, n, "_i"), t._t = n, t._i = d++, t._l = void 0, null != r && s(r, e, t[i], t)
                }));
                return r(a.prototype, {
                    delete: function (t) {
                        if (!u(t)) return !1;
                        var e = o(t);
                        return !0 === e ? v(l(this, n)).delete(t) : e && f(e, this._i) && delete e[this._i]
                    },
                    has: function (t) {
                        if (!u(t)) return !1;
                        var e = o(t);
                        return !0 === e ? v(l(this, n)).has(t) : e && f(e, this._i)
                    }
                }), a
            },
            def: function (t, n, e) {
                var r = o(i(n), !0);
                return !0 === r ? v(t).set(n, e) : r[t._i] = e, t
            },
            ufstore: v
        }
    }, function (t, n, e) {
        e(38)("WeakMap")
    }, function (t, n, e) {
        e(39)("WeakMap")
    }, function (t, n, e) {
        e(26), e(95), t.exports = e(3).Array.from
    }, function (t, n, e) {
        "use strict";
        var r = e(10),
            o = e(5),
            i = e(20),
            u = e(49),
            c = e(50),
            s = e(19),
            a = e(96),
            f = e(51);
        o(o.S + o.F * !e(52)((function (t) {
            Array.from(t)
        })), "Array", {
            from: function (t) {
                var n, e, o, l, p = i(t),
                    h = "function" == typeof this ? this : Array,
                    d = arguments.length,
                    v = d > 1 ? arguments[1] : void 0,
                    y = void 0 !== v,
                    m = 0,
                    g = f(p);
                if (y && (v = r(v, d > 2 ? arguments[2] : void 0, 2)), null == g || h == Array && c(g))
                    for (e = new h(n = s(p.length)); n > m; m++) a(e, m, y ? v(p[m], m) : p[m]);
                else
                    for (l = g.call(p), e = new h; !(o = l.next()).done; m++) a(e, m, y ? u(l, v, [o.value, m], !0) : o.value);
                return e.length = m, e
            }
        })
    }, function (t, n, e) {
        "use strict";
        var r = e(7),
            o = e(17);
        t.exports = function (t, n, e) {
            n in t ? r.f(t, n, o(0, e)) : t[n] = e
        }
    }, function (t, n, e) {
        e(98), t.exports = e(3).Object.assign
    }, function (t, n, e) {
        var r = e(5);
        r(r.S + r.F, "Object", {
            assign: e(56)
        })
    }, function (t, n) {
        var e;
        e = function () {
            return this
        }();
        try {
            e = e || new Function("return this")()
        } catch (t) {
            "object" == typeof window && (e = window)
        }
        t.exports = e
    }, function (t, n, e) {
        "use strict";
        e.r(n);
        var r = {};
        e.r(r), e.d(r, "keyboardHandler", (function () {
            return et
        })), e.d(r, "mouseHandler", (function () {
            return rt
        })), e.d(r, "resizeHandler", (function () {
            return ot
        })), e.d(r, "selectHandler", (function () {
            return it
        })), e.d(r, "touchHandler", (function () {
            return ut
        })), e.d(r, "wheelHandler", (function () {
            return ct
        }));
        /*! *****************************************************************************
        Copyright (c) Microsoft Corporation. All rights reserved.
        Licensed under the Apache License, Version 2.0 (the "License"); you may not use
        this file except in compliance with the License. You may obtain a copy of the
        License at http://www.apache.org/licenses/LICENSE-2.0
        THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
        KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
        WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
        MERCHANTABLITY OR NON-INFRINGEMENT.
        See the Apache Version 2.0 License for specific language governing permissions
        and limitations under the License.
        ***************************************************************************** */
        var o = function (t, n) {
                return (o = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function (t, n) {
                        t.__proto__ = n
                    } || function (t, n) {
                        for (var e in n) n.hasOwnProperty(e) && (t[e] = n[e])
                    })(t, n)
            },
            i = function () {
                return (i = Object.assign || function (t) {
                    for (var n, e = 1, r = arguments.length; e < r; e++)
                        for (var o in n = arguments[e]) Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
                    return t
                }).apply(this, arguments)
            };

        function u(t, n, e, r) {
            var o, i = arguments.length,
                u = i < 3 ? n : null === r ? r = Object.getOwnPropertyDescriptor(n, e) : r;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) u = Reflect.decorate(t, n, e, r);
            else
                for (var c = t.length - 1; c >= 0; c--)(o = t[c]) && (u = (i < 3 ? o(u) : i > 3 ? o(n, e, u) : o(n, e)) || u);
            return i > 3 && u && Object.defineProperty(n, e, u), u
        }
        e(59), e(80), e(85), e(94), e(97);
        var c = function (t) {
                var n = typeof t;
                return null != t && ("object" == n || "function" == n)
            },
            s = e(57),
            a = "object" == typeof self && self && self.Object === Object && self,
            f = s.a || a || Function("return this")(),
            l = f.Symbol,
            p = Object.prototype,
            h = p.hasOwnProperty,
            d = p.toString,
            v = l ? l.toStringTag : void 0,
            y = Object.prototype.toString,
            m = l ? l.toStringTag : void 0,
            g = function (t) {
                return null == t ? void 0 === t ? "[object Undefined]" : "[object Null]" : m && m in Object(t) ? function (t) {
                    var n = h.call(t, v),
                        e = t[v];
                    try {
                        t[v] = void 0;
                        var r = !0
                    } catch (t) {}
                    var o = d.call(t);
                    return r && (n ? t[v] = e : delete t[v]), o
                }(t) : function (t) {
                    return y.call(t)
                }(t)
            },
            b = /^\s+|\s+$/g,
            x = /^[-+]0x[0-9a-f]+$/i,
            _ = /^0b[01]+$/i,
            w = /^0o[0-7]+$/i,
            E = parseInt,
            S = function (t) {
                if ("number" == typeof t) return t;
                if (function (t) {
                        return "symbol" == typeof t || function (t) {
                            return null != t && "object" == typeof t
                        }(t) && "[object Symbol]" == g(t)
                    }(t)) return NaN;
                if (c(t)) {
                    var n = "function" == typeof t.valueOf ? t.valueOf() : t;
                    t = c(n) ? n + "" : n
                }
                if ("string" != typeof t) return 0 === t ? t : +t;
                t = t.replace(b, "");
                var e = _.test(t);
                return e || w.test(t) ? E(t.slice(2), e ? 2 : 8) : x.test(t) ? NaN : +t
            },
            O = function (t, n, e) {
                return void 0 === e && (e = n, n = void 0), void 0 !== e && (e = (e = S(e)) == e ? e : 0), void 0 !== n && (n = (n = S(n)) == n ? n : 0),
                    function (t, n, e) {
                        return t == t && (void 0 !== e && (t = t <= e ? t : e), void 0 !== n && (t = t >= n ? t : n)), t
                    }(S(t), n, e)
            };

        function T(t, n) {
            return void 0 === t && (t = -1 / 0), void 0 === n && (n = 1 / 0),
                function (e, r) {
                    var o = "_" + r;
                    Object.defineProperty(e, r, {
                        get: function () {
                            return this[o]
                        },
                        set: function (e) {
                            Object.defineProperty(this, o, {
                                value: O(e, t, n),
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            })
                        },
                        enumerable: !0,
                        configurable: !0
                    })
                }
        }

        function A(t, n) {
            var e = "_" + n;
            Object.defineProperty(t, n, {
                get: function () {
                    return this[e]
                },
                set: function (t) {
                    Object.defineProperty(this, e, {
                        value: !!t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    })
                },
                enumerable: !0,
                configurable: !0
            })
        }
        var M = function () {
                return f.Date.now()
            },
            P = Math.max,
            j = Math.min,
            k = function (t, n, e) {
                var r, o, i, u, s, a, f = 0,
                    l = !1,
                    p = !1,
                    h = !0;
                if ("function" != typeof t) throw new TypeError("Expected a function");

                function d(n) {
                    var e = r,
                        i = o;
                    return r = o = void 0, f = n, u = t.apply(i, e)
                }

                function v(t) {
                    var e = t - a;
                    return void 0 === a || e >= n || e < 0 || p && t - f >= i
                }

                function y() {
                    var t = M();
                    if (v(t)) return m(t);
                    s = setTimeout(y, function (t) {
                        var e = n - (t - a);
                        return p ? j(e, i - (t - f)) : e
                    }(t))
                }

                function m(t) {
                    return s = void 0, h && r ? d(t) : (r = o = void 0, u)
                }

                function g() {
                    var t = M(),
                        e = v(t);
                    if (r = arguments, o = this, a = t, e) {
                        if (void 0 === s) return function (t) {
                            return f = t, s = setTimeout(y, n), l ? d(t) : u
                        }(a);
                        if (p) return clearTimeout(s), s = setTimeout(y, n), d(a)
                    }
                    return void 0 === s && (s = setTimeout(y, n)), u
                }
                return n = S(n) || 0, c(e) && (l = !!e.leading, i = (p = "maxWait" in e) ? P(S(e.maxWait) || 0, n) : i, h = "trailing" in e ? !!e.trailing : h), g.cancel = function () {
                    void 0 !== s && clearTimeout(s), f = 0, r = a = o = s = void 0
                }, g.flush = function () {
                    return void 0 === s ? u : m(M())
                }, g
            };

        function D() {
            for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
            return function (n, e, r) {
                var o = r.value;
                return {
                    get: function () {
                        return this.hasOwnProperty(e) || Object.defineProperty(this, e, {
                            value: k.apply(void 0, function () {
                                for (var t = 0, n = 0, e = arguments.length; n < e; n++) t += arguments[n].length;
                                var r = Array(t),
                                    o = 0;
                                for (n = 0; n < e; n++)
                                    for (var i = arguments[n], u = 0, c = i.length; u < c; u++, o++) r[o] = i[u];
                                return r
                            }([o], t))
                        }), this[e]
                    }
                }
            }
        }
        var L, N = function () {
                function t(t) {
                    var n = this;
                    void 0 === t && (t = {}), this.damping = .1, this.thumbMinSize = 20, this.renderByPixels = !0, this.alwaysShowTracks = !1, this.continuousScrolling = !0, this.delegateTo = null, this.plugins = {}, Object.keys(t).forEach((function (e) {
                        n[e] = t[e]
                    }))
                }
                return Object.defineProperty(t.prototype, "wheelEventTarget", {
                    get: function () {
                        return this.delegateTo
                    },
                    set: function (t) {
                        console.warn("[smooth-scrollbar]: `options.wheelEventTarget` is deprecated and will be removed in the future, use `options.delegateTo` instead."), this.delegateTo = t
                    },
                    enumerable: !0,
                    configurable: !0
                }), u([T(0, 1)], t.prototype, "damping", void 0), u([T(0, 1 / 0)], t.prototype, "thumbMinSize", void 0), u([A], t.prototype, "renderByPixels", void 0), u([A], t.prototype, "alwaysShowTracks", void 0), u([A], t.prototype, "continuousScrolling", void 0), t
            }(),
            z = new WeakMap;

        function C() {
            if (void 0 !== L) return L;
            var t = !1;
            try {
                var n = function () {},
                    e = Object.defineProperty({}, "passive", {
                        get: function () {
                            t = !0
                        }
                    });
                window.addEventListener("testPassive", n, e), window.removeEventListener("testPassive", n, e)
            } catch (t) {}
            return L = !!t && {
                passive: !1
            }
        }

        function R(t) {
            var n = z.get(t) || [];
            return z.set(t, n),
                function (t, e, r) {
                    function o(t) {
                        t.defaultPrevented || r(t)
                    }
                    e.split(/\s+/g).forEach((function (e) {
                        n.push({
                            elem: t,
                            eventName: e,
                            handler: o
                        }), t.addEventListener(e, o, C())
                    }))
                }
        }

        function F(t) {
            var n = function (t) {
                return t.touches ? t.touches[t.touches.length - 1] : t
            }(t);
            return {
                x: n.clientX,
                y: n.clientY
            }
        }

        function I(t, n) {
            return void 0 === n && (n = []), n.some((function (n) {
                return t === n
            }))
        }
        var W = ["webkit", "moz", "ms", "o"],
            H = new RegExp("^-(?!(?:" + W.join("|") + ")-)");

        function B(t, n) {
            n = function (t) {
                var n = {};
                return Object.keys(t).forEach((function (e) {
                    if (H.test(e)) {
                        var r = t[e];
                        e = e.replace(/^-/, ""), n[e] = r, W.forEach((function (t) {
                            n["-" + t + "-" + e] = r
                        }))
                    } else n[e] = t[e]
                })), n
            }(n), Object.keys(n).forEach((function (e) {
                var r = e.replace(/^-/, "").replace(/-([a-z])/g, (function (t, n) {
                    return n.toUpperCase()
                }));
                t.style[r] = n[e]
            }))
        }
        var G, X = function () {
                function t(t) {
                    this.updateTime = Date.now(), this.delta = {
                        x: 0,
                        y: 0
                    }, this.velocity = {
                        x: 0,
                        y: 0
                    }, this.lastPosition = {
                        x: 0,
                        y: 0
                    }, this.lastPosition = F(t)
                }
                return t.prototype.update = function (t) {
                    var n = this.velocity,
                        e = this.updateTime,
                        r = this.lastPosition,
                        o = Date.now(),
                        i = F(t),
                        u = {
                            x: -(i.x - r.x),
                            y: -(i.y - r.y)
                        },
                        c = o - e || 16,
                        s = u.x / c * 16,
                        a = u.y / c * 16;
                    n.x = .9 * s + .1 * n.x, n.y = .9 * a + .1 * n.y, this.delta = u, this.updateTime = o, this.lastPosition = i
                }, t
            }(),
            V = function () {
                function t() {
                    this._touchList = {}
                }
                return Object.defineProperty(t.prototype, "_primitiveValue", {
                    get: function () {
                        return {
                            x: 0,
                            y: 0
                        }
                    },
                    enumerable: !0,
                    configurable: !0
                }), t.prototype.isActive = function () {
                    return void 0 !== this._activeTouchID
                }, t.prototype.getDelta = function () {
                    var t = this._getActiveTracker();
                    return t ? i({}, t.delta) : this._primitiveValue
                }, t.prototype.getVelocity = function () {
                    var t = this._getActiveTracker();
                    return t ? i({}, t.velocity) : this._primitiveValue
                }, t.prototype.track = function (t) {
                    var n = this,
                        e = t.targetTouches;
                    return Array.from(e).forEach((function (t) {
                        n._add(t)
                    })), this._touchList
                }, t.prototype.update = function (t) {
                    var n = this,
                        e = t.touches,
                        r = t.changedTouches;
                    return Array.from(e).forEach((function (t) {
                        n._renew(t)
                    })), this._setActiveID(r), this._touchList
                }, t.prototype.release = function (t) {
                    var n = this;
                    delete this._activeTouchID, Array.from(t.changedTouches).forEach((function (t) {
                        n._delete(t)
                    }))
                }, t.prototype._add = function (t) {
                    if (!this._has(t)) {
                        var n = new X(t);
                        this._touchList[t.identifier] = n
                    }
                }, t.prototype._renew = function (t) {
                    this._has(t) && this._touchList[t.identifier].update(t)
                }, t.prototype._delete = function (t) {
                    delete this._touchList[t.identifier]
                }, t.prototype._has = function (t) {
                    return this._touchList.hasOwnProperty(t.identifier)
                }, t.prototype._setActiveID = function (t) {
                    this._activeTouchID = t[t.length - 1].identifier
                }, t.prototype._getActiveTracker = function () {
                    return this._touchList[this._activeTouchID]
                }, t
            }();
        ! function (t) {
            t.X = "x", t.Y = "y"
        }(G || (G = {}));
        var U = function () {
                function t(t, n) {
                    void 0 === n && (n = 0), this._direction = t, this._minSize = n, this.element = document.createElement("div"), this.displaySize = 0, this.realSize = 0, this.offset = 0, this.element.className = "scrollbar-thumb scrollbar-thumb-" + t
                }
                return t.prototype.attachTo = function (t) {
                    t.appendChild(this.element)
                }, t.prototype.update = function (t, n, e) {
                    this.realSize = Math.min(n / e, 1) * n, this.displaySize = Math.max(this.realSize, this._minSize), this.offset = t / e * (n + (this.realSize - this.displaySize)), B(this.element, this._getStyle())
                }, t.prototype._getStyle = function () {
                    switch (this._direction) {
                        case G.X:
                            return {
                                width: this.displaySize + "px", "-transform": "translate3d(" + this.offset + "px, 0, 0)"
                            };
                        case G.Y:
                            return {
                                height: this.displaySize + "px", "-transform": "translate3d(0, " + this.offset + "px, 0)"
                            };
                        default:
                            return null
                    }
                }, t
            }(),
            Y = function () {
                function t(t, n) {
                    void 0 === n && (n = 0), this.element = document.createElement("div"), this._isShown = !1, this.element.className = "scrollbar-track scrollbar-track-" + t, this.thumb = new U(t, n), this.thumb.attachTo(this.element)
                }
                return t.prototype.attachTo = function (t) {
                    t.appendChild(this.element)
                }, t.prototype.show = function () {
                    this._isShown || (this._isShown = !0, this.element.classList.add("show"))
                }, t.prototype.hide = function () {
                    this._isShown && (this._isShown = !1, this.element.classList.remove("show"))
                }, t.prototype.update = function (t, n, e) {
                    B(this.element, {
                        display: e <= n ? "none" : "block"
                    }), this.thumb.update(t, n, e)
                }, t
            }(),
            q = function () {
                function t(t) {
                    this._scrollbar = t;
                    var n = t.options.thumbMinSize;
                    this.xAxis = new Y(G.X, n), this.yAxis = new Y(G.Y, n), this.xAxis.attachTo(t.containerEl), this.yAxis.attachTo(t.containerEl), t.options.alwaysShowTracks && (this.xAxis.show(), this.yAxis.show())
                }
                return t.prototype.update = function () {
                    var t = this._scrollbar,
                        n = t.size,
                        e = t.offset;
                    this.xAxis.update(e.x, n.container.width, n.content.width), this.yAxis.update(e.y, n.container.height, n.content.height)
                }, t.prototype.autoHideOnIdle = function () {
                    this._scrollbar.options.alwaysShowTracks || (this.xAxis.hide(), this.yAxis.hide())
                }, u([D(300)], t.prototype, "autoHideOnIdle", null), t
            }(),
            K = new WeakMap;

        function $(t) {
            return Math.pow(t - 1, 3) + 1
        }
        var J, Q, Z, tt = function () {
                function t(t, n) {
                    var e = this.constructor;
                    this.scrollbar = t, this.name = e.pluginName, this.options = i(i({}, e.defaultOptions), n)
                }
                return t.prototype.onInit = function () {}, t.prototype.onDestroy = function () {}, t.prototype.onUpdate = function () {}, t.prototype.onRender = function (t) {}, t.prototype.transformDelta = function (t, n) {
                    return i({}, t)
                }, t.pluginName = "", t.defaultOptions = {}, t
            }(),
            nt = {
                order: new Set,
                constructors: {}
            };

        function et(t) {
            var n = R(t),
                e = t.containerEl;
            n(e, "keydown", (function (n) {
                var r = document.activeElement;
                if ((r === e || e.contains(r)) && ! function (t) {
                        return !("INPUT" !== t.tagName && "SELECT" !== t.tagName && "TEXTAREA" !== t.tagName && !t.isContentEditable) && !t.disabled
                    }(r)) {
                    var o = function (t, n) {
                        var e = t.size,
                            r = t.limit,
                            o = t.offset;
                        switch (n) {
                            case J.TAB:
                                return function (t) {
                                    requestAnimationFrame((function () {
                                        t.scrollIntoView(document.activeElement, {
                                            offsetTop: t.size.container.height / 2,
                                            onlyScrollIfNeeded: !0
                                        })
                                    }))
                                }(t);
                            case J.SPACE:
                                return [0, 200];
                            case J.PAGE_UP:
                                return [0, 40 - e.container.height];
                            case J.PAGE_DOWN:
                                return [0, e.container.height - 40];
                            case J.END:
                                return [0, r.y - o.y];
                            case J.HOME:
                                return [0, -o.y];
                            case J.LEFT:
                                return [-40, 0];
                            case J.UP:
                                return [0, -40];
                            case J.RIGHT:
                                return [40, 0];
                            case J.DOWN:
                                return [0, 40];
                            default:
                                return null
                        }
                    }(t, n.keyCode || n.which);
                    if (o) {
                        var i = o[0],
                            u = o[1];
                        t.addTransformableMomentum(i, u, n, (function (e) {
                            e ? n.preventDefault() : (t.containerEl.blur(), t.parent && t.parent.containerEl.focus())
                        }))
                    }
                }
            }))
        }

        function rt(t) {
            var n, e, r, o, i, u = R(t),
                c = t.containerEl,
                s = t.track,
                a = s.xAxis,
                f = s.yAxis;

            function l(n, e) {
                var r = t.size;
                return n === Q.X ? e / (r.container.width + (a.thumb.realSize - a.thumb.displaySize)) * r.content.width : n === Q.Y ? e / (r.container.height + (f.thumb.realSize - f.thumb.displaySize)) * r.content.height : 0
            }

            function p(t) {
                return I(t, [a.element, a.thumb.element]) ? Q.X : I(t, [f.element, f.thumb.element]) ? Q.Y : void 0
            }
            u(c, "click", (function (n) {
                if (!e && I(n.target, [a.element, f.element])) {
                    var r = n.target,
                        o = p(r),
                        i = r.getBoundingClientRect(),
                        u = F(n),
                        c = t.offset,
                        s = t.limit;
                    if (o === Q.X) {
                        var h = u.x - i.left - a.thumb.displaySize / 2;
                        t.setMomentum(O(l(o, h) - c.x, -c.x, s.x - c.x), 0)
                    }
                    o === Q.Y && (h = u.y - i.top - f.thumb.displaySize / 2, t.setMomentum(0, O(l(o, h) - c.y, -c.y, s.y - c.y)))
                }
            })), u(c, "mousedown", (function (e) {
                if (I(e.target, [a.thumb.element, f.thumb.element])) {
                    n = !0;
                    var u = e.target,
                        s = F(e),
                        l = u.getBoundingClientRect();
                    o = p(u), r = {
                        x: s.x - l.left,
                        y: s.y - l.top
                    }, i = c.getBoundingClientRect(), B(t.containerEl, {
                        "-user-select": "none"
                    })
                }
            })), u(window, "mousemove", (function (u) {
                if (n) {
                    e = !0;
                    var c = t.offset,
                        s = F(u);
                    if (o === Q.X) {
                        var a = s.x - r.x - i.left;
                        t.setPosition(l(o, a), c.y)
                    }
                    o === Q.Y && (a = s.y - r.y - i.top, t.setPosition(c.x, l(o, a)))
                }
            })), u(window, "mouseup blur", (function () {
                n = e = !1, B(t.containerEl, {
                    "-user-select": ""
                })
            }))
        }

        function ot(t) {
            R(t)(window, "resize", k(t.update.bind(t), 300))
        }

        function it(t) {
            var n, e = R(t),
                r = t.containerEl,
                o = t.contentEl,
                i = t.offset,
                u = t.limit,
                c = !1;
            e(window, "mousemove", (function (e) {
                c && (cancelAnimationFrame(n), function e(r) {
                    var o = r.x,
                        c = r.y;
                    (o || c) && (t.setMomentum(O(i.x + o, 0, u.x) - i.x, O(i.y + c, 0, u.y) - i.y), n = requestAnimationFrame((function () {
                        e({
                            x: o,
                            y: c
                        })
                    })))
                }(function (t, n) {
                    var e = t.bounding,
                        r = e.top,
                        o = e.right,
                        i = e.bottom,
                        u = e.left,
                        c = F(n),
                        s = c.x,
                        a = c.y,
                        f = {
                            x: 0,
                            y: 0
                        };
                    return 0 === s && 0 === a || (s > o - 20 ? f.x = s - o + 20 : s < u + 20 && (f.x = s - u - 20), a > i - 20 ? f.y = a - i + 20 : a < r + 20 && (f.y = a - r - 20), f.x *= 2, f.y *= 2), f
                }(t, e)))
            })), e(o, "selectstart", (function (t) {
                t.stopPropagation(), cancelAnimationFrame(n), c = !0
            })), e(window, "mouseup blur", (function () {
                cancelAnimationFrame(n), c = !1
            })), e(r, "scroll", (function (t) {
                t.preventDefault(), r.scrollTop = r.scrollLeft = 0
            }))
        }

        function ut(t) {
            var n, e = /Android/.test(navigator.userAgent) ? 3 : 2,
                r = t.options.delegateTo || t.containerEl,
                o = new V,
                i = R(t),
                u = 0;
            i(r, "touchstart", (function (e) {
                o.track(e), t.setMomentum(0, 0), 0 === u && (n = t.options.damping, t.options.damping = Math.max(n, .5)), u++
            })), i(r, "touchmove", (function (n) {
                if (!Z || Z === t) {
                    o.update(n);
                    var e = o.getDelta(),
                        r = e.x,
                        i = e.y;
                    t.addTransformableMomentum(r, i, n, (function (e) {
                        e && (n.preventDefault(), Z = t)
                    }))
                }
            })), i(r, "touchcancel touchend", (function (r) {
                var i = o.getVelocity(),
                    c = {
                        x: 0,
                        y: 0
                    };
                Object.keys(i).forEach((function (t) {
                    var r = i[t] / n;
                    c[t] = Math.abs(r) < 50 ? 0 : r * e
                })), t.addTransformableMomentum(c.x, c.y, r), 0 == --u && (t.options.damping = n), o.release(r), Z = null
            }))
        }

        function ct(t) {
            R(t)(t.options.delegateTo || t.containerEl, "onwheel" in window || document.implementation.hasFeature("Events.wheel", "3.0") ? "wheel" : "mousewheel", (function (n) {
                var e = function (t) {
                        if ("deltaX" in t) {
                            var n = ft(t.deltaMode);
                            return {
                                x: t.deltaX / st.STANDARD * n,
                                y: t.deltaY / st.STANDARD * n
                            }
                        }
                        return "wheelDeltaX" in t ? {
                            x: t.wheelDeltaX / st.OTHERS,
                            y: t.wheelDeltaY / st.OTHERS
                        } : {
                            x: 0,
                            y: t.wheelDelta / st.OTHERS
                        }
                    }(n),
                    r = e.x,
                    o = e.y;
                t.addTransformableMomentum(r, o, n, (function (t) {
                    t && n.preventDefault()
                }))
            }))
        }! function (t) {
            t[t.TAB = 9] = "TAB", t[t.SPACE = 32] = "SPACE", t[t.PAGE_UP = 33] = "PAGE_UP", t[t.PAGE_DOWN = 34] = "PAGE_DOWN", t[t.END = 35] = "END", t[t.HOME = 36] = "HOME", t[t.LEFT = 37] = "LEFT", t[t.UP = 38] = "UP", t[t.RIGHT = 39] = "RIGHT", t[t.DOWN = 40] = "DOWN"
        }(J || (J = {})),
        function (t) {
            t[t.X = 0] = "X", t[t.Y = 1] = "Y"
        }(Q || (Q = {}));
        var st = {
                STANDARD: 1,
                OTHERS: -3
            },
            at = [1, 28, 500],
            ft = function (t) {
                return at[t] || at[0]
            },
            lt = new Map,
            pt = function () {
                function t(t, n) {
                    var e = this;
                    this.offset = {
                        x: 0,
                        y: 0
                    }, this.limit = {
                        x: 1 / 0,
                        y: 1 / 0
                    }, this.bounding = {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }, this._plugins = [], this._momentum = {
                        x: 0,
                        y: 0
                    }, this._listeners = new Set, this.containerEl = t;
                    var r = this.contentEl = document.createElement("div");
                    this.options = new N(n), t.setAttribute("data-scrollbar", "true"), t.setAttribute("tabindex", "-1"), B(t, {
                        overflow: "hidden",
                        outline: "none"
                    }), window.navigator.msPointerEnabled && (t.style.msTouchAction = "none"), r.className = "scroll-content", Array.from(t.childNodes).forEach((function (t) {
                        r.appendChild(t)
                    })), t.appendChild(r), this.track = new q(this), this.size = this.getSize(), this._plugins = function (t, n) {
                        return Array.from(nt.order).filter((function (t) {
                            return !1 !== n[t]
                        })).map((function (e) {
                            var r = new(0, nt.constructors[e])(t, n[e]);
                            return n[e] = r.options, r
                        }))
                    }(this, this.options.plugins);
                    var o = t.scrollLeft,
                        i = t.scrollTop;
                    t.scrollLeft = t.scrollTop = 0, this.setPosition(o, i, {
                        withoutCallbacks: !0
                    });
                    var u = window,
                        c = u.MutationObserver || u.WebKitMutationObserver || u.MozMutationObserver;
                    "function" == typeof c && (this._observer = new c((function () {
                        e.update()
                    })), this._observer.observe(r, {
                        subtree: !0,
                        childList: !0
                    })), lt.set(t, this), requestAnimationFrame((function () {
                        e._init()
                    }))
                }
                return Object.defineProperty(t.prototype, "parent", {
                    get: function () {
                        for (var t = this.containerEl.parentElement; t;) {
                            var n = lt.get(t);
                            if (n) return n;
                            t = t.parentElement
                        }
                        return null
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "scrollTop", {
                    get: function () {
                        return this.offset.y
                    },
                    set: function (t) {
                        this.setPosition(this.scrollLeft, t)
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(t.prototype, "scrollLeft", {
                    get: function () {
                        return this.offset.x
                    },
                    set: function (t) {
                        this.setPosition(t, this.scrollTop)
                    },
                    enumerable: !0,
                    configurable: !0
                }), t.prototype.getSize = function () {
                    return function (t) {
                        var n = t.containerEl,
                            e = t.contentEl;
                        return {
                            container: {
                                width: n.clientWidth,
                                height: n.clientHeight
                            },
                            content: {
                                width: e.offsetWidth - e.clientWidth + e.scrollWidth,
                                height: e.offsetHeight - e.clientHeight + e.scrollHeight
                            }
                        }
                    }(this)
                }, t.prototype.update = function () {
                    ! function (t) {
                        var n = t.getSize(),
                            e = {
                                x: Math.max(n.content.width - n.container.width, 0),
                                y: Math.max(n.content.height - n.container.height, 0)
                            },
                            r = t.containerEl.getBoundingClientRect(),
                            o = {
                                top: Math.max(r.top, 0),
                                right: Math.min(r.right, window.innerWidth),
                                bottom: Math.min(r.bottom, window.innerHeight),
                                left: Math.max(r.left, 0)
                            };
                        t.size = n, t.limit = e, t.bounding = o, t.track.update(), t.setPosition()
                    }(this), this._plugins.forEach((function (t) {
                        t.onUpdate()
                    }))
                }, t.prototype.isVisible = function (t) {
                    return function (t, n) {
                        var e = t.bounding,
                            r = n.getBoundingClientRect(),
                            o = Math.max(e.top, r.top),
                            i = Math.max(e.left, r.left),
                            u = Math.min(e.right, r.right);
                        return o < Math.min(e.bottom, r.bottom) && i < u
                    }(this, t)
                }, t.prototype.setPosition = function (t, n, e) {
                    var r = this;
                    void 0 === t && (t = this.offset.x), void 0 === n && (n = this.offset.y), void 0 === e && (e = {});
                    var o = function (t, n, e) {
                        var r = t.options,
                            o = t.offset,
                            u = t.limit,
                            c = t.track,
                            s = t.contentEl;
                        return r.renderByPixels && (n = Math.round(n), e = Math.round(e)), n = O(n, 0, u.x), e = O(e, 0, u.y), n !== o.x && c.xAxis.show(), e !== o.y && c.yAxis.show(), r.alwaysShowTracks || c.autoHideOnIdle(), n === o.x && e === o.y ? null : (o.x = n, o.y = e, B(s, {
                            "-transform": "translate3d(" + -n + "px, " + -e + "px, 0)"
                        }), c.update(), {
                            offset: i({}, o),
                            limit: i({}, u)
                        })
                    }(this, t, n);
                    o && !e.withoutCallbacks && this._listeners.forEach((function (t) {
                        t.call(r, o)
                    }))
                }, t.prototype.scrollTo = function (t, n, e, r) {
                    void 0 === t && (t = this.offset.x), void 0 === n && (n = this.offset.y), void 0 === e && (e = 0), void 0 === r && (r = {}),
                        function (t, n, e, r, o) {
                            void 0 === r && (r = 0);
                            var i = void 0 === o ? {} : o,
                                u = i.easing,
                                c = void 0 === u ? $ : u,
                                s = i.callback,
                                a = t.options,
                                f = t.offset,
                                l = t.limit;
                            a.renderByPixels && (n = Math.round(n), e = Math.round(e));
                            var p = f.x,
                                h = f.y,
                                d = O(n, 0, l.x) - p,
                                v = O(e, 0, l.y) - h,
                                y = Date.now();
                            cancelAnimationFrame(K.get(t)),
                                function n() {
                                    var e = Date.now() - y,
                                        o = r ? c(Math.min(e / r, 1)) : 1;
                                    if (t.setPosition(p + d * o, h + v * o), e >= r) "function" == typeof s && s.call(t);
                                    else {
                                        var i = requestAnimationFrame(n);
                                        K.set(t, i)
                                    }
                                }()
                        }(this, t, n, e, r)
                }, t.prototype.scrollIntoView = function (t, n) {
                    void 0 === n && (n = {}),
                        function (t, n, e) {
                            var r = void 0 === e ? {} : e,
                                o = r.alignToTop,
                                i = void 0 === o || o,
                                u = r.onlyScrollIfNeeded,
                                c = void 0 !== u && u,
                                s = r.offsetTop,
                                a = void 0 === s ? 0 : s,
                                f = r.offsetLeft,
                                l = void 0 === f ? 0 : f,
                                p = r.offsetBottom,
                                h = void 0 === p ? 0 : p,
                                d = t.containerEl,
                                v = t.bounding,
                                y = t.offset,
                                m = t.limit;
                            if (n && d.contains(n)) {
                                var g = n.getBoundingClientRect();
                                if (!c || !t.isVisible(n)) {
                                    var b = i ? g.top - v.top - a : g.bottom - v.bottom + h;
                                    t.setMomentum(g.left - v.left - l, O(b, -y.y, m.y - y.y))
                                }
                            }
                        }(this, t, n)
                }, t.prototype.addListener = function (t) {
                    if ("function" != typeof t) throw new TypeError("[smooth-scrollbar] scrolling listener should be a function");
                    this._listeners.add(t)
                }, t.prototype.removeListener = function (t) {
                    this._listeners.delete(t)
                }, t.prototype.addTransformableMomentum = function (t, n, e, r) {
                    this._updateDebounced();
                    var o = this._plugins.reduce((function (t, n) {
                            return n.transformDelta(t, e) || t
                        }), {
                            x: t,
                            y: n
                        }),
                        i = !this._shouldPropagateMomentum(o.x, o.y);
                    i && this.addMomentum(o.x, o.y), r && r.call(this, i)
                }, t.prototype.addMomentum = function (t, n) {
                    this.setMomentum(this._momentum.x + t, this._momentum.y + n)
                }, t.prototype.setMomentum = function (t, n) {
                    0 === this.limit.x && (t = 0), 0 === this.limit.y && (n = 0), this.options.renderByPixels && (t = Math.round(t), n = Math.round(n)), this._momentum.x = t, this._momentum.y = n
                }, t.prototype.updatePluginOptions = function (t, n) {
                    this._plugins.forEach((function (e) {
                        e.name === t && Object.assign(e.options, n)
                    }))
                }, t.prototype.destroy = function () {
                    var t = this.containerEl,
                        n = this.contentEl;
                    ! function (t) {
                        var n = z.get(t);
                        n && (n.forEach((function (t) {
                            var n = t.elem,
                                e = t.eventName,
                                r = t.handler;
                            n.removeEventListener(e, r, C())
                        })), z.delete(t))
                    }(this), this._listeners.clear(), this.setMomentum(0, 0), cancelAnimationFrame(this._renderID), this._observer && this._observer.disconnect(), lt.delete(this.containerEl);
                    for (var e = Array.from(n.childNodes); t.firstChild;) t.removeChild(t.firstChild);
                    e.forEach((function (n) {
                        t.appendChild(n)
                    })), B(t, {
                        overflow: ""
                    }), t.scrollTop = this.scrollTop, t.scrollLeft = this.scrollLeft, this._plugins.forEach((function (t) {
                        t.onDestroy()
                    })), this._plugins.length = 0
                }, t.prototype._init = function () {
                    var t = this;
                    this.update(), Object.keys(r).forEach((function (n) {
                        r[n](t)
                    })), this._plugins.forEach((function (t) {
                        t.onInit()
                    })), this._render()
                }, t.prototype._updateDebounced = function () {
                    this.update()
                }, t.prototype._shouldPropagateMomentum = function (t, n) {
                    void 0 === t && (t = 0), void 0 === n && (n = 0);
                    var e = this.options,
                        r = this.offset,
                        o = this.limit;
                    if (!e.continuousScrolling) return !1;
                    0 === o.x && 0 === o.y && this._updateDebounced();
                    var i = O(t + r.x, 0, o.x),
                        u = O(n + r.y, 0, o.y),
                        c = !0;
                    return (c = (c = c && i === r.x) && u === r.y) && (r.x === o.x || 0 === r.x || r.y === o.y || 0 === r.y)
                }, t.prototype._render = function () {
                    var t = this._momentum;
                    if (t.x || t.y) {
                        var n = this._nextTick("x"),
                            e = this._nextTick("y");
                        t.x = n.momentum, t.y = e.momentum, this.setPosition(n.position, e.position)
                    }
                    var r = i({}, this._momentum);
                    this._plugins.forEach((function (t) {
                        t.onRender(r)
                    })), this._renderID = requestAnimationFrame(this._render.bind(this))
                }, t.prototype._nextTick = function (t) {
                    var n = this.options,
                        e = this.offset,
                        r = this._momentum,
                        o = e[t],
                        i = r[t];
                    if (Math.abs(i) <= .1) return {
                        momentum: 0,
                        position: o + i
                    };
                    var u = i * (1 - n.damping);
                    return n.renderByPixels && (u |= 0), {
                        momentum: u,
                        position: o + i - u
                    }
                }, u([D(100, {
                    leading: !0
                })], t.prototype, "_updateDebounced", null), t
            }(),
            ht = "smooth-scrollbar-style",
            dt = !1;

        function vt() {
            if (!dt && "undefined" != typeof window) {
                var t = document.createElement("style");
                t.id = ht, t.textContent = "\n[data-scrollbar] {\n  display: block;\n  position: relative;\n}\n\n.scroll-content {\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n}\n\n.scrollbar-track {\n  position: absolute;\n  opacity: 0;\n  z-index: 1;\n  background: rgba(222, 222, 222, .75);\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -webkit-transition: opacity 0.5s 0.5s ease-out;\n          transition: opacity 0.5s 0.5s ease-out;\n}\n.scrollbar-track.show,\n.scrollbar-track:hover {\n  opacity: 1;\n  -webkit-transition-delay: 0s;\n          transition-delay: 0s;\n}\n\n.scrollbar-track-x {\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 8px;\n}\n.scrollbar-track-y {\n  top: 0;\n  right: 0;\n  width: 8px;\n  height: 100%;\n}\n.scrollbar-thumb {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 8px;\n  height: 8px;\n  background: rgba(0, 0, 0, .5);\n  border-radius: 4px;\n}\n", document.head && document.head.appendChild(t), dt = !0
            }
        }
        e.d(n, "ScrollbarPlugin", (function () {
            return tt
        }));
        /*!
         * cast `I.Scrollbar` to `Scrollbar` to avoid error
         *
         * `I.Scrollbar` is not assignable to `Scrollbar`:
         *     "privateProp" is missing in `I.Scrollbar`
         *
         * @see https://github.com/Microsoft/TypeScript/issues/2672
         */
        var yt = function (t) {
            function n() {
                return null !== t && t.apply(this, arguments) || this
            }
            return function (t, n) {
                function e() {
                    this.constructor = t
                }
                o(t, n), t.prototype = null === n ? Object.create(n) : (e.prototype = n.prototype, new e)
            }(n, t), n.init = function (t, n) {
                if (!t || 1 !== t.nodeType) throw new TypeError("expect element to be DOM Element, but got " + t);
                return vt(), lt.has(t) ? lt.get(t) : new pt(t, n)
            }, n.initAll = function (t) {
                return Array.from(document.querySelectorAll("[data-scrollbar]"), (function (e) {
                    return n.init(e, t)
                }))
            }, n.has = function (t) {
                return lt.has(t)
            }, n.get = function (t) {
                return lt.get(t)
            }, n.getAll = function () {
                return Array.from(lt.values())
            }, n.destroy = function (t) {
                var n = lt.get(t);
                n && n.destroy()
            }, n.destroyAll = function () {
                lt.forEach((function (t) {
                    t.destroy()
                }))
            }, n.use = function () {
                for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                return function () {
                    for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
                    t.forEach((function (t) {
                        var n = t.pluginName;
                        if (!n) throw new TypeError("plugin name is required");
                        nt.order.add(n), nt.constructors[n] = t
                    }))
                }.apply(void 0, t)
            }, n.attachStyle = function () {
                return vt()
            }, n.detachStyle = function () {
                return function () {
                    if (dt && "undefined" != typeof window) {
                        var t = document.getElementById(ht);
                        t && t.parentNode && (t.parentNode.removeChild(t), dt = !1)
                    }
                }()
            }, n.version = "8.5.2", n.ScrollbarPlugin = tt, n
        }(pt);
        n.default = yt
    }]).default
}));;
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.AOS=t():e.AOS=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="dist/",t(0)}([function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r=n(1),a=(o(r),n(6)),u=o(a),c=n(7),f=o(c),s=n(8),d=o(s),l=n(9),p=o(l),m=n(10),b=o(m),v=n(11),y=o(v),g=n(14),h=o(g),w=[],k=!1,x={offset:120,delay:0,easing:"ease",duration:400,disable:!1,once:!1,startEvent:"DOMContentLoaded",throttleDelay:99,debounceDelay:50,disableMutationObserver:!1},j=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(e&&(k=!0),k)return w=(0,y.default)(w,x),(0,b.default)(w,x.once),w},O=function(){w=(0,h.default)(),j()},_=function(){w.forEach(function(e,t){e.node.removeAttribute("data-aos"),e.node.removeAttribute("data-aos-easing"),e.node.removeAttribute("data-aos-duration"),e.node.removeAttribute("data-aos-delay")})},S=function(e){return e===!0||"mobile"===e&&p.default.mobile()||"phone"===e&&p.default.phone()||"tablet"===e&&p.default.tablet()||"function"==typeof e&&e()===!0},z=function(e){x=i(x,e),w=(0,h.default)();var t=document.all&&!window.atob;return S(x.disable)||t?_():(document.querySelector("body").setAttribute("data-aos-easing",x.easing),document.querySelector("body").setAttribute("data-aos-duration",x.duration),document.querySelector("body").setAttribute("data-aos-delay",x.delay),"DOMContentLoaded"===x.startEvent&&["complete","interactive"].indexOf(document.readyState)>-1?j(!0):"load"===x.startEvent?window.addEventListener(x.startEvent,function(){j(!0)}):document.addEventListener(x.startEvent,function(){j(!0)}),window.addEventListener("resize",(0,f.default)(j,x.debounceDelay,!0)),window.addEventListener("orientationchange",(0,f.default)(j,x.debounceDelay,!0)),window.addEventListener("scroll",(0,u.default)(function(){(0,b.default)(w,x.once)},x.throttleDelay)),x.disableMutationObserver||(0,d.default)("[data-aos]",O),w)};e.exports={init:z,refresh:j,refreshHard:O}},function(e,t){},,,,,function(e,t){(function(t){"use strict";function n(e,t,n){function o(t){var n=b,o=v;return b=v=void 0,k=t,g=e.apply(o,n)}function r(e){return k=e,h=setTimeout(s,t),_?o(e):g}function a(e){var n=e-w,o=e-k,i=t-n;return S?j(i,y-o):i}function c(e){var n=e-w,o=e-k;return void 0===w||n>=t||n<0||S&&o>=y}function s(){var e=O();return c(e)?d(e):void(h=setTimeout(s,a(e)))}function d(e){return h=void 0,z&&b?o(e):(b=v=void 0,g)}function l(){void 0!==h&&clearTimeout(h),k=0,b=w=v=h=void 0}function p(){return void 0===h?g:d(O())}function m(){var e=O(),n=c(e);if(b=arguments,v=this,w=e,n){if(void 0===h)return r(w);if(S)return h=setTimeout(s,t),o(w)}return void 0===h&&(h=setTimeout(s,t)),g}var b,v,y,g,h,w,k=0,_=!1,S=!1,z=!0;if("function"!=typeof e)throw new TypeError(f);return t=u(t)||0,i(n)&&(_=!!n.leading,S="maxWait"in n,y=S?x(u(n.maxWait)||0,t):y,z="trailing"in n?!!n.trailing:z),m.cancel=l,m.flush=p,m}function o(e,t,o){var r=!0,a=!0;if("function"!=typeof e)throw new TypeError(f);return i(o)&&(r="leading"in o?!!o.leading:r,a="trailing"in o?!!o.trailing:a),n(e,t,{leading:r,maxWait:t,trailing:a})}function i(e){var t="undefined"==typeof e?"undefined":c(e);return!!e&&("object"==t||"function"==t)}function r(e){return!!e&&"object"==("undefined"==typeof e?"undefined":c(e))}function a(e){return"symbol"==("undefined"==typeof e?"undefined":c(e))||r(e)&&k.call(e)==d}function u(e){if("number"==typeof e)return e;if(a(e))return s;if(i(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=i(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(l,"");var n=m.test(e);return n||b.test(e)?v(e.slice(2),n?2:8):p.test(e)?s:+e}var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},f="Expected a function",s=NaN,d="[object Symbol]",l=/^\s+|\s+$/g,p=/^[-+]0x[0-9a-f]+$/i,m=/^0b[01]+$/i,b=/^0o[0-7]+$/i,v=parseInt,y="object"==("undefined"==typeof t?"undefined":c(t))&&t&&t.Object===Object&&t,g="object"==("undefined"==typeof self?"undefined":c(self))&&self&&self.Object===Object&&self,h=y||g||Function("return this")(),w=Object.prototype,k=w.toString,x=Math.max,j=Math.min,O=function(){return h.Date.now()};e.exports=o}).call(t,function(){return this}())},function(e,t){(function(t){"use strict";function n(e,t,n){function i(t){var n=b,o=v;return b=v=void 0,O=t,g=e.apply(o,n)}function r(e){return O=e,h=setTimeout(s,t),_?i(e):g}function u(e){var n=e-w,o=e-O,i=t-n;return S?x(i,y-o):i}function f(e){var n=e-w,o=e-O;return void 0===w||n>=t||n<0||S&&o>=y}function s(){var e=j();return f(e)?d(e):void(h=setTimeout(s,u(e)))}function d(e){return h=void 0,z&&b?i(e):(b=v=void 0,g)}function l(){void 0!==h&&clearTimeout(h),O=0,b=w=v=h=void 0}function p(){return void 0===h?g:d(j())}function m(){var e=j(),n=f(e);if(b=arguments,v=this,w=e,n){if(void 0===h)return r(w);if(S)return h=setTimeout(s,t),i(w)}return void 0===h&&(h=setTimeout(s,t)),g}var b,v,y,g,h,w,O=0,_=!1,S=!1,z=!0;if("function"!=typeof e)throw new TypeError(c);return t=a(t)||0,o(n)&&(_=!!n.leading,S="maxWait"in n,y=S?k(a(n.maxWait)||0,t):y,z="trailing"in n?!!n.trailing:z),m.cancel=l,m.flush=p,m}function o(e){var t="undefined"==typeof e?"undefined":u(e);return!!e&&("object"==t||"function"==t)}function i(e){return!!e&&"object"==("undefined"==typeof e?"undefined":u(e))}function r(e){return"symbol"==("undefined"==typeof e?"undefined":u(e))||i(e)&&w.call(e)==s}function a(e){if("number"==typeof e)return e;if(r(e))return f;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(d,"");var n=p.test(e);return n||m.test(e)?b(e.slice(2),n?2:8):l.test(e)?f:+e}var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c="Expected a function",f=NaN,s="[object Symbol]",d=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,p=/^0b[01]+$/i,m=/^0o[0-7]+$/i,b=parseInt,v="object"==("undefined"==typeof t?"undefined":u(t))&&t&&t.Object===Object&&t,y="object"==("undefined"==typeof self?"undefined":u(self))&&self&&self.Object===Object&&self,g=v||y||Function("return this")(),h=Object.prototype,w=h.toString,k=Math.max,x=Math.min,j=function(){return g.Date.now()};e.exports=n}).call(t,function(){return this}())},function(e,t){"use strict";function n(e,t){var n=window.document,r=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,a=new r(o);i=t,a.observe(n.documentElement,{childList:!0,subtree:!0,removedNodes:!0})}function o(e){e&&e.forEach(function(e){var t=Array.prototype.slice.call(e.addedNodes),n=Array.prototype.slice.call(e.removedNodes),o=t.concat(n).filter(function(e){return e.hasAttribute&&e.hasAttribute("data-aos")}).length;o&&i()})}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){};t.default=n},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(){return navigator.userAgent||navigator.vendor||window.opera||""}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,a=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,u=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,c=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,f=function(){function e(){n(this,e)}return i(e,[{key:"phone",value:function(){var e=o();return!(!r.test(e)&&!a.test(e.substr(0,4)))}},{key:"mobile",value:function(){var e=o();return!(!u.test(e)&&!c.test(e.substr(0,4)))}},{key:"tablet",value:function(){return this.mobile()&&!this.phone()}}]),e}();t.default=new f},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e,t,n){var o=e.node.getAttribute("data-aos-once");t>e.position?e.node.classList.add("aos-animate"):"undefined"!=typeof o&&("false"===o||!n&&"true"!==o)&&e.node.classList.remove("aos-animate")},o=function(e,t){var o=window.pageYOffset,i=window.innerHeight;e.forEach(function(e,r){n(e,i+o,t)})};t.default=o},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(12),r=o(i),a=function(e,t){return e.forEach(function(e,n){e.node.classList.add("aos-init"),e.position=(0,r.default)(e.node,t.offset)}),e};t.default=a},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(13),r=o(i),a=function(e,t){var n=0,o=0,i=window.innerHeight,a={offset:e.getAttribute("data-aos-offset"),anchor:e.getAttribute("data-aos-anchor"),anchorPlacement:e.getAttribute("data-aos-anchor-placement")};switch(a.offset&&!isNaN(a.offset)&&(o=parseInt(a.offset)),a.anchor&&document.querySelectorAll(a.anchor)&&(e=document.querySelectorAll(a.anchor)[0]),n=(0,r.default)(e).top,a.anchorPlacement){case"top-bottom":break;case"center-bottom":n+=e.offsetHeight/2;break;case"bottom-bottom":n+=e.offsetHeight;break;case"top-center":n+=i/2;break;case"bottom-center":n+=i/2+e.offsetHeight;break;case"center-center":n+=i/2+e.offsetHeight/2;break;case"top-top":n+=i;break;case"bottom-top":n+=e.offsetHeight+i;break;case"center-top":n+=e.offsetHeight/2+i}return a.anchorPlacement||a.offset||isNaN(t)||(o=t),n+o};t.default=a},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){for(var t=0,n=0;e&&!isNaN(e.offsetLeft)&&!isNaN(e.offsetTop);)t+=e.offsetLeft-("BODY"!=e.tagName?e.scrollLeft:0),n+=e.offsetTop-("BODY"!=e.tagName?e.scrollTop:0),e=e.offsetParent;return{top:n,left:t}};t.default=n},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return e=e||document.querySelectorAll("[data-aos]"),Array.prototype.map.call(e,function(e){return{node:e}})};t.default=n}])});;

// scroll 

$(window).scroll(function () {
	if ($(window).scrollTop() > 300) {
		$('.navbar').addClass('fixed');
	} else if (!menu.classList.contains('show')) {
		$('.navbar').removeClass('fixed');
	};
	if ($(window).scrollTop() > 305) {
		$('.navbar').addClass('transition');
	} else if (!menu.classList.contains('show')) {
		$('.navbar').removeClass('transition');
	}
	if ($(window).scrollTop() > 600) {
		$('.navbar').addClass('opacity');
	} else if (!menu.classList.contains('show')) {
		$('.navbar').removeClass('opacity');
	}
});

// spoiler 
$('.spoiler').click(function(event){
	$(this).toggleClass('spoiler_active').next().slideToggle(300);
});

// selector
const ItemSelect = document.querySelectorAll('.form__select');

ItemSelect.forEach(item=>{
    const ItemSelectTitle = item.querySelector('.form__select-title');
    const ItemSelectInput = item.querySelector('input');
    const selectItem = item.querySelectorAll('.select-item');
    selectItem.forEach(itemSelect=>{
        itemSelect.addEventListener('click',()=>{
            ItemSelectTitle.textContent = itemSelect.textContent;
            ItemSelectInput.value = itemSelect.textContent;
            $(ItemSelectTitle).toggleClass('spoiler_active').next().slideToggle(300);
        })
    })
});

// Scrollsmooth

var Scrollbar = window.Scrollbar;
	const scrollbar = document.querySelectorAll('.my-scrollbar');
	scrollbar.forEach(item=>{
		Scrollbar.init(item, {
			alwaysShowTracks:true});
	});


//RANGE
$(function() {
    
    var $document = $(document);
    var selector = '[data-rangeslider]';
    var $element = $(selector);

    // For ie8 support
    var textContent = ('textContent' in document) ? 'textContent' : 'innerText';

    // Example functionality to demonstrate a value feedback
    function valueOutput(element) {
        var value = element.value;
        var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
        output[textContent] = value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    }

    $document.on('input', 'input[type="range"], ' + selector, function(e) {
        valueOutput(e.target);
    });




    // Example functionality to demonstrate programmatic attribute changes
    $document.on('click', '#js-example-change-attributes button', function(e) {
        var $inputRange = $(selector, e.target.parentNode);
        var attributes = {
                min: $('input[name="min"]', e.target.parentNode)[0].value,
                max: $('input[name="max"]', e.target.parentNode)[0].value,
                step: $('input[name="step"]', e.target.parentNode)[0].value
            };

        $inputRange.attr(attributes);
        $inputRange.rangeslider('update', true);
    });

    // Basic rangeslider initialization
    $element.rangeslider({

        // Deactivate the feature detection
        polyfill: false,

        // Callback function
        onInit: function() {
            valueOutput(this.$element[0]);
        },

 
    });

});
[].forEach.call(document.getElementsByClassName('fixNumber'), e => e.textContent = e.textContent.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));


new Swiper('.slider__advantages',{
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        200:{
            slidesPerView: 1,
        },
        568:{
            slidesPerView: 2,
            effect: 'slide',
        },
        992:{
            slidesPerView: 3,
        }
    },
    slidesPerView: 2,
    watchOverflow: true,
    spaceBetween: 50,
    
}
);

AOS.init();;



function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    
    testWebP(function (support) {
    
    if (support == true) {
    document.querySelector('body').classList.add('webp');
    }else{
    document.querySelector('body').classList.add('no-webp');
    }
});