(function () {
	'use strict';

	function _mergeNamespaces(n, m) {
		m.forEach(function (e) {
			e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
				if (k !== 'default' && !(k in n)) {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		});
		return Object.freeze(n);
	}

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				var isInstance = false;
	      try {
	        isInstance = this instanceof a;
	      } catch {}
				if (isInstance) {
	        return Reflect.construct(f, arguments, this.constructor);
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var lib$4 = {};

	var global$1 = (typeof global !== "undefined" ? global :
	  typeof self !== "undefined" ? self :
	  typeof window !== "undefined" ? window : {});

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;
	if (typeof global$1.setTimeout === 'function') {
	    cachedSetTimeout = setTimeout;
	}
	if (typeof global$1.clearTimeout === 'function') {
	    cachedClearTimeout = clearTimeout;
	}

	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	function nextTick(fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	var title = 'browser';
	var platform = 'browser';
	var browser$1 = true;
	var env = {};
	var argv = [];
	var version$1 = ''; // empty string to avoid regexp issues
	var versions = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;

	function binding(name) {
	    throw new Error('process.binding is not supported');
	}

	function cwd () { return '/' }
	function chdir (dir) {
	    throw new Error('process.chdir is not supported');
	}function umask() { return 0; }

	// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
	var performance = global$1.performance || {};
	var performanceNow =
	  performance.now        ||
	  performance.mozNow     ||
	  performance.msNow      ||
	  performance.oNow       ||
	  performance.webkitNow  ||
	  function(){ return (new Date()).getTime() };

	// generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime
	function hrtime(previousTimestamp){
	  var clocktime = performanceNow.call(performance)*1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor((clocktime%1)*1e9);
	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];
	    if (nanoseconds<0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }
	  return [seconds,nanoseconds]
	}

	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}

	var browser$1$1 = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser$1,
	  env: env,
	  argv: argv,
	  version: version$1,
	  versions: versions,
	  on: on,
	  addListener: addListener,
	  once: once,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	var src = {exports: {}};

	var browser = {exports: {}};

	/**
	 * Helpers.
	 */

	var ms;
	var hasRequiredMs;

	function requireMs () {
		if (hasRequiredMs) return ms;
		hasRequiredMs = 1;
		var s = 1000;
		var m = s * 60;
		var h = m * 60;
		var d = h * 24;
		var w = d * 7;
		var y = d * 365.25;

		/**
		 * Parse or format the given `val`.
		 *
		 * Options:
		 *
		 *  - `long` verbose formatting [false]
		 *
		 * @param {String|Number} val
		 * @param {Object} [options]
		 * @throws {Error} throw an error if val is not a non-empty string or a number
		 * @return {String|Number}
		 * @api public
		 */

		ms = function (val, options) {
		  options = options || {};
		  var type = typeof val;
		  if (type === 'string' && val.length > 0) {
		    return parse(val);
		  } else if (type === 'number' && isFinite(val)) {
		    return options.long ? fmtLong(val) : fmtShort(val);
		  }
		  throw new Error(
		    'val is not a non-empty string or a valid number. val=' +
		      JSON.stringify(val)
		  );
		};

		/**
		 * Parse the given `str` and return milliseconds.
		 *
		 * @param {String} str
		 * @return {Number}
		 * @api private
		 */

		function parse(str) {
		  str = String(str);
		  if (str.length > 100) {
		    return;
		  }
		  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
		    str
		  );
		  if (!match) {
		    return;
		  }
		  var n = parseFloat(match[1]);
		  var type = (match[2] || 'ms').toLowerCase();
		  switch (type) {
		    case 'years':
		    case 'year':
		    case 'yrs':
		    case 'yr':
		    case 'y':
		      return n * y;
		    case 'weeks':
		    case 'week':
		    case 'w':
		      return n * w;
		    case 'days':
		    case 'day':
		    case 'd':
		      return n * d;
		    case 'hours':
		    case 'hour':
		    case 'hrs':
		    case 'hr':
		    case 'h':
		      return n * h;
		    case 'minutes':
		    case 'minute':
		    case 'mins':
		    case 'min':
		    case 'm':
		      return n * m;
		    case 'seconds':
		    case 'second':
		    case 'secs':
		    case 'sec':
		    case 's':
		      return n * s;
		    case 'milliseconds':
		    case 'millisecond':
		    case 'msecs':
		    case 'msec':
		    case 'ms':
		      return n;
		    default:
		      return undefined;
		  }
		}

		/**
		 * Short format for `ms`.
		 *
		 * @param {Number} ms
		 * @return {String}
		 * @api private
		 */

		function fmtShort(ms) {
		  var msAbs = Math.abs(ms);
		  if (msAbs >= d) {
		    return Math.round(ms / d) + 'd';
		  }
		  if (msAbs >= h) {
		    return Math.round(ms / h) + 'h';
		  }
		  if (msAbs >= m) {
		    return Math.round(ms / m) + 'm';
		  }
		  if (msAbs >= s) {
		    return Math.round(ms / s) + 's';
		  }
		  return ms + 'ms';
		}

		/**
		 * Long format for `ms`.
		 *
		 * @param {Number} ms
		 * @return {String}
		 * @api private
		 */

		function fmtLong(ms) {
		  var msAbs = Math.abs(ms);
		  if (msAbs >= d) {
		    return plural(ms, msAbs, d, 'day');
		  }
		  if (msAbs >= h) {
		    return plural(ms, msAbs, h, 'hour');
		  }
		  if (msAbs >= m) {
		    return plural(ms, msAbs, m, 'minute');
		  }
		  if (msAbs >= s) {
		    return plural(ms, msAbs, s, 'second');
		  }
		  return ms + ' ms';
		}

		/**
		 * Pluralization helper.
		 */

		function plural(ms, msAbs, n, name) {
		  var isPlural = msAbs >= n * 1.5;
		  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
		}
		return ms;
	}

	var common;
	var hasRequiredCommon;

	function requireCommon () {
		if (hasRequiredCommon) return common;
		hasRequiredCommon = 1;
		/**
		 * This is the common logic for both the Node.js and web browser
		 * implementations of `debug()`.
		 */

		function setup(env) {
			createDebug.debug = createDebug;
			createDebug.default = createDebug;
			createDebug.coerce = coerce;
			createDebug.disable = disable;
			createDebug.enable = enable;
			createDebug.enabled = enabled;
			createDebug.humanize = requireMs();
			createDebug.destroy = destroy;

			Object.keys(env).forEach(key => {
				createDebug[key] = env[key];
			});

			/**
			* The currently active debug mode names, and names to skip.
			*/

			createDebug.names = [];
			createDebug.skips = [];

			/**
			* Map of special "%n" handling functions, for the debug "format" argument.
			*
			* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
			*/
			createDebug.formatters = {};

			/**
			* Selects a color for a debug namespace
			* @param {String} namespace The namespace string for the debug instance to be colored
			* @return {Number|String} An ANSI color code for the given namespace
			* @api private
			*/
			function selectColor(namespace) {
				let hash = 0;

				for (let i = 0; i < namespace.length; i++) {
					hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
					hash |= 0; // Convert to 32bit integer
				}

				return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
			}
			createDebug.selectColor = selectColor;

			/**
			* Create a debugger with the given `namespace`.
			*
			* @param {String} namespace
			* @return {Function}
			* @api public
			*/
			function createDebug(namespace) {
				let prevTime;
				let enableOverride = null;
				let namespacesCache;
				let enabledCache;

				function debug(...args) {
					// Disabled?
					if (!debug.enabled) {
						return;
					}

					const self = debug;

					// Set `diff` timestamp
					const curr = Number(new Date());
					const ms = curr - (prevTime || curr);
					self.diff = ms;
					self.prev = prevTime;
					self.curr = curr;
					prevTime = curr;

					args[0] = createDebug.coerce(args[0]);

					if (typeof args[0] !== 'string') {
						// Anything else let's inspect with %O
						args.unshift('%O');
					}

					// Apply any `formatters` transformations
					let index = 0;
					args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
						// If we encounter an escaped % then don't increase the array index
						if (match === '%%') {
							return '%';
						}
						index++;
						const formatter = createDebug.formatters[format];
						if (typeof formatter === 'function') {
							const val = args[index];
							match = formatter.call(self, val);

							// Now we need to remove `args[index]` since it's inlined in the `format`
							args.splice(index, 1);
							index--;
						}
						return match;
					});

					// Apply env-specific formatting (colors, etc.)
					createDebug.formatArgs.call(self, args);

					const logFn = self.log || createDebug.log;
					logFn.apply(self, args);
				}

				debug.namespace = namespace;
				debug.useColors = createDebug.useColors();
				debug.color = createDebug.selectColor(namespace);
				debug.extend = extend;
				debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

				Object.defineProperty(debug, 'enabled', {
					enumerable: true,
					configurable: false,
					get: () => {
						if (enableOverride !== null) {
							return enableOverride;
						}
						if (namespacesCache !== createDebug.namespaces) {
							namespacesCache = createDebug.namespaces;
							enabledCache = createDebug.enabled(namespace);
						}

						return enabledCache;
					},
					set: v => {
						enableOverride = v;
					}
				});

				// Env-specific initialization logic for debug instances
				if (typeof createDebug.init === 'function') {
					createDebug.init(debug);
				}

				return debug;
			}

			function extend(namespace, delimiter) {
				const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
				newDebug.log = this.log;
				return newDebug;
			}

			/**
			* Enables a debug mode by namespaces. This can include modes
			* separated by a colon and wildcards.
			*
			* @param {String} namespaces
			* @api public
			*/
			function enable(namespaces) {
				createDebug.save(namespaces);
				createDebug.namespaces = namespaces;

				createDebug.names = [];
				createDebug.skips = [];

				const split = (typeof namespaces === 'string' ? namespaces : '')
					.trim()
					.replace(/\s+/g, ',')
					.split(',')
					.filter(Boolean);

				for (const ns of split) {
					if (ns[0] === '-') {
						createDebug.skips.push(ns.slice(1));
					} else {
						createDebug.names.push(ns);
					}
				}
			}

			/**
			 * Checks if the given string matches a namespace template, honoring
			 * asterisks as wildcards.
			 *
			 * @param {String} search
			 * @param {String} template
			 * @return {Boolean}
			 */
			function matchesTemplate(search, template) {
				let searchIndex = 0;
				let templateIndex = 0;
				let starIndex = -1;
				let matchIndex = 0;

				while (searchIndex < search.length) {
					if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === '*')) {
						// Match character or proceed with wildcard
						if (template[templateIndex] === '*') {
							starIndex = templateIndex;
							matchIndex = searchIndex;
							templateIndex++; // Skip the '*'
						} else {
							searchIndex++;
							templateIndex++;
						}
					} else if (starIndex !== -1) { // eslint-disable-line no-negated-condition
						// Backtrack to the last '*' and try to match more characters
						templateIndex = starIndex + 1;
						matchIndex++;
						searchIndex = matchIndex;
					} else {
						return false; // No match
					}
				}

				// Handle trailing '*' in template
				while (templateIndex < template.length && template[templateIndex] === '*') {
					templateIndex++;
				}

				return templateIndex === template.length;
			}

			/**
			* Disable debug output.
			*
			* @return {String} namespaces
			* @api public
			*/
			function disable() {
				const namespaces = [
					...createDebug.names,
					...createDebug.skips.map(namespace => '-' + namespace)
				].join(',');
				createDebug.enable('');
				return namespaces;
			}

			/**
			* Returns true if the given mode name is enabled, false otherwise.
			*
			* @param {String} name
			* @return {Boolean}
			* @api public
			*/
			function enabled(name) {
				for (const skip of createDebug.skips) {
					if (matchesTemplate(name, skip)) {
						return false;
					}
				}

				for (const ns of createDebug.names) {
					if (matchesTemplate(name, ns)) {
						return true;
					}
				}

				return false;
			}

			/**
			* Coerce `val`.
			*
			* @param {Mixed} val
			* @return {Mixed}
			* @api private
			*/
			function coerce(val) {
				if (val instanceof Error) {
					return val.stack || val.message;
				}
				return val;
			}

			/**
			* XXX DO NOT USE. This is a temporary stub function.
			* XXX It WILL be removed in the next major release.
			*/
			function destroy() {
				console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
			}

			createDebug.enable(createDebug.load());

			return createDebug;
		}

		common = setup;
		return common;
	}

	var hasRequiredBrowser;

	function requireBrowser () {
		if (hasRequiredBrowser) return browser.exports;
		hasRequiredBrowser = 1;
		(function (module, exports) {
			/**
			 * This is the web browser implementation of `debug()`.
			 */

			exports.formatArgs = formatArgs;
			exports.save = save;
			exports.load = load;
			exports.useColors = useColors;
			exports.storage = localstorage();
			exports.destroy = (() => {
				let warned = false;

				return () => {
					if (!warned) {
						warned = true;
						console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
					}
				};
			})();

			/**
			 * Colors.
			 */

			exports.colors = [
				'#0000CC',
				'#0000FF',
				'#0033CC',
				'#0033FF',
				'#0066CC',
				'#0066FF',
				'#0099CC',
				'#0099FF',
				'#00CC00',
				'#00CC33',
				'#00CC66',
				'#00CC99',
				'#00CCCC',
				'#00CCFF',
				'#3300CC',
				'#3300FF',
				'#3333CC',
				'#3333FF',
				'#3366CC',
				'#3366FF',
				'#3399CC',
				'#3399FF',
				'#33CC00',
				'#33CC33',
				'#33CC66',
				'#33CC99',
				'#33CCCC',
				'#33CCFF',
				'#6600CC',
				'#6600FF',
				'#6633CC',
				'#6633FF',
				'#66CC00',
				'#66CC33',
				'#9900CC',
				'#9900FF',
				'#9933CC',
				'#9933FF',
				'#99CC00',
				'#99CC33',
				'#CC0000',
				'#CC0033',
				'#CC0066',
				'#CC0099',
				'#CC00CC',
				'#CC00FF',
				'#CC3300',
				'#CC3333',
				'#CC3366',
				'#CC3399',
				'#CC33CC',
				'#CC33FF',
				'#CC6600',
				'#CC6633',
				'#CC9900',
				'#CC9933',
				'#CCCC00',
				'#CCCC33',
				'#FF0000',
				'#FF0033',
				'#FF0066',
				'#FF0099',
				'#FF00CC',
				'#FF00FF',
				'#FF3300',
				'#FF3333',
				'#FF3366',
				'#FF3399',
				'#FF33CC',
				'#FF33FF',
				'#FF6600',
				'#FF6633',
				'#FF9900',
				'#FF9933',
				'#FFCC00',
				'#FFCC33'
			];

			/**
			 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
			 * and the Firebug extension (any Firefox version) are known
			 * to support "%c" CSS customizations.
			 *
			 * TODO: add a `localStorage` variable to explicitly enable/disable colors
			 */

			// eslint-disable-next-line complexity
			function useColors() {
				// NB: In an Electron preload script, document will be defined but not fully
				// initialized. Since we know we're in Chrome, we'll just detect this case
				// explicitly
				if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
					return true;
				}

				// Internet Explorer and Edge do not support colors.
				if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
					return false;
				}

				let m;

				// Is webkit? http://stackoverflow.com/a/16459606/376773
				// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
				// eslint-disable-next-line no-return-assign
				return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
					// Is firebug? http://stackoverflow.com/a/398120/376773
					(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
					// Is firefox >= v31?
					// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
					(typeof navigator !== 'undefined' && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31) ||
					// Double check webkit in userAgent just in case we are in a worker
					(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
			}

			/**
			 * Colorize log arguments if enabled.
			 *
			 * @api public
			 */

			function formatArgs(args) {
				args[0] = (this.useColors ? '%c' : '') +
					this.namespace +
					(this.useColors ? ' %c' : ' ') +
					args[0] +
					(this.useColors ? '%c ' : ' ') +
					'+' + module.exports.humanize(this.diff);

				if (!this.useColors) {
					return;
				}

				const c = 'color: ' + this.color;
				args.splice(1, 0, c, 'color: inherit');

				// The final "%c" is somewhat tricky, because there could be other
				// arguments passed either before or after the %c, so we need to
				// figure out the correct index to insert the CSS into
				let index = 0;
				let lastC = 0;
				args[0].replace(/%[a-zA-Z%]/g, match => {
					if (match === '%%') {
						return;
					}
					index++;
					if (match === '%c') {
						// We only are interested in the *last* %c
						// (the user may have provided their own)
						lastC = index;
					}
				});

				args.splice(lastC, 0, c);
			}

			/**
			 * Invokes `console.debug()` when available.
			 * No-op when `console.debug` is not a "function".
			 * If `console.debug` is not available, falls back
			 * to `console.log`.
			 *
			 * @api public
			 */
			exports.log = console.debug || console.log || (() => {});

			/**
			 * Save `namespaces`.
			 *
			 * @param {String} namespaces
			 * @api private
			 */
			function save(namespaces) {
				try {
					if (namespaces) {
						exports.storage.setItem('debug', namespaces);
					} else {
						exports.storage.removeItem('debug');
					}
				} catch (error) {
					// Swallow
					// XXX (@Qix-) should we be logging these?
				}
			}

			/**
			 * Load `namespaces`.
			 *
			 * @return {String} returns the previously persisted debug modes
			 * @api private
			 */
			function load() {
				let r;
				try {
					r = exports.storage.getItem('debug') || exports.storage.getItem('DEBUG') ;
				} catch (error) {
					// Swallow
					// XXX (@Qix-) should we be logging these?
				}

				// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
				if (!r && typeof browser$1$1 !== 'undefined' && 'env' in browser$1$1) {
					r = browser$1$1.env.DEBUG;
				}

				return r;
			}

			/**
			 * Localstorage attempts to return the localstorage.
			 *
			 * This is necessary because safari throws
			 * when a user disables cookies/localstorage
			 * and you attempt to access it.
			 *
			 * @return {LocalStorage}
			 * @api private
			 */

			function localstorage() {
				try {
					// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
					// The Browser also has localStorage in the global context.
					return localStorage;
				} catch (error) {
					// Swallow
					// XXX (@Qix-) should we be logging these?
				}
			}

			module.exports = requireCommon()(exports);

			const {formatters} = module.exports;

			/**
			 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
			 */

			formatters.j = function (v) {
				try {
					return JSON.stringify(v);
				} catch (error) {
					return '[UnexpectedJSONParseError]: ' + error.message;
				}
			}; 
		} (browser, browser.exports));
		return browser.exports;
	}

	var hasRequiredSrc;

	function requireSrc () {
		if (hasRequiredSrc) return src.exports;
		hasRequiredSrc = 1;
		{
			src.exports = requireBrowser();
		}
		return src.exports;
	}

	var types = {};

	var Device = {};

	var uaParser$1 = {exports: {}};

	var uaParser = uaParser$1.exports;

	var hasRequiredUaParser;

	function requireUaParser () {
		if (hasRequiredUaParser) return uaParser$1.exports;
		hasRequiredUaParser = 1;
		(function (module, exports) {
			/////////////////////////////////////////////////////////////////////////////////
			/* UAParser.js v2.0.4
			   Copyright © 2012-2025 Faisal Salman <f@faisalman.com>
			   AGPLv3 License *//*
			   Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
			   Supports browser & node.js environment. 
			   Demo   : https://uaparser.dev
			   Source : https://github.com/faisalman/ua-parser-js */
			/////////////////////////////////////////////////////////////////////////////////

			/* jshint esversion: 3 */ 
			/* globals window */

			(function (window, undefined$1) {
			    
			    //////////////
			    // Constants
			    /////////////

			    var LIBVERSION  = '2.0.4',
			        UA_MAX_LENGTH = 500,
			        USER_AGENT  = 'user-agent',
			        EMPTY       = '',
			        UNKNOWN     = '?',

			        // typeof
			        FUNC_TYPE   = 'function',
			        UNDEF_TYPE  = 'undefined',
			        OBJ_TYPE    = 'object',
			        STR_TYPE    = 'string',

			        // properties
			        UA_BROWSER  = 'browser',
			        UA_CPU      = 'cpu',
			        UA_DEVICE   = 'device',
			        UA_ENGINE   = 'engine',
			        UA_OS       = 'os',
			        UA_RESULT   = 'result',
			        
			        NAME        = 'name',
			        TYPE        = 'type',
			        VENDOR      = 'vendor',
			        VERSION     = 'version',
			        ARCHITECTURE= 'architecture',
			        MAJOR       = 'major',
			        MODEL       = 'model',

			        // device types
			        CONSOLE     = 'console',
			        MOBILE      = 'mobile',
			        TABLET      = 'tablet',
			        SMARTTV     = 'smarttv',
			        WEARABLE    = 'wearable',
			        XR          = 'xr',
			        EMBEDDED    = 'embedded',

			        // browser types
			        INAPP       = 'inapp',

			        // client hints
			        BRANDS      = 'brands',
			        FORMFACTORS = 'formFactors',
			        FULLVERLIST = 'fullVersionList',
			        PLATFORM    = 'platform',
			        PLATFORMVER = 'platformVersion',
			        BITNESS     = 'bitness',
			        CH_HEADER   = 'sec-ch-ua',
			        CH_HEADER_FULL_VER_LIST = CH_HEADER + '-full-version-list',
			        CH_HEADER_ARCH      = CH_HEADER + '-arch',
			        CH_HEADER_BITNESS   = CH_HEADER + '-' + BITNESS,
			        CH_HEADER_FORM_FACTORS = CH_HEADER + '-form-factors',
			        CH_HEADER_MOBILE    = CH_HEADER + '-' + MOBILE,
			        CH_HEADER_MODEL     = CH_HEADER + '-' + MODEL,
			        CH_HEADER_PLATFORM  = CH_HEADER + '-' + PLATFORM,
			        CH_HEADER_PLATFORM_VER = CH_HEADER_PLATFORM + '-version',
			        CH_ALL_VALUES       = [BRANDS, FULLVERLIST, MOBILE, MODEL, PLATFORM, PLATFORMVER, ARCHITECTURE, FORMFACTORS, BITNESS],

			        // device vendors
			        AMAZON      = 'Amazon',
			        APPLE       = 'Apple',
			        ASUS        = 'ASUS',
			        BLACKBERRY  = 'BlackBerry',
			        GOOGLE      = 'Google',
			        HUAWEI      = 'Huawei',
			        LENOVO      = 'Lenovo',
			        HONOR       = 'Honor',
			        LG          = 'LG',
			        MICROSOFT   = 'Microsoft',
			        MOTOROLA    = 'Motorola',
			        NVIDIA      = 'Nvidia',
			        ONEPLUS     = 'OnePlus',
			        OPPO        = 'OPPO',
			        SAMSUNG     = 'Samsung',
			        SHARP       = 'Sharp',
			        SONY        = 'Sony',
			        XIAOMI      = 'Xiaomi',
			        ZEBRA       = 'Zebra',

			        // browsers
			        CHROME      = 'Chrome',
			        CHROMIUM    = 'Chromium',
			        CHROMECAST  = 'Chromecast',
			        EDGE        = 'Edge',
			        FIREFOX     = 'Firefox',
			        OPERA       = 'Opera',
			        FACEBOOK    = 'Facebook',
			        SOGOU       = 'Sogou',

			        PREFIX_MOBILE  = 'Mobile ',
			        SUFFIX_BROWSER = ' Browser',

			        // os
			        WINDOWS     = 'Windows';
			   
			    var isWindow            = typeof window !== UNDEF_TYPE,
			        NAVIGATOR           = (isWindow && window.navigator) ? 
			                                window.navigator : 
			                                undefined$1,
			        NAVIGATOR_UADATA    = (NAVIGATOR && NAVIGATOR.userAgentData) ? 
			                                NAVIGATOR.userAgentData : 
			                                undefined$1;

			    ///////////
			    // Helper
			    //////////

			    var extend = function (defaultRgx, extensions) {
			            var mergedRgx = {};
			            var extraRgx = extensions;
			            if (!isExtensions(extensions)) {
			                extraRgx = {};
			                for (var i in extensions) {
			                    for (var j in extensions[i]) {
			                        extraRgx[j] = extensions[i][j].concat(extraRgx[j] ? extraRgx[j] : []);
			                    }
			                }
			            }
			            for (var k in defaultRgx) {
			                mergedRgx[k] = extraRgx[k] && extraRgx[k].length % 2 === 0 ? extraRgx[k].concat(defaultRgx[k]) : defaultRgx[k];
			            }
			            return mergedRgx;
			        },
			        enumerize = function (arr) {
			            var enums = {};
			            for (var i=0; i<arr.length; i++) {
			                enums[arr[i].toUpperCase()] = arr[i];
			            }
			            return enums;
			        },
			        has = function (str1, str2) {
			            if (typeof str1 === OBJ_TYPE && str1.length > 0) {
			                for (var i in str1) {
			                    if (lowerize(str2) == lowerize(str1[i])) return true;
			                }
			                return false;
			            }
			            return isString(str1) ? lowerize(str2) == lowerize(str1) : false;
			        },
			        isExtensions = function (obj, deep) {
			            for (var prop in obj) {
			                return /^(browser|cpu|device|engine|os)$/.test(prop) || (deep ? isExtensions(obj[prop]) : false);
			            }
			        },
			        isString = function (val) {
			            return typeof val === STR_TYPE;
			        },
			        itemListToArray = function (header) {
			            if (!header) return undefined$1;
			            var arr = [];
			            var tokens = strip(/\\?\"/g, header).split(',');
			            for (var i = 0; i < tokens.length; i++) {
			                if (tokens[i].indexOf(';') > -1) {
			                    var token = trim(tokens[i]).split(';v=');
			                    arr[i] = { brand : token[0], version : token[1] };
			                } else {
			                    arr[i] = trim(tokens[i]);
			                }
			            }
			            return arr;
			        },
			        lowerize = function (str) {
			            return isString(str) ? str.toLowerCase() : str;
			        },
			        majorize = function (version) {
			            return isString(version) ? strip(/[^\d\.]/g, version).split('.')[0] : undefined$1;
			        },
			        setProps = function (arr) {
			            for (var i in arr) {
			                var propName = arr[i];
			                if (typeof propName == OBJ_TYPE && propName.length == 2) {
			                    this[propName[0]] = propName[1];
			                } else {
			                    this[propName] = undefined$1;
			                }
			            }
			            return this;
			        },
			        strip = function (pattern, str) {
			            return isString(str) ? str.replace(pattern, EMPTY) : str;
			        },
			        stripQuotes = function (str) {
			            return strip(/\\?\"/g, str); 
			        },
			        trim = function (str, len) {
			            if (isString(str)) {
			                str = strip(/^\s\s*/, str);
			                return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
			            }
			    };

			    ///////////////
			    // Map helper
			    //////////////

			    var rgxMapper = function (ua, arrays) {

			            if(!ua || !arrays) return;

			            var i = 0, j, k, p, q, matches, match;

			            // loop through all regexes maps
			            while (i < arrays.length && !matches) {

			                var regex = arrays[i],       // even sequence (0,2,4,..)
			                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
			                j = k = 0;

			                // try matching uastring with regexes
			                while (j < regex.length && !matches) {

			                    if (!regex[j]) { break; }
			                    matches = regex[j++].exec(ua);

			                    if (!!matches) {
			                        for (p = 0; p < props.length; p++) {
			                            match = matches[++k];
			                            q = props[p];
			                            // check if given property is actually array
			                            if (typeof q === OBJ_TYPE && q.length > 0) {
			                                if (q.length === 2) {
			                                    if (typeof q[1] == FUNC_TYPE) {
			                                        // assign modified match
			                                        this[q[0]] = q[1].call(this, match);
			                                    } else {
			                                        // assign given value, ignore regex match
			                                        this[q[0]] = q[1];
			                                    }
			                                } else if (q.length >= 3) {
			                                    // Check whether q[1] FUNCTION or REGEX
			                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
			                                        if (q.length > 3) {
			                                            this[q[0]] = match ? q[1].apply(this, q.slice(2)) : undefined$1;
			                                        } else {
			                                            // call function (usually string mapper)
			                                            this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined$1;
			                                        }
			                                    } else {
			                                        if (q.length == 3) {
			                                            // sanitize match using given regex
			                                            this[q[0]] = match ? match.replace(q[1], q[2]) : undefined$1;
			                                        } else if (q.length == 4) {
			                                            this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined$1;
			                                        } else if (q.length > 4) {
			                                            this[q[0]] = match ? q[3].apply(this, [match.replace(q[1], q[2])].concat(q.slice(4))) : undefined$1;
			                                        }
			                                    }
			                                }
			                            } else {
			                                this[q] = match ? match : undefined$1;
			                            }
			                        }
			                    }
			                }
			                i += 2;
			            }
			        },

			        strMapper = function (str, map) {

			            for (var i in map) {
			                // check if current value is array
			                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
			                    for (var j = 0; j < map[i].length; j++) {
			                        if (has(map[i][j], str)) {
			                            return (i === UNKNOWN) ? undefined$1 : i;
			                        }
			                    }
			                } else if (has(map[i], str)) {
			                    return (i === UNKNOWN) ? undefined$1 : i;
			                }
			            }
			            return map.hasOwnProperty('*') ? map['*'] : str;
			    };

			    ///////////////
			    // String map
			    //////////////

			    var windowsVersionMap = {
			            'ME'    : '4.90',
			            'NT 3.51': '3.51',
			            'NT 4.0': '4.0',
			            '2000'  : ['5.0', '5.01'],
			            'XP'    : ['5.1', '5.2'],
			            'Vista' : '6.0',
			            '7'     : '6.1',
			            '8'     : '6.2',
			            '8.1'   : '6.3',
			            '10'    : ['6.4', '10.0'],
			            'NT'    : ''
			        },
			        
			        formFactorsMap = {
			            'embedded'  : 'Automotive',
			            'mobile'    : 'Mobile',
			            'tablet'    : ['Tablet', 'EInk'],
			            'smarttv'   : 'TV',
			            'wearable'  : 'Watch',
			            'xr'        : ['VR', 'XR'],
			            '?'         : ['Desktop', 'Unknown'],
			            '*'         : undefined$1
			        },

			        browserHintsMap = {
			            'Chrome'        : 'Google Chrome',
			            'Edge'          : 'Microsoft Edge',
			            'Edge WebView2' : 'Microsoft Edge WebView2',
			            'Chrome WebView': 'Android WebView',
			            'Chrome Headless':'HeadlessChrome',
			            'Huawei Browser': 'HuaweiBrowser',
			            'MIUI Browser'  : 'Miui Browser',
			            'Opera Mobi'    : 'OperaMobile',
			            'Yandex'        : 'YaBrowser'
			    };

			    //////////////
			    // Regex map
			    /////////////

			    var defaultRegexes = {

			        browser : [[

			            // Most common regardless engine
			            /\b(?:crmo|crios)\/([\w\.]+)/i                                      // Chrome for Android/iOS
			            ], [VERSION, [NAME, PREFIX_MOBILE + 'Chrome']], [
			            /webview.+edge\/([\w\.]+)/i                                         // Microsoft Edge
			            ], [VERSION, [NAME, EDGE+' WebView']], [
			            /edg(?:e|ios|a)?\/([\w\.]+)/i                                       
			            ], [VERSION, [NAME, 'Edge']], [

			            // Presto based
			            /(opera mini)\/([-\w\.]+)/i,                                        // Opera Mini
			            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,                 // Opera Mobi/Tablet
			            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i                           // Opera
			            ], [NAME, VERSION], [
			            /opios[\/ ]+([\w\.]+)/i                                             // Opera mini on iphone >= 8.0
			            ], [VERSION, [NAME, OPERA+' Mini']], [
			            /\bop(?:rg)?x\/([\w\.]+)/i                                          // Opera GX
			            ], [VERSION, [NAME, OPERA+' GX']], [
			            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
			            ], [VERSION, [NAME, OPERA]], [

			            // Mixed
			            /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i            // Baidu
			            ], [VERSION, [NAME, 'Baidu']], [
			            /\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i                       // Maxthon
			            ], [VERSION, [NAME, 'Maxthon']], [
			            /(kindle)\/([\w\.]+)/i,                                             // Kindle
			            /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,      
			                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer/Sleipnir
			            // Trident based
			            /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,        // Avant/IEMobile/SlimBrowser/SlimBoat/Slimjet
			            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

			            // Blink/Webkit/KHTML based                                         // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon/LG Browser/Otter/qutebrowser/Dooble
			            /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon|otter|dooble|(?:lg |qute)browser)\/([-\w\.]+)/i,
			                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ//Vivaldi/DuckDuckGo/Klar/Helio/Dragon
			            /(heytap|ovi|115|surf)browser\/([\d\.]+)/i,                         // HeyTap/Ovi/115/Surf
			            /(ecosia|weibo)(?:__| \w+@)([\d\.]+)/i                              // Ecosia/Weibo
			            ], [NAME, VERSION], [
			            /quark(?:pc)?\/([-\w\.]+)/i                                         // Quark
			            ], [VERSION, [NAME, 'Quark']], [
			            /\bddg\/([\w\.]+)/i                                                 // DuckDuckGo
			            ], [VERSION, [NAME, 'DuckDuckGo']], [
			            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
			            ], [VERSION, [NAME, 'UCBrowser']], [
			            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
			            /\bqbcore\/([\w\.]+).+microm/i,
			            /micromessenger\/([\w\.]+)/i                                        // WeChat
			            ], [VERSION, [NAME, 'WeChat']], [
			            /konqueror\/([\w\.]+)/i                                             // Konqueror
			            ], [VERSION, [NAME, 'Konqueror']], [
			            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
			            ], [VERSION, [NAME, 'IE']], [
			            /ya(?:search)?browser\/([\w\.]+)/i                                  // Yandex
			            ], [VERSION, [NAME, 'Yandex']], [
			            /slbrowser\/([\w\.]+)/i                                             // Smart Lenovo Browser
			            ], [VERSION, [NAME, 'Smart ' + LENOVO + SUFFIX_BROWSER]], [
			            /(avast|avg)\/([\w\.]+)/i                                           // Avast/AVG Secure Browser
			            ], [[NAME, /(.+)/, '$1 Secure' + SUFFIX_BROWSER], VERSION], [
			            /\bfocus\/([\w\.]+)/i                                               // Firefox Focus
			            ], [VERSION, [NAME, FIREFOX+' Focus']], [
			            /\bopt\/([\w\.]+)/i                                                 // Opera Touch
			            ], [VERSION, [NAME, OPERA+' Touch']], [
			            /coc_coc\w+\/([\w\.]+)/i                                            // Coc Coc Browser
			            ], [VERSION, [NAME, 'Coc Coc']], [
			            /dolfin\/([\w\.]+)/i                                                // Dolphin
			            ], [VERSION, [NAME, 'Dolphin']], [
			            /coast\/([\w\.]+)/i                                                 // Opera Coast
			            ], [VERSION, [NAME, OPERA+' Coast']], [
			            /miuibrowser\/([\w\.]+)/i                                           // MIUI Browser
			            ], [VERSION, [NAME, 'MIUI' + SUFFIX_BROWSER]], [
			            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
			            ], [VERSION, [NAME, PREFIX_MOBILE + FIREFOX]], [
			            /\bqihoobrowser\/?([\w\.]*)/i                                       // 360
			            ], [VERSION, [NAME, '360']], [
			            /\b(qq)\/([\w\.]+)/i                                                // QQ
			            ], [[NAME, /(.+)/, '$1Browser'], VERSION], [
			            /(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i
			            ], [[NAME, /(.+)/, '$1' + SUFFIX_BROWSER], VERSION], [              // Oculus/Sailfish/HuaweiBrowser/VivoBrowser/PicoBrowser
			            /samsungbrowser\/([\w\.]+)/i                                        // Samsung Internet
			            ], [VERSION, [NAME, SAMSUNG + ' Internet']], [
			            /metasr[\/ ]?([\d\.]+)/i                                            // Sogou Explorer
			            ], [VERSION, [NAME, SOGOU + ' Explorer']], [
			            /(sogou)mo\w+\/([\d\.]+)/i                                          // Sogou Mobile
			            ], [[NAME, SOGOU + ' Mobile'], VERSION], [
			            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
			            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
			            /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i   // QQ/2345
			            ], [NAME, VERSION], [
			            /(lbbrowser|rekonq)/i                                               // LieBao Browser/Rekonq
			            ], [NAME], [
			            /ome\/([\w\.]+) \w* ?(iron) saf/i,                                  // Iron
			            /ome\/([\w\.]+).+qihu (360)[es]e/i                                  // 360
			            ], [VERSION, NAME], [

			            // WebView
			            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
			            ], [[NAME, FACEBOOK], VERSION, [TYPE, INAPP]], [
			            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
			            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
			            /(daum)apps[\/ ]([\w\.]+)/i,                                        // Daum App
			            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
			            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
			            /(alipay)client\/([\w\.]+)/i,                                       // Alipay
			            /(twitter)(?:and| f.+e\/([\w\.]+))/i,                               // Twitter
			            /(instagram|snapchat|klarna)[\/ ]([-\w\.]+)/i                       // Instagram/Snapchat/Klarna
			            ], [NAME, VERSION, [TYPE, INAPP]], [
			            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
			            ], [VERSION, [NAME, 'GSA'], [TYPE, INAPP]], [
			            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i                        // TikTok
			            ], [VERSION, [NAME, 'TikTok'], [TYPE, INAPP]], [
			            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
			            ], [NAME, [TYPE, INAPP]], [

			            /(chromium)[\/ ]([-\w\.]+)/i                                        // Chromium
			            ], [NAME, VERSION], [

			            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
			            ], [VERSION, [NAME, CHROME+' Headless']], [

			            /wv\).+chrome\/([\w\.]+).+edgw\//i                                  // Edge WebView2
			            ], [VERSION, [NAME, EDGE+' WebView2']], [

			            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
			            ], [[NAME, CHROME+' WebView'], VERSION], [

			            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
			            ], [VERSION, [NAME, 'Android' + SUFFIX_BROWSER]], [

			            /chrome\/([\w\.]+) mobile/i                                         // Chrome Mobile
			            ], [VERSION, [NAME, PREFIX_MOBILE + 'Chrome']], [

			            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
			            ], [NAME, VERSION], [

			            /version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i                 // Safari Mobile
			            ], [VERSION, [NAME, PREFIX_MOBILE + 'Safari']], [
			            /iphone .*mobile(?:\/\w+ | ?)safari/i
			            ], [[NAME, PREFIX_MOBILE + 'Safari']], [
			            /version\/([\w\.\,]+) .*(safari)/i                                  // Safari
			            ], [VERSION, NAME], [
			            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i                      // Safari < 3.0
			            ], [NAME, [VERSION, '1']], [

			            /(webkit|khtml)\/([\w\.]+)/i
			            ], [NAME, VERSION], [

			            // Gecko based
			            /(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i                        // Firefox Mobile
			            ], [[NAME, PREFIX_MOBILE + FIREFOX], VERSION], [
			            /(navigator|netscape\d?)\/([-\w\.]+)/i                              // Netscape
			            ], [[NAME, 'Netscape'], VERSION], [
			            /(wolvic|librewolf)\/([\w\.]+)/i                                    // Wolvic/LibreWolf
			            ], [NAME, VERSION], [
			            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
			            ], [VERSION, [NAME, FIREFOX+' Reality']], [
			            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
			            /(swiftfox)/i,                                                      // Swiftfox
			            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
			                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
			            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
			                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
			            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
			            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

			            // Other
			            /(amaya|dillo|doris|icab|ladybird|lynx|mosaic|netsurf|obigo|polaris|w3m|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
			                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Obigo/Mosaic/Go/ICE/UP.Browser/Ladybird
			            /\b(links) \(([\w\.]+)/i                                            // Links
			            ], [NAME, [VERSION, /_/g, '.']], [
			            
			            /(cobalt)\/([\w\.]+)/i                                              // Cobalt
			            ], [NAME, [VERSION, /[^\d\.]+./, EMPTY]]
			        ],

			        cpu : [[

			            /\b((amd|x|x86[-_]?|wow|win)64)\b/i                                 // AMD64 (x64)
			            ], [[ARCHITECTURE, 'amd64']], [

			            /(ia32(?=;))/i,                                                     // IA32 (quicktime)
			            /\b((i[346]|x)86)(pc)?\b/i                                          // IA32 (x86)
			            ], [[ARCHITECTURE, 'ia32']], [

			            /\b(aarch64|arm(v?[89]e?l?|_?64))\b/i                               // ARM64
			            ], [[ARCHITECTURE, 'arm64']], [

			            /\b(arm(v[67])?ht?n?[fl]p?)\b/i                                     // ARMHF
			            ], [[ARCHITECTURE, 'armhf']], [

			            // PocketPC mistakenly identified as PowerPC
			            /( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i
			            ], [[ARCHITECTURE, 'arm']], [

			            /((ppc|powerpc)(64)?)( mac|;|\))/i                                  // PowerPC
			            ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [

			            / sun4\w[;\)]/i                                                     // SPARC
			            ], [[ARCHITECTURE, 'sparc']], [

			            /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i
			                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
			            ], [[ARCHITECTURE, lowerize]]
			        ],

			        device : [[

			            //////////////////////////
			            // MOBILES & TABLETS
			            /////////////////////////

			            // Samsung
			            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
			            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
			            /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
			            /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
			            /sec-(sgh\w+)/i
			            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

			            // Apple
			            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i                          // iPod/iPhone
			            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
			            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
			            /applecoremedia\/[\w\.]+ \((ipad)/i,
			            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
			            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [
			            /(macintosh);/i
			            ], [MODEL, [VENDOR, APPLE]], [

			            // Sharp
			            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
			            ], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [

			            // Honor
			            /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i
			            ], [MODEL, [VENDOR, HONOR], [TYPE, TABLET]], [
			            /honor([-\w ]+)[;\)]/i
			            ], [MODEL, [VENDOR, HONOR], [TYPE, MOBILE]], [

			            // Huawei
			            /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i
			            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
			            /(?:huawei)([-\w ]+)[;\)]/i,
			            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
			            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

			            // Xiaomi
			            /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
			            /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i                                // Mi Pad tablets
			            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

			            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,                  // Xiaomi POCO
			            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
			            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
			            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
			            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,        // Xiaomi Redmi 'numeric' models
			            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i, // Xiaomi Mi
			            / ([\w ]+) miui\/v?\d/i
			            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [

			            // OnePlus
			            /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
			            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
			            ], [MODEL, [VENDOR, ONEPLUS], [TYPE, MOBILE]], [

			            // OPPO
			            /; (\w+) bui.+ oppo/i,
			            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
			            ], [MODEL, [VENDOR, OPPO], [TYPE, MOBILE]], [
			            /\b(opd2(\d{3}a?))(?: bui|\))/i
			            ], [MODEL, [VENDOR, strMapper, { 'OnePlus' : ['203', '304', '403', '404', '413', '415'], '*' : OPPO }], [TYPE, TABLET]], [

			            // BLU
			            /(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i  // Vivo series
			            ], [MODEL, [VENDOR, 'BLU'], [TYPE, MOBILE]], [    

			            // Vivo
			            /; vivo (\w+)(?: bui|\))/i,
			            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
			            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

			            // Realme
			            /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
			            ], [MODEL, [VENDOR, 'Realme'], [TYPE, MOBILE]], [

			            // Lenovo
			            /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
			            /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i
			            ], [MODEL, [VENDOR, LENOVO], [TYPE, TABLET]], [            
			            /lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i
			            ], [MODEL, [VENDOR, LENOVO], [TYPE, MOBILE]], [

			            // Motorola
			            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
			            /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
			            /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
			            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [
			            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
			            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [

			            // LG
			            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
			            ], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [
			            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
			            /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
			            /\blg-?([\d\w]+) bui/i
			            ], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [

			            // Nokia
			            /(nokia) (t[12][01])/i
			            ], [VENDOR, MODEL, [TYPE, TABLET]], [
			            /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
			            /nokia[-_ ]?(([-\w\. ]*))/i
			            ], [[MODEL, /_/g, ' '], [TYPE, MOBILE], [VENDOR, 'Nokia']], [

			            // Google
			            /(pixel (c|tablet))\b/i                                             // Google Pixel C/Tablet
			            ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [
			                                                                                // Google Pixel
			            /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i
			            ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [
			            /(google) (pixelbook( go)?)/i
			            ], [VENDOR, MODEL], [

			            // Sony
			            /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
			            ], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [
			            /sony tablet [ps]/i,
			            /\b(?:sony)?sgp\w+(?: bui|\))/i
			            ], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [

			            // Amazon
			            /(alexa)webm/i,
			            /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,                           // Kindle Fire without Silk / Echo Show
			            /(kf[a-z]+)( bui|\)).+silk\//i                                      // Kindle Fire HD
			            ], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [
			            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i                     // Fire Phone
			            ], [[MODEL, /(.+)/g, 'Fire Phone $1'], [VENDOR, AMAZON], [TYPE, MOBILE]], [

			            // BlackBerry
			            /(playbook);[-\w\),; ]+(rim)/i                                      // BlackBerry PlayBook
			            ], [MODEL, VENDOR, [TYPE, TABLET]], [
			            /\b((?:bb[a-f]|st[hv])100-\d)/i,
			            /\(bb10; (\w+)/i                                                    // BlackBerry 10
			            ], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [

			            // Asus
			            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
			            ], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [
			            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
			            ], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [

			            // HTC
			            /(nexus 9)/i                                                        // HTC Nexus 9
			            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [
			            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC

			            // ZTE
			            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
			            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
			            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

			            // TCL
			            /tcl (xess p17aa)/i,
			            /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i
			            ], [MODEL, [VENDOR, 'TCL'], [TYPE, TABLET]], [
			            /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i
			            ], [MODEL, [VENDOR, 'TCL'], [TYPE, MOBILE]], [

			            // itel
			            /(itel) ((\w+))/i
			            ], [[VENDOR, lowerize], MODEL, [TYPE, strMapper, { 'tablet' : ['p10001l', 'w7001'], '*' : 'mobile' }]], [

			            // Acer
			            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
			            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

			            // Meizu
			            /droid.+; (m[1-5] note) bui/i,
			            /\bmz-([-\w]{2,})/i
			            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [
			                
			            // Ulefone
			            /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
			            ], [MODEL, [VENDOR, 'Ulefone'], [TYPE, MOBILE]], [

			            // Energizer
			            /; (energy ?\w+)(?: bui|\))/i,
			            /; energizer ([\w ]+)(?: bui|\))/i
			            ], [MODEL, [VENDOR, 'Energizer'], [TYPE, MOBILE]], [

			            // Cat
			            /; cat (b35);/i,
			            /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i
			            ], [MODEL, [VENDOR, 'Cat'], [TYPE, MOBILE]], [

			            // Smartfren
			            /((?:new )?andromax[\w- ]+)(?: bui|\))/i
			            ], [MODEL, [VENDOR, 'Smartfren'], [TYPE, MOBILE]], [

			            // Nothing
			            /droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i
			            ], [MODEL, [VENDOR, 'Nothing'], [TYPE, MOBILE]], [

			            // Archos
			            /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
			            /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i
			            ], [MODEL, [VENDOR, 'Archos'], [TYPE, TABLET]], [
			            /archos ([\w ]+)( b|\))/i,
			            /; (ac[3-6]\d\w{2,8})( b|\))/i 
			            ], [MODEL, [VENDOR, 'Archos'], [TYPE, MOBILE]], [

			            // HMD
			            /; (n159v)/i
			            ], [MODEL, [VENDOR, 'HMD'], [TYPE, MOBILE]], [

			            // MIXED
			            /(imo) (tab \w+)/i,                                                 // IMO
			            /(infinix|tecno) (x1101b?|p904|dp(7c|8d|10a)( pro)?|p70[1-3]a?|p904|t1101)/i                     // Infinix XPad / Tecno
			            ], [VENDOR, MODEL, [TYPE, TABLET]], [

			            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus(?! zenw)|dell|jolla|meizu|motorola|polytron|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
			                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron/Tecno/Micromax/Advan
			            /; (blu|hmd|imo|infinix|lava|oneplus|tcl)[_ ]([\w\+ ]+?)(?: bui|\)|; r)/i,  // BLU/HMD/IMO/Infinix/Lava/OnePlus/TCL
			            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
			            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
			            /(oppo) ?([\w ]+) bui/i                                             // OPPO
			            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

			            /(kobo)\s(ereader|touch)/i,                                         // Kobo
			            /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
			            /(kindle)\/([\w\.]+)/i                                              // Kindle
			            ], [VENDOR, MODEL, [TYPE, TABLET]], [

			            /(surface duo)/i                                                    // Surface Duo
			            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [
			            /droid [\d\.]+; (fp\du?)(?: b|\))/i                                 // Fairphone
			            ], [MODEL, [VENDOR, 'Fairphone'], [TYPE, MOBILE]], [
			            /((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i              // Nvidia Tablets
			            ], [MODEL, [VENDOR, NVIDIA], [TYPE, TABLET]], [
			            /(sprint) (\w+)/i                                                   // Sprint Phones
			            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
			            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
			            ], [[MODEL, /\./g, ' '], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [
			            /droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i               // Zebra
			            ], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [
			            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
			            ], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [

			            ///////////////////
			            // SMARTTVS
			            ///////////////////

			            /smart-tv.+(samsung)/i                                              // Samsung
			            ], [VENDOR, [TYPE, SMARTTV]], [
			            /hbbtv.+maple;(\d+)/i
			            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [
			            /(vizio)(?: |.+model\/)(\w+-\w+)/i,                                 // Vizio
			            /tcast.+(lg)e?. ([-\w]+)/i                                          // LG SmartTV
			            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
			            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
			            ], [[VENDOR, LG], [TYPE, SMARTTV]], [
			            /(apple) ?tv/i                                                      // Apple TV
			            ], [VENDOR, [MODEL, APPLE+' TV'], [TYPE, SMARTTV]], [
			            /crkey.*devicetype\/chromecast/i                                    // Google Chromecast Third Generation
			            ], [[MODEL, CHROMECAST+' Third Generation'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
			            /crkey.*devicetype\/([^/]*)/i                                       // Google Chromecast with specific device type
			            ], [[MODEL, /^/, 'Chromecast '], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
			            /fuchsia.*crkey/i                                                   // Google Chromecast Nest Hub
			            ], [[MODEL, CHROMECAST+' Nest Hub'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
			            /crkey/i                                                            // Google Chromecast, Linux-based or unknown
			            ], [[MODEL, CHROMECAST], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
			            /(portaltv)/i                                                       // Facebook Portal TV
			            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, SMARTTV]], [
			            /droid.+aft(\w+)( bui|\))/i                                         // Fire TV
			            ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [
			            /(shield \w+ tv)/i                                                  // Nvidia Shield TV
			            ], [MODEL, [VENDOR, NVIDIA], [TYPE, SMARTTV]], [
			            /\(dtv[\);].+(aquos)/i,
			            /(aquos-tv[\w ]+)\)/i                                               // Sharp
			            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
			            /(bravia[\w ]+)( bui|\))/i                                          // Sony
			            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
			            /(mi(tv|box)-?\w+) bui/i                                            // Xiaomi
			            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
			            /Hbbtv.*(technisat) (.*);/i                                         // TechniSAT
			            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
			            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
			            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i         // HbbTV devices
			            ], [[VENDOR, /.+\/(\w+)/, '$1', strMapper, {'LG':'lge'}], [MODEL, trim], [TYPE, SMARTTV]], [
			                                                                                // SmartTV from Unidentified Vendors
			            /droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i
			            ], [MODEL, [TYPE, SMARTTV]], [
			            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:|large screen[\w ]+safari)\b/i
			            ], [[TYPE, SMARTTV]], [

			            ///////////////////
			            // CONSOLES
			            ///////////////////

			            /(playstation \w+)/i                                                // Playstation
			            ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [
			            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // Microsoft Xbox
			            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [
			            /(ouya)/i,                                                          // Ouya
			            /(nintendo) (\w+)/i,                                                // Nintendo
			            /(retroid) (pocket ([^\)]+))/i                                      // Retroid Pocket
			            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
			            /droid.+; (shield)( bui|\))/i                                       // Nvidia Portable
			            ], [MODEL, [VENDOR, NVIDIA], [TYPE, CONSOLE]], [

			            ///////////////////
			            // WEARABLES
			            ///////////////////

			            /\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i                       // Samsung Galaxy Watch
			            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, WEARABLE]], [
			            /((pebble))app/i,                                                   // Pebble
			            /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i        // Asus ZenWatch / LG Watch / Pixel Watch
			            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
			            /(ow(?:19|20)?we?[1-3]{1,3})/i                                      // Oppo Watch
			            ], [MODEL, [VENDOR, OPPO], [TYPE, WEARABLE]], [
			            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i                              // Apple Watch
			            ], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [
			            /(opwwe\d{3})/i                                                     // OnePlus Watch
			            ], [MODEL, [VENDOR, ONEPLUS], [TYPE, WEARABLE]], [
			            /(moto 360)/i                                                       // Motorola 360
			            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, WEARABLE]], [
			            /(smartwatch 3)/i                                                   // Sony SmartWatch
			            ], [MODEL, [VENDOR, SONY], [TYPE, WEARABLE]], [
			            /(g watch r)/i                                                      // LG G Watch R
			            ], [MODEL, [VENDOR, LG], [TYPE, WEARABLE]], [
			            /droid.+; (wt63?0{2,3})\)/i
			            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [

			            ///////////////////
			            // XR
			            ///////////////////

			            /droid.+; (glass) \d/i                                              // Google Glass
			            ], [MODEL, [VENDOR, GOOGLE], [TYPE, XR]], [
			            /(pico) (4|neo3(?: link|pro)?)/i                                    // Pico
			            ], [VENDOR, MODEL, [TYPE, XR]], [
			            /(quest( \d| pro)?s?).+vr/i                                         // Meta Quest
			            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, XR]], [
			            /mobile vr; rv.+firefox/i                                           // Unidentifiable VR device using Firefox Reality / Wolvic
			            ], [[TYPE, XR]], [

			            ///////////////////
			            // EMBEDDED
			            ///////////////////

			            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
			            ], [VENDOR, [TYPE, EMBEDDED]], [
			            /(aeobc)\b/i                                                        // Echo Dot
			            ], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [
			            /(homepod).+mac os/i                                                // Apple HomePod
			            ], [MODEL, [VENDOR, APPLE], [TYPE, EMBEDDED]], [
			            /windows iot/i                                                      // Unidentifiable embedded device using Windows IoT
			            ], [[TYPE, EMBEDDED]], [

			            ////////////////////
			            // MIXED (GENERIC)
			            ///////////////////

			            /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i
			            ], [MODEL, [TYPE, strMapper, { 'mobile' : 'Mobile', 'xr' : 'VR', '*' : TABLET }]], [
			            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i                      // Unidentifiable Tablet
			            ], [[TYPE, TABLET]], [
			            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i    // Unidentifiable Mobile
			            ], [[TYPE, MOBILE]], [
			            /droid .+?; ([\w\. -]+)( bui|\))/i                                  // Generic Android Device
			            ], [MODEL, [VENDOR, 'Generic']]
			        ],

			        engine : [[

			            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
			            ], [VERSION, [NAME, EDGE+'HTML']], [

			            /(arkweb)\/([\w\.]+)/i                                              // ArkWeb
			            ], [NAME, VERSION], [

			            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
			            ], [VERSION, [NAME, 'Blink']], [

			            /(presto)\/([\w\.]+)/i,                                             // Presto
			            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna/Servo
			            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
			            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
			            /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab

			            /\b(libweb)/i                                                       // LibWeb
			            ], [NAME, VERSION], [
			            /ladybird\//i
			            ], [[NAME, 'LibWeb']], [

			            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
			            ], [VERSION, NAME]
			        ],

			        os : [[

			            // Windows
			            /(windows nt) (6\.[23]); arm/i                                      // Windows RT
			            ], [[NAME, /N/, 'R'], [VERSION, strMapper, windowsVersionMap]], [
			            /(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,     // Windows IoT/Mobile/Phone
			                                                                                // Windows NT/3.1/95/98/ME/2000/XP/Vista/7/8/8.1/10/11
			            /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i
			            ], [NAME, VERSION], [
			            /windows nt ?([\d\.\)]*)(?!.+xbox)/i,
			            /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i
			            ], [[VERSION, /(;|\))/g, '', strMapper, windowsVersionMap], [NAME, WINDOWS]], [
			            /(windows ce)\/?([\d\.]*)/i                                         // Windows CE
			            ], [NAME, VERSION], [

			            // iOS/macOS
			            /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,             // iOS
			            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
			            /cfnetwork\/.+darwin/i
			            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
			            /(mac os x) ?([\w\. ]*)/i,
			            /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i                   // Mac OS
			            ], [[NAME, 'macOS'], [VERSION, /_/g, '.']], [

			            // Google Chromecast
			            /android ([\d\.]+).*crkey/i                                         // Google Chromecast, Android-based
			            ], [VERSION, [NAME, CHROMECAST + ' Android']], [
			            /fuchsia.*crkey\/([\d\.]+)/i                                        // Google Chromecast, Fuchsia-based
			            ], [VERSION, [NAME, CHROMECAST + ' Fuchsia']], [
			            /crkey\/([\d\.]+).*devicetype\/smartspeaker/i                       // Google Chromecast, Linux-based Smart Speaker
			            ], [VERSION, [NAME, CHROMECAST + ' SmartSpeaker']], [
			            /linux.*crkey\/([\d\.]+)/i                                          // Google Chromecast, Legacy Linux-based
			            ], [VERSION, [NAME, CHROMECAST + ' Linux']], [
			            /crkey\/([\d\.]+)/i                                                 // Google Chromecast, unknown
			            ], [VERSION, [NAME, CHROMECAST]], [

			            // Mobile OSes
			            /droid ([\w\.]+)\b.+(android[- ]x86)/i                              // Android-x86
			            ], [VERSION, NAME], [                                               
			            /(ubuntu) ([\w\.]+) like android/i                                  // Ubuntu Touch
			            ], [[NAME, /(.+)/, '$1 Touch'], VERSION], [
			            /(harmonyos)[\/ ]?([\d\.]*)/i,                                      // HarmonyOS
			                                                                                // Android/Blackberry/WebOS/QNX/Bada/RIM/KaiOS/Maemo/MeeGo/S40/Sailfish OS/OpenHarmony/Tizen
			            /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i
			            ], [NAME, VERSION], [
			            /\(bb(10);/i                                                        // BlackBerry 10
			            ], [VERSION, [NAME, BLACKBERRY]], [
			            /(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i       // Symbian
			            ], [VERSION, [NAME, 'Symbian']], [
			            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
			            ], [VERSION, [NAME, FIREFOX+' OS']], [
			            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,                             // WebOS
			            /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i
			            ], [VERSION, [NAME, 'webOS']], [
			            /web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i
			                                                                                // https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine
			            ], [[VERSION, strMapper, {'25':'120','24':'108','23':'94','22':'87','6':'79','5':'68','4':'53','3':'38','2':'538','1':'537','*':'TV'}], [NAME, 'webOS']], [                   
			            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i                              // watchOS
			            ], [VERSION, [NAME, 'watchOS']], [

			            // Google ChromeOS
			            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i                                  // Chromium OS
			            ], [[NAME, "Chrome OS"], VERSION],[

			            // Smart TVs
			            /panasonic;(viera)/i,                                               // Panasonic Viera
			            /(netrange)mmh/i,                                                   // Netrange
			            /(nettv)\/(\d+\.[\w\.]+)/i,                                         // NetTV

			            // Console
			            /(nintendo|playstation) (\w+)/i,                                    // Nintendo/Playstation
			            /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)
			            /(pico) .+os([\w\.]+)/i,                                            // Pico

			            // Other
			            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
			            /linux.+(mint)[\/\(\) ]?([\w\.]*)/i,                                // Mint
			            /(mageia|vectorlinux|fuchsia|arcaos|arch(?= ?linux))[;l ]([\d\.]*)/i,  // Mageia/VectorLinux/Fuchsia/ArcaOS/Arch
			            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire|knoppix)(?: gnu[\/ ]linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
			                                                                                // Ubuntu/Debian/SUSE/Gentoo/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire/Knoppix
			            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
			            /\b(aix)[; ]([1-9\.]{0,4})/i,                                       // AIX
			            /(hurd|linux|morphos)(?: (?:arm|x86|ppc)\w*| ?)([\w\.]*)/i,         // Hurd/Linux/MorphOS
			            /(gnu) ?([\w\.]*)/i,                                                // GNU
			            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
			            /(haiku) ?(r\d)?/i                                                  // Haiku
			            ], [NAME, VERSION], [
			            /(sunos) ?([\d\.]*)/i                                               // Solaris
			            ], [[NAME, 'Solaris'], VERSION], [
			            /\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,                 // BeOS/OS2/AmigaOS/OpenVMS/HP-UX/SerenityOS
			            /(unix) ?([\w\.]*)/i                                                // UNIX
			            ], [NAME, VERSION]
			        ]
			    };

			    /////////////////
			    // Factories
			    ////////////////

			    var defaultProps = (function () {
			            var props = { init : {}, isIgnore : {}, isIgnoreRgx : {}, toString : {}};
			            setProps.call(props.init, [
			                [UA_BROWSER, [NAME, VERSION, MAJOR, TYPE]],
			                [UA_CPU, [ARCHITECTURE]],
			                [UA_DEVICE, [TYPE, MODEL, VENDOR]],
			                [UA_ENGINE, [NAME, VERSION]],
			                [UA_OS, [NAME, VERSION]]
			            ]);
			            setProps.call(props.isIgnore, [
			                [UA_BROWSER, [VERSION, MAJOR]],
			                [UA_ENGINE, [VERSION]],
			                [UA_OS, [VERSION]]
			            ]);
			            setProps.call(props.isIgnoreRgx, [
			                [UA_BROWSER, / ?browser$/i],
			                [UA_OS, / ?os$/i]
			            ]);
			            setProps.call(props.toString, [
			                [UA_BROWSER, [NAME, VERSION]],
			                [UA_CPU, [ARCHITECTURE]],
			                [UA_DEVICE, [VENDOR, MODEL]],
			                [UA_ENGINE, [NAME, VERSION]],
			                [UA_OS, [NAME, VERSION]]
			            ]);
			            return props;
			    })();

			    var createIData = function (item, itemType) {

			        var init_props = defaultProps.init[itemType],
			            is_ignoreProps = defaultProps.isIgnore[itemType] || 0,
			            is_ignoreRgx = defaultProps.isIgnoreRgx[itemType] || 0,
			            toString_props = defaultProps.toString[itemType] || 0;

			        function IData () {
			            setProps.call(this, init_props);
			        }

			        IData.prototype.getItem = function () {
			            return item;
			        };

			        IData.prototype.withClientHints = function () {

			            // nodejs / non-client-hints browsers
			            if (!NAVIGATOR_UADATA) {
			                return item
			                        .parseCH()
			                        .get();
			            }

			            // browsers based on chromium 85+
			            return NAVIGATOR_UADATA
			                    .getHighEntropyValues(CH_ALL_VALUES)
			                    .then(function (res) {
			                        return item
			                                .setCH(new UACHData(res, false))
			                                .parseCH()
			                                .get();
			            });
			        };

			        IData.prototype.withFeatureCheck = function () {
			            return item.detectFeature().get();
			        };

			        if (itemType != UA_RESULT) {
			            IData.prototype.is = function (strToCheck) {
			                var is = false;
			                for (var i in this) {
			                    if (this.hasOwnProperty(i) && !has(is_ignoreProps, i) && lowerize(is_ignoreRgx ? strip(is_ignoreRgx, this[i]) : this[i]) == lowerize(is_ignoreRgx ? strip(is_ignoreRgx, strToCheck) : strToCheck)) {
			                        is = true;
			                        if (strToCheck != UNDEF_TYPE) break;
			                    } else if (strToCheck == UNDEF_TYPE && is) {
			                        is = !is;
			                        break;
			                    }
			                }
			                return is;
			            };
			            IData.prototype.toString = function () {
			                var str = EMPTY;
			                for (var i in toString_props) {
			                    if (typeof(this[toString_props[i]]) !== UNDEF_TYPE) {
			                        str += (str ? ' ' : EMPTY) + this[toString_props[i]];
			                    }
			                }
			                return str || UNDEF_TYPE;
			            };
			        }

			        if (!NAVIGATOR_UADATA) {
			            IData.prototype.then = function (cb) { 
			                var that = this;
			                var IDataResolve = function () {
			                    for (var prop in that) {
			                        if (that.hasOwnProperty(prop)) {
			                            this[prop] = that[prop];
			                        }
			                    }
			                };
			                IDataResolve.prototype = {
			                    is : IData.prototype.is,
			                    toString : IData.prototype.toString
			                };
			                var resolveData = new IDataResolve();
			                cb(resolveData);
			                return resolveData;
			            };
			        }

			        return new IData();
			    };

			    /////////////////
			    // Constructor
			    ////////////////

			    function UACHData (uach, isHttpUACH) {
			        uach = uach || {};
			        setProps.call(this, CH_ALL_VALUES);
			        if (isHttpUACH) {
			            setProps.call(this, [
			                [BRANDS, itemListToArray(uach[CH_HEADER])],
			                [FULLVERLIST, itemListToArray(uach[CH_HEADER_FULL_VER_LIST])],
			                [MOBILE, /\?1/.test(uach[CH_HEADER_MOBILE])],
			                [MODEL, stripQuotes(uach[CH_HEADER_MODEL])],
			                [PLATFORM, stripQuotes(uach[CH_HEADER_PLATFORM])],
			                [PLATFORMVER, stripQuotes(uach[CH_HEADER_PLATFORM_VER])],
			                [ARCHITECTURE, stripQuotes(uach[CH_HEADER_ARCH])],
			                [FORMFACTORS, itemListToArray(uach[CH_HEADER_FORM_FACTORS])],
			                [BITNESS, stripQuotes(uach[CH_HEADER_BITNESS])]
			            ]);
			        } else {
			            for (var prop in uach) {
			                if(this.hasOwnProperty(prop) && typeof uach[prop] !== UNDEF_TYPE) this[prop] = uach[prop];
			            }
			        }
			    }

			    function UAItem (itemType, ua, rgxMap, uaCH) {

			        this.get = function (prop) {
			            if (!prop) return this.data;
			            return this.data.hasOwnProperty(prop) ? this.data[prop] : undefined$1;
			        };

			        this.set = function (prop, val) {
			            this.data[prop] = val;
			            return this;
			        };

			        this.setCH = function (ch) {
			            this.uaCH = ch;
			            return this;
			        };

			        this.detectFeature = function () {
			            if (NAVIGATOR && NAVIGATOR.userAgent == this.ua) {
			                switch (this.itemType) {
			                    case UA_BROWSER:
			                        // Brave-specific detection
			                        if (NAVIGATOR.brave && typeof NAVIGATOR.brave.isBrave == FUNC_TYPE) {
			                            this.set(NAME, 'Brave');
			                        }
			                        break;
			                    case UA_DEVICE:
			                        // Chrome-specific detection: check for 'mobile' value of navigator.userAgentData
			                        if (!this.get(TYPE) && NAVIGATOR_UADATA && NAVIGATOR_UADATA[MOBILE]) {
			                            this.set(TYPE, MOBILE);
			                        }
			                        // iPadOS-specific detection: identified as Mac, but has some iOS-only properties
			                        if (this.get(MODEL) == 'Macintosh' && NAVIGATOR && typeof NAVIGATOR.standalone !== UNDEF_TYPE && NAVIGATOR.maxTouchPoints && NAVIGATOR.maxTouchPoints > 2) {
			                            this.set(MODEL, 'iPad')
			                                .set(TYPE, TABLET);
			                        }
			                        break;
			                    case UA_OS:
			                        // Chrome-specific detection: check for 'platform' value of navigator.userAgentData
			                        if (!this.get(NAME) && NAVIGATOR_UADATA && NAVIGATOR_UADATA[PLATFORM]) {
			                            this.set(NAME, NAVIGATOR_UADATA[PLATFORM]);
			                        }
			                        break;
			                    case UA_RESULT:
			                        var data = this.data;
			                        var detect = function (itemType) {
			                            return data[itemType]
			                                    .getItem()
			                                    .detectFeature()
			                                    .get();
			                        };
			                        this.set(UA_BROWSER, detect(UA_BROWSER))
			                            .set(UA_CPU, detect(UA_CPU))
			                            .set(UA_DEVICE, detect(UA_DEVICE))
			                            .set(UA_ENGINE, detect(UA_ENGINE))
			                            .set(UA_OS, detect(UA_OS));
			                }
			            }
			            return this;
			        };

			        this.parseUA = function () {
			            if (this.itemType != UA_RESULT) {
			                rgxMapper.call(this.data, this.ua, this.rgxMap);
			            }
			            if (this.itemType == UA_BROWSER) {
			                this.set(MAJOR, majorize(this.get(VERSION)));
			            }
			            return this;
			        };

			        this.parseCH = function () {
			            var uaCH = this.uaCH,
			                rgxMap = this.rgxMap;
			    
			            switch (this.itemType) {
			                case UA_BROWSER:
			                case UA_ENGINE:
			                    var brands = uaCH[FULLVERLIST] || uaCH[BRANDS], prevName;
			                    if (brands) {
			                        for (var i in brands) {
			                            var brandName = brands[i].brand || brands[i],
			                                brandVersion = brands[i].version;
			                            if (this.itemType == UA_BROWSER && 
			                                !/not.a.brand/i.test(brandName) && 
			                                (!prevName || 
			                                    (/Chrom/.test(prevName) && brandName != CHROMIUM) || 
			                                    (prevName == EDGE && /WebView2/.test(brandName))
			                                )) {
			                                    brandName = strMapper(brandName, browserHintsMap);
			                                    prevName = this.get(NAME);
			                                    if (!(prevName && !/Chrom/.test(prevName) && /Chrom/.test(brandName))) {
			                                        this.set(NAME, brandName)
			                                            .set(VERSION, brandVersion)
			                                            .set(MAJOR, majorize(brandVersion));
			                                    }
			                                    prevName = brandName;
			                            }
			                            if (this.itemType == UA_ENGINE && brandName == CHROMIUM) {
			                                this.set(VERSION, brandVersion);
			                            }
			                        }
			                    }
			                    break;
			                case UA_CPU:
			                    var archName = uaCH[ARCHITECTURE];
			                    if (archName) {
			                        if (archName && uaCH[BITNESS] == '64') archName += '64';
			                        rgxMapper.call(this.data, archName + ';', rgxMap);
			                    }
			                    break;
			                case UA_DEVICE:
			                    if (uaCH[MOBILE]) {
			                        this.set(TYPE, MOBILE);
			                    }
			                    if (uaCH[MODEL]) {
			                        this.set(MODEL, uaCH[MODEL]);
			                        if (!this.get(TYPE) || !this.get(VENDOR)) {
			                            var reParse = {};
			                            rgxMapper.call(reParse, 'droid 9; ' + uaCH[MODEL] + ')', rgxMap);
			                            if (!this.get(TYPE) && !!reParse.type) {
			                                this.set(TYPE, reParse.type);
			                            }
			                            if (!this.get(VENDOR) && !!reParse.vendor) {
			                                this.set(VENDOR, reParse.vendor);
			                            }
			                        }
			                    }
			                    if (uaCH[FORMFACTORS]) {
			                        var ff;
			                        if (typeof uaCH[FORMFACTORS] !== 'string') {
			                            var idx = 0;
			                            while (!ff && idx < uaCH[FORMFACTORS].length) {
			                                ff = strMapper(uaCH[FORMFACTORS][idx++], formFactorsMap);
			                            }
			                        } else {
			                            ff = strMapper(uaCH[FORMFACTORS], formFactorsMap);
			                        }
			                        this.set(TYPE, ff);
			                    }
			                    break;
			                case UA_OS:
			                    var osName = uaCH[PLATFORM];
			                    if(osName) {
			                        var osVersion = uaCH[PLATFORMVER];
			                        if (osName == WINDOWS) osVersion = (parseInt(majorize(osVersion), 10) >= 13 ? '11' : '10');
			                        this.set(NAME, osName)
			                            .set(VERSION, osVersion);
			                    }
			                    // Xbox-Specific Detection
			                    if (this.get(NAME) == WINDOWS && uaCH[MODEL] == 'Xbox') {
			                        this.set(NAME, 'Xbox')
			                            .set(VERSION, undefined$1);
			                    }           
			                    break;
			                case UA_RESULT:
			                    var data = this.data;
			                    var parse = function (itemType) {
			                        return data[itemType]
			                                .getItem()
			                                .setCH(uaCH)
			                                .parseCH()
			                                .get();
			                    };
			                    this.set(UA_BROWSER, parse(UA_BROWSER))
			                        .set(UA_CPU, parse(UA_CPU))
			                        .set(UA_DEVICE, parse(UA_DEVICE))
			                        .set(UA_ENGINE, parse(UA_ENGINE))
			                        .set(UA_OS, parse(UA_OS));
			            }
			            return this;
			        };

			        setProps.call(this, [
			            ['itemType', itemType],
			            ['ua', ua],
			            ['uaCH', uaCH],
			            ['rgxMap', rgxMap],
			            ['data', createIData(this, itemType)]
			        ]);

			        return this;
			    }

			    function UAParser (ua, extensions, headers) {

			        if (typeof ua === OBJ_TYPE) {
			            if (isExtensions(ua, true)) {
			                if (typeof extensions === OBJ_TYPE) {
			                    headers = extensions;               // case UAParser(extensions, headers)           
			                }
			                extensions = ua;                        // case UAParser(extensions)
			            } else {
			                headers = ua;                           // case UAParser(headers)
			                extensions = undefined$1;
			            }
			            ua = undefined$1;
			        } else if (typeof ua === STR_TYPE && !isExtensions(extensions, true)) {
			            headers = extensions;                       // case UAParser(ua, headers)
			            extensions = undefined$1;
			        }

			        // Convert Headers object into a plain object
			        if (headers && typeof headers.append === FUNC_TYPE) {
			            var kv = {};
			            headers.forEach(function (v, k) { kv[k] = v; });
			            headers = kv;
			        }
			        
			        if (!(this instanceof UAParser)) {
			            return new UAParser(ua, extensions, headers).getResult();
			        }

			        var userAgent = typeof ua === STR_TYPE ? ua :                                       // Passed user-agent string
			                                (headers && headers[USER_AGENT] ? headers[USER_AGENT] :     // User-Agent from passed headers
			                                ((NAVIGATOR && NAVIGATOR.userAgent) ? NAVIGATOR.userAgent : // navigator.userAgent
			                                    EMPTY)),                                                // empty string

			            httpUACH = new UACHData(headers, true),
			            regexMap = extensions ? 
			                        extend(defaultRegexes, extensions) : 
			                        defaultRegexes,

			            createItemFunc = function (itemType) {
			                if (itemType == UA_RESULT) {
			                    return function () {
			                        return new UAItem(itemType, userAgent, regexMap, httpUACH)
			                                    .set('ua', userAgent)
			                                    .set(UA_BROWSER, this.getBrowser())
			                                    .set(UA_CPU, this.getCPU())
			                                    .set(UA_DEVICE, this.getDevice())
			                                    .set(UA_ENGINE, this.getEngine())
			                                    .set(UA_OS, this.getOS())
			                                    .get();
			                    };
			                } else {
			                    return function () {
			                        return new UAItem(itemType, userAgent, regexMap[itemType], httpUACH)
			                                    .parseUA()
			                                    .get();
			                    };
			                }
			            };
			            
			        // public methods
			        setProps.call(this, [
			            ['getBrowser', createItemFunc(UA_BROWSER)],
			            ['getCPU', createItemFunc(UA_CPU)],
			            ['getDevice', createItemFunc(UA_DEVICE)],
			            ['getEngine', createItemFunc(UA_ENGINE)],
			            ['getOS', createItemFunc(UA_OS)],
			            ['getResult', createItemFunc(UA_RESULT)],
			            ['getUA', function () { return userAgent; }],
			            ['setUA', function (ua) {
			                if (isString(ua))
			                    userAgent = ua.length > UA_MAX_LENGTH ? trim(ua, UA_MAX_LENGTH) : ua;
			                return this;
			            }]
			        ])
			        .setUA(userAgent);

			        return this;
			    }

			    UAParser.VERSION = LIBVERSION;
			    UAParser.BROWSER =  enumerize([NAME, VERSION, MAJOR, TYPE]);
			    UAParser.CPU = enumerize([ARCHITECTURE]);
			    UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
			    UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);

			    ///////////
			    // Export
			    //////////

			    // check js environment
			    {
			        // nodejs env
			        if (module.exports) {
			            exports = module.exports = UAParser;
			        }
			        exports.UAParser = UAParser;
			    }

			    // jQuery/Zepto specific (optional)
			    // Note:
			    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
			    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
			    //   and we should catch that.
			    var $ = isWindow && (window.jQuery || window.Zepto);
			    if ($ && !$.ua) {
			        var parser = new UAParser();
			        $.ua = parser.getResult();
			        $.ua.get = function () {
			            return parser.getUA();
			        };
			        $.ua.set = function (ua) {
			            parser.setUA(ua);
			            var result = parser.getResult();
			            for (var prop in result) {
			                $.ua[prop] = result[prop];
			            }
			        };
			    }

			})(typeof window === 'object' ? window : uaParser); 
		} (uaParser$1, uaParser$1.exports));
		return uaParser$1.exports;
	}

	var Logger$2 = {};

	var hasRequiredLogger$2;

	function requireLogger$2 () {
		if (hasRequiredLogger$2) return Logger$2;
		hasRequiredLogger$2 = 1;
		Object.defineProperty(Logger$2, "__esModule", { value: true });
		Logger$2.Logger = void 0;
		const debug_1 = requireSrc();
		const APP_NAME = 'mediasoup-client';
		class Logger {
		    _debug;
		    _warn;
		    _error;
		    constructor(prefix) {
		        if (prefix) {
		            this._debug = (0, debug_1.default)(`${APP_NAME}:${prefix}`);
		            this._warn = (0, debug_1.default)(`${APP_NAME}:WARN:${prefix}`);
		            this._error = (0, debug_1.default)(`${APP_NAME}:ERROR:${prefix}`);
		        }
		        else {
		            this._debug = (0, debug_1.default)(APP_NAME);
		            this._warn = (0, debug_1.default)(`${APP_NAME}:WARN`);
		            this._error = (0, debug_1.default)(`${APP_NAME}:ERROR`);
		        }
		        /* eslint-disable no-console */
		        this._debug.log = console.info.bind(console);
		        this._warn.log = console.warn.bind(console);
		        this._error.log = console.error.bind(console);
		        /* eslint-enable no-console */
		    }
		    get debug() {
		        return this._debug;
		    }
		    get warn() {
		        return this._warn;
		    }
		    get error() {
		        return this._error;
		    }
		}
		Logger$2.Logger = Logger;
		return Logger$2;
	}

	var enhancedEvents = {};

	var events = {exports: {}};

	var hasRequiredEvents;

	function requireEvents () {
		if (hasRequiredEvents) return events.exports;
		hasRequiredEvents = 1;

		var R = typeof Reflect === 'object' ? Reflect : null;
		var ReflectApply = R && typeof R.apply === 'function'
		  ? R.apply
		  : function ReflectApply(target, receiver, args) {
		    return Function.prototype.apply.call(target, receiver, args);
		  };

		var ReflectOwnKeys;
		if (R && typeof R.ownKeys === 'function') {
		  ReflectOwnKeys = R.ownKeys;
		} else if (Object.getOwnPropertySymbols) {
		  ReflectOwnKeys = function ReflectOwnKeys(target) {
		    return Object.getOwnPropertyNames(target)
		      .concat(Object.getOwnPropertySymbols(target));
		  };
		} else {
		  ReflectOwnKeys = function ReflectOwnKeys(target) {
		    return Object.getOwnPropertyNames(target);
		  };
		}

		function ProcessEmitWarning(warning) {
		  if (console && console.warn) console.warn(warning);
		}

		var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
		  return value !== value;
		};

		function EventEmitter() {
		  EventEmitter.init.call(this);
		}
		events.exports = EventEmitter;
		events.exports.once = once;

		// Backwards-compat with node 0.10.x
		EventEmitter.EventEmitter = EventEmitter;

		EventEmitter.prototype._events = undefined;
		EventEmitter.prototype._eventsCount = 0;
		EventEmitter.prototype._maxListeners = undefined;

		// By default EventEmitters will print a warning if more than 10 listeners are
		// added to it. This is a useful default which helps finding memory leaks.
		var defaultMaxListeners = 10;

		function checkListener(listener) {
		  if (typeof listener !== 'function') {
		    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
		  }
		}

		Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
		  enumerable: true,
		  get: function() {
		    return defaultMaxListeners;
		  },
		  set: function(arg) {
		    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
		      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
		    }
		    defaultMaxListeners = arg;
		  }
		});

		EventEmitter.init = function() {

		  if (this._events === undefined ||
		      this._events === Object.getPrototypeOf(this)._events) {
		    this._events = Object.create(null);
		    this._eventsCount = 0;
		  }

		  this._maxListeners = this._maxListeners || undefined;
		};

		// Obviously not all Emitters should be limited to 10. This function allows
		// that to be increased. Set to zero for unlimited.
		EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
		  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
		    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
		  }
		  this._maxListeners = n;
		  return this;
		};

		function _getMaxListeners(that) {
		  if (that._maxListeners === undefined)
		    return EventEmitter.defaultMaxListeners;
		  return that._maxListeners;
		}

		EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
		  return _getMaxListeners(this);
		};

		EventEmitter.prototype.emit = function emit(type) {
		  var args = [];
		  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
		  var doError = (type === 'error');

		  var events = this._events;
		  if (events !== undefined)
		    doError = (doError && events.error === undefined);
		  else if (!doError)
		    return false;

		  // If there is no 'error' event listener then throw.
		  if (doError) {
		    var er;
		    if (args.length > 0)
		      er = args[0];
		    if (er instanceof Error) {
		      // Note: The comments on the `throw` lines are intentional, they show
		      // up in Node's output if this results in an unhandled exception.
		      throw er; // Unhandled 'error' event
		    }
		    // At least give some kind of context to the user
		    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
		    err.context = er;
		    throw err; // Unhandled 'error' event
		  }

		  var handler = events[type];

		  if (handler === undefined)
		    return false;

		  if (typeof handler === 'function') {
		    ReflectApply(handler, this, args);
		  } else {
		    var len = handler.length;
		    var listeners = arrayClone(handler, len);
		    for (var i = 0; i < len; ++i)
		      ReflectApply(listeners[i], this, args);
		  }

		  return true;
		};

		function _addListener(target, type, listener, prepend) {
		  var m;
		  var events;
		  var existing;

		  checkListener(listener);

		  events = target._events;
		  if (events === undefined) {
		    events = target._events = Object.create(null);
		    target._eventsCount = 0;
		  } else {
		    // To avoid recursion in the case that type === "newListener"! Before
		    // adding it to the listeners, first emit "newListener".
		    if (events.newListener !== undefined) {
		      target.emit('newListener', type,
		                  listener.listener ? listener.listener : listener);

		      // Re-assign `events` because a newListener handler could have caused the
		      // this._events to be assigned to a new object
		      events = target._events;
		    }
		    existing = events[type];
		  }

		  if (existing === undefined) {
		    // Optimize the case of one listener. Don't need the extra array object.
		    existing = events[type] = listener;
		    ++target._eventsCount;
		  } else {
		    if (typeof existing === 'function') {
		      // Adding the second element, need to change to array.
		      existing = events[type] =
		        prepend ? [listener, existing] : [existing, listener];
		      // If we've already got an array, just append.
		    } else if (prepend) {
		      existing.unshift(listener);
		    } else {
		      existing.push(listener);
		    }

		    // Check for listener leak
		    m = _getMaxListeners(target);
		    if (m > 0 && existing.length > m && !existing.warned) {
		      existing.warned = true;
		      // No error code for this since it is a Warning
		      // eslint-disable-next-line no-restricted-syntax
		      var w = new Error('Possible EventEmitter memory leak detected. ' +
		                          existing.length + ' ' + String(type) + ' listeners ' +
		                          'added. Use emitter.setMaxListeners() to ' +
		                          'increase limit');
		      w.name = 'MaxListenersExceededWarning';
		      w.emitter = target;
		      w.type = type;
		      w.count = existing.length;
		      ProcessEmitWarning(w);
		    }
		  }

		  return target;
		}

		EventEmitter.prototype.addListener = function addListener(type, listener) {
		  return _addListener(this, type, listener, false);
		};

		EventEmitter.prototype.on = EventEmitter.prototype.addListener;

		EventEmitter.prototype.prependListener =
		    function prependListener(type, listener) {
		      return _addListener(this, type, listener, true);
		    };

		function onceWrapper() {
		  if (!this.fired) {
		    this.target.removeListener(this.type, this.wrapFn);
		    this.fired = true;
		    if (arguments.length === 0)
		      return this.listener.call(this.target);
		    return this.listener.apply(this.target, arguments);
		  }
		}

		function _onceWrap(target, type, listener) {
		  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
		  var wrapped = onceWrapper.bind(state);
		  wrapped.listener = listener;
		  state.wrapFn = wrapped;
		  return wrapped;
		}

		EventEmitter.prototype.once = function once(type, listener) {
		  checkListener(listener);
		  this.on(type, _onceWrap(this, type, listener));
		  return this;
		};

		EventEmitter.prototype.prependOnceListener =
		    function prependOnceListener(type, listener) {
		      checkListener(listener);
		      this.prependListener(type, _onceWrap(this, type, listener));
		      return this;
		    };

		// Emits a 'removeListener' event if and only if the listener was removed.
		EventEmitter.prototype.removeListener =
		    function removeListener(type, listener) {
		      var list, events, position, i, originalListener;

		      checkListener(listener);

		      events = this._events;
		      if (events === undefined)
		        return this;

		      list = events[type];
		      if (list === undefined)
		        return this;

		      if (list === listener || list.listener === listener) {
		        if (--this._eventsCount === 0)
		          this._events = Object.create(null);
		        else {
		          delete events[type];
		          if (events.removeListener)
		            this.emit('removeListener', type, list.listener || listener);
		        }
		      } else if (typeof list !== 'function') {
		        position = -1;

		        for (i = list.length - 1; i >= 0; i--) {
		          if (list[i] === listener || list[i].listener === listener) {
		            originalListener = list[i].listener;
		            position = i;
		            break;
		          }
		        }

		        if (position < 0)
		          return this;

		        if (position === 0)
		          list.shift();
		        else {
		          spliceOne(list, position);
		        }

		        if (list.length === 1)
		          events[type] = list[0];

		        if (events.removeListener !== undefined)
		          this.emit('removeListener', type, originalListener || listener);
		      }

		      return this;
		    };

		EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

		EventEmitter.prototype.removeAllListeners =
		    function removeAllListeners(type) {
		      var listeners, events, i;

		      events = this._events;
		      if (events === undefined)
		        return this;

		      // not listening for removeListener, no need to emit
		      if (events.removeListener === undefined) {
		        if (arguments.length === 0) {
		          this._events = Object.create(null);
		          this._eventsCount = 0;
		        } else if (events[type] !== undefined) {
		          if (--this._eventsCount === 0)
		            this._events = Object.create(null);
		          else
		            delete events[type];
		        }
		        return this;
		      }

		      // emit removeListener for all listeners on all events
		      if (arguments.length === 0) {
		        var keys = Object.keys(events);
		        var key;
		        for (i = 0; i < keys.length; ++i) {
		          key = keys[i];
		          if (key === 'removeListener') continue;
		          this.removeAllListeners(key);
		        }
		        this.removeAllListeners('removeListener');
		        this._events = Object.create(null);
		        this._eventsCount = 0;
		        return this;
		      }

		      listeners = events[type];

		      if (typeof listeners === 'function') {
		        this.removeListener(type, listeners);
		      } else if (listeners !== undefined) {
		        // LIFO order
		        for (i = listeners.length - 1; i >= 0; i--) {
		          this.removeListener(type, listeners[i]);
		        }
		      }

		      return this;
		    };

		function _listeners(target, type, unwrap) {
		  var events = target._events;

		  if (events === undefined)
		    return [];

		  var evlistener = events[type];
		  if (evlistener === undefined)
		    return [];

		  if (typeof evlistener === 'function')
		    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

		  return unwrap ?
		    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
		}

		EventEmitter.prototype.listeners = function listeners(type) {
		  return _listeners(this, type, true);
		};

		EventEmitter.prototype.rawListeners = function rawListeners(type) {
		  return _listeners(this, type, false);
		};

		EventEmitter.listenerCount = function(emitter, type) {
		  if (typeof emitter.listenerCount === 'function') {
		    return emitter.listenerCount(type);
		  } else {
		    return listenerCount.call(emitter, type);
		  }
		};

		EventEmitter.prototype.listenerCount = listenerCount;
		function listenerCount(type) {
		  var events = this._events;

		  if (events !== undefined) {
		    var evlistener = events[type];

		    if (typeof evlistener === 'function') {
		      return 1;
		    } else if (evlistener !== undefined) {
		      return evlistener.length;
		    }
		  }

		  return 0;
		}

		EventEmitter.prototype.eventNames = function eventNames() {
		  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
		};

		function arrayClone(arr, n) {
		  var copy = new Array(n);
		  for (var i = 0; i < n; ++i)
		    copy[i] = arr[i];
		  return copy;
		}

		function spliceOne(list, index) {
		  for (; index + 1 < list.length; index++)
		    list[index] = list[index + 1];
		  list.pop();
		}

		function unwrapListeners(arr) {
		  var ret = new Array(arr.length);
		  for (var i = 0; i < ret.length; ++i) {
		    ret[i] = arr[i].listener || arr[i];
		  }
		  return ret;
		}

		function once(emitter, name) {
		  return new Promise(function (resolve, reject) {
		    function errorListener(err) {
		      emitter.removeListener(name, resolver);
		      reject(err);
		    }

		    function resolver() {
		      if (typeof emitter.removeListener === 'function') {
		        emitter.removeListener('error', errorListener);
		      }
		      resolve([].slice.call(arguments));
		    }
		    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
		    if (name !== 'error') {
		      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
		    }
		  });
		}

		function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
		  if (typeof emitter.on === 'function') {
		    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
		  }
		}

		function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
		  if (typeof emitter.on === 'function') {
		    if (flags.once) {
		      emitter.once(name, listener);
		    } else {
		      emitter.on(name, listener);
		    }
		  } else if (typeof emitter.addEventListener === 'function') {
		    // EventTarget does not have `error` event semantics like Node
		    // EventEmitters, we do not listen for `error` events here.
		    emitter.addEventListener(name, function wrapListener(arg) {
		      // IE does not have builtin `{ once: true }` support so we
		      // have to do it manually.
		      if (flags.once) {
		        emitter.removeEventListener(name, wrapListener);
		      }
		      listener(arg);
		    });
		  } else {
		    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
		  }
		}
		return events.exports;
	}

	var hasRequiredEnhancedEvents;

	function requireEnhancedEvents () {
		if (hasRequiredEnhancedEvents) return enhancedEvents;
		hasRequiredEnhancedEvents = 1;
		Object.defineProperty(enhancedEvents, "__esModule", { value: true });
		enhancedEvents.EnhancedEventEmitter = void 0;
		const events_alias_1 = requireEvents();
		const Logger_1 = requireLogger$2();
		const enhancedEventEmitterLogger = new Logger_1.Logger('EnhancedEventEmitter');
		class EnhancedEventEmitter extends events_alias_1.EventEmitter {
		    constructor() {
		        super();
		        this.setMaxListeners(Infinity);
		    }
		    emit(eventName, ...args) {
		        return super.emit(eventName, ...args);
		    }
		    /**
		     * Special addition to the EventEmitter API.
		     */
		    safeEmit(eventName, ...args) {
		        try {
		            return super.emit(eventName, ...args);
		        }
		        catch (error) {
		            enhancedEventEmitterLogger.error('safeEmit() | event listener threw an error [eventName:%s]:%o', eventName, error);
		            try {
		                super.emit('listenererror', eventName, error);
		            }
		            catch (error2) {
		                // Ignore it.
		            }
		            return Boolean(super.listenerCount(eventName));
		        }
		    }
		    on(eventName, listener) {
		        super.on(eventName, listener);
		        return this;
		    }
		    off(eventName, listener) {
		        super.off(eventName, listener);
		        return this;
		    }
		    addListener(eventName, listener) {
		        super.on(eventName, listener);
		        return this;
		    }
		    prependListener(eventName, listener) {
		        super.prependListener(eventName, listener);
		        return this;
		    }
		    once(eventName, listener) {
		        super.once(eventName, listener);
		        return this;
		    }
		    prependOnceListener(eventName, listener) {
		        super.prependOnceListener(eventName, listener);
		        return this;
		    }
		    removeListener(eventName, listener) {
		        super.off(eventName, listener);
		        return this;
		    }
		    removeAllListeners(eventName) {
		        super.removeAllListeners(eventName);
		        return this;
		    }
		    listenerCount(eventName) {
		        return super.listenerCount(eventName);
		    }
		    listeners(eventName) {
		        return super.listeners(eventName);
		    }
		    rawListeners(eventName) {
		        return super.rawListeners(eventName);
		    }
		}
		enhancedEvents.EnhancedEventEmitter = EnhancedEventEmitter;
		return enhancedEvents;
	}

	var errors$1 = {};

	var hasRequiredErrors$1;

	function requireErrors$1 () {
		if (hasRequiredErrors$1) return errors$1;
		hasRequiredErrors$1 = 1;
		Object.defineProperty(errors$1, "__esModule", { value: true });
		errors$1.InvalidStateError = errors$1.UnsupportedError = void 0;
		/**
		 * Error indicating not support for something.
		 */
		class UnsupportedError extends Error {
		    constructor(message) {
		        super(message);
		        this.name = 'UnsupportedError';
		        if (Error.hasOwnProperty('captureStackTrace')) {
		            Error.captureStackTrace(this, UnsupportedError);
		        }
		        else {
		            this.stack = new Error(message).stack;
		        }
		    }
		}
		errors$1.UnsupportedError = UnsupportedError;
		/**
		 * Error produced when calling a method in an invalid state.
		 */
		class InvalidStateError extends Error {
		    constructor(message) {
		        super(message);
		        this.name = 'InvalidStateError';
		        if (Error.hasOwnProperty('captureStackTrace')) {
		            // Just in V8.
		            Error.captureStackTrace(this, InvalidStateError);
		        }
		        else {
		            this.stack = new Error(message).stack;
		        }
		    }
		}
		errors$1.InvalidStateError = InvalidStateError;
		return errors$1;
	}

	var utils$2 = {};

	var hasRequiredUtils$2;

	function requireUtils$2 () {
		if (hasRequiredUtils$2) return utils$2;
		hasRequiredUtils$2 = 1;
		Object.defineProperty(utils$2, "__esModule", { value: true });
		utils$2.clone = clone;
		utils$2.generateRandomNumber = generateRandomNumber;
		utils$2.deepFreeze = deepFreeze;
		/**
		 * Clones the given value.
		 */
		function clone(value) {
		    if (value === undefined) {
		        return undefined;
		    }
		    else if (Number.isNaN(value)) {
		        return NaN;
		    }
		    else if (typeof structuredClone === 'function') {
		        // Available in Node >= 18.
		        return structuredClone(value);
		    }
		    else {
		        return JSON.parse(JSON.stringify(value));
		    }
		}
		/**
		 * Generates a random positive integer.
		 */
		function generateRandomNumber() {
		    return Math.round(Math.random() * 10000000);
		}
		/**
		 * Make an object or array recursively immutable.
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze.
		 */
		function deepFreeze(object) {
		    // Retrieve the property names defined on object.
		    const propNames = Reflect.ownKeys(object);
		    // Freeze properties before freezing self.
		    for (const name of propNames) {
		        const value = object[name];
		        if ((value && typeof value === 'object') || typeof value === 'function') {
		            deepFreeze(value);
		        }
		    }
		    return Object.freeze(object);
		}
		return utils$2;
	}

	var ortc = {};

	var lib$3 = {};

	var Logger$1 = {};

	var hasRequiredLogger$1;

	function requireLogger$1 () {
		if (hasRequiredLogger$1) return Logger$1;
		hasRequiredLogger$1 = 1;
		var __importDefault = (Logger$1 && Logger$1.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(Logger$1, "__esModule", { value: true });
		Logger$1.Logger = void 0;
		const debug_1 = __importDefault(requireSrc());
		const APP_NAME = 'h264-profile-level-id';
		class Logger {
		    constructor(prefix) {
		        if (prefix) {
		            this._debug = (0, debug_1.default)(`${APP_NAME}:${prefix}`);
		            this._warn = (0, debug_1.default)(`${APP_NAME}:WARN:${prefix}`);
		            this._error = (0, debug_1.default)(`${APP_NAME}:ERROR:${prefix}`);
		        }
		        else {
		            this._debug = (0, debug_1.default)(APP_NAME);
		            this._warn = (0, debug_1.default)(`${APP_NAME}:WARN`);
		            this._error = (0, debug_1.default)(`${APP_NAME}:ERROR`);
		        }
		        /* eslint-disable no-console */
		        this._debug.log = console.info.bind(console);
		        this._warn.log = console.warn.bind(console);
		        this._error.log = console.error.bind(console);
		        /* eslint-enable no-console */
		    }
		    get debug() {
		        return this._debug;
		    }
		    get warn() {
		        return this._warn;
		    }
		    get error() {
		        return this._error;
		    }
		}
		Logger$1.Logger = Logger;
		return Logger$1;
	}

	var hasRequiredLib$4;

	function requireLib$4 () {
		if (hasRequiredLib$4) return lib$3;
		hasRequiredLib$4 = 1;
		Object.defineProperty(lib$3, "__esModule", { value: true });
		lib$3.ProfileLevelId = lib$3.Level = lib$3.Profile = void 0;
		lib$3.parseProfileLevelId = parseProfileLevelId;
		lib$3.profileLevelIdToString = profileLevelIdToString;
		lib$3.profileToString = profileToString;
		lib$3.levelToString = levelToString;
		lib$3.parseSdpProfileLevelId = parseSdpProfileLevelId;
		lib$3.isSameProfile = isSameProfile;
		lib$3.isSameProfileAndLevel = isSameProfileAndLevel;
		lib$3.generateProfileLevelIdStringForAnswer = generateProfileLevelIdStringForAnswer;
		lib$3.supportedLevel = supportedLevel;
		const Logger_1 = requireLogger$1();
		const logger = new Logger_1.Logger();
		/**
		 * Supported profiles.
		 */
		var Profile;
		(function (Profile) {
		    Profile[Profile["ConstrainedBaseline"] = 1] = "ConstrainedBaseline";
		    Profile[Profile["Baseline"] = 2] = "Baseline";
		    Profile[Profile["Main"] = 3] = "Main";
		    Profile[Profile["ConstrainedHigh"] = 4] = "ConstrainedHigh";
		    Profile[Profile["High"] = 5] = "High";
		    Profile[Profile["PredictiveHigh444"] = 6] = "PredictiveHigh444";
		})(Profile || (lib$3.Profile = Profile = {}));
		/**
		 * Supported levels.
		 */
		var Level;
		(function (Level) {
		    Level[Level["L1_b"] = 0] = "L1_b";
		    Level[Level["L1"] = 10] = "L1";
		    Level[Level["L1_1"] = 11] = "L1_1";
		    Level[Level["L1_2"] = 12] = "L1_2";
		    Level[Level["L1_3"] = 13] = "L1_3";
		    Level[Level["L2"] = 20] = "L2";
		    Level[Level["L2_1"] = 21] = "L2_1";
		    Level[Level["L2_2"] = 22] = "L2_2";
		    Level[Level["L3"] = 30] = "L3";
		    Level[Level["L3_1"] = 31] = "L3_1";
		    Level[Level["L3_2"] = 32] = "L3_2";
		    Level[Level["L4"] = 40] = "L4";
		    Level[Level["L4_1"] = 41] = "L4_1";
		    Level[Level["L4_2"] = 42] = "L4_2";
		    Level[Level["L5"] = 50] = "L5";
		    Level[Level["L5_1"] = 51] = "L5_1";
		    Level[Level["L5_2"] = 52] = "L5_2";
		})(Level || (lib$3.Level = Level = {}));
		/**
		 * Represents a parsed h264 profile-level-id value.
		 */
		class ProfileLevelId {
		    constructor(profile, level) {
		        this.profile = profile;
		        this.level = level;
		    }
		}
		lib$3.ProfileLevelId = ProfileLevelId;
		// Default ProfileLevelId.
		//
		// TODO: The default should really be profile Baseline and level 1 according to
		// the spec: https://tools.ietf.org/html/rfc6184#section-8.1. In order to not
		// break backwards compatibility with older versions of WebRTC where external
		// codecs don't have any parameters, use profile ConstrainedBaseline level 3_1
		// instead. This workaround will only be done in an interim period to allow
		// external clients to update their code.
		//
		// http://crbug/webrtc/6337.
		const DefaultProfileLevelId = new ProfileLevelId(Profile.ConstrainedBaseline, Level.L3_1);
		/**
		 * Class for matching bit patterns such as "x1xx0000" where 'x' is allowed to
		 * be either 0 or 1.
		 */
		class BitPattern {
		    constructor(str) {
		        this.mask = ~byteMaskString('x', str);
		        this.masked_value = byteMaskString('1', str);
		    }
		    isMatch(value) {
		        return this.masked_value === (value & this.mask);
		    }
		}
		/**
		 * Class for converting between profile_idc/profile_iop to Profile.
		 */
		class ProfilePattern {
		    constructor(profile_idc, profile_iop, profile) {
		        this.profile_idc = profile_idc;
		        this.profile_iop = profile_iop;
		        this.profile = profile;
		    }
		}
		// This is from https://tools.ietf.org/html/rfc6184#section-8.1.
		const ProfilePatterns = [
		    new ProfilePattern(0x42, new BitPattern('x1xx0000'), Profile.ConstrainedBaseline),
		    new ProfilePattern(0x4d, new BitPattern('1xxx0000'), Profile.ConstrainedBaseline),
		    new ProfilePattern(0x58, new BitPattern('11xx0000'), Profile.ConstrainedBaseline),
		    new ProfilePattern(0x42, new BitPattern('x0xx0000'), Profile.Baseline),
		    new ProfilePattern(0x58, new BitPattern('10xx0000'), Profile.Baseline),
		    new ProfilePattern(0x4d, new BitPattern('0x0x0000'), Profile.Main),
		    new ProfilePattern(0x64, new BitPattern('00000000'), Profile.High),
		    new ProfilePattern(0x64, new BitPattern('00001100'), Profile.ConstrainedHigh),
		    new ProfilePattern(0xf4, new BitPattern('00000000'), Profile.PredictiveHigh444),
		];
		// This is from ITU-T H.264 (02/2016) Table A-1 – Level limits.
		const LevelConstraints = [
		    {
		        max_macroblocks_per_second: 1485,
		        max_macroblock_frame_size: 99,
		        level: Level.L1,
		    },
		    {
		        max_macroblocks_per_second: 1485,
		        max_macroblock_frame_size: 99,
		        level: Level.L1_b,
		    },
		    {
		        max_macroblocks_per_second: 3000,
		        max_macroblock_frame_size: 396,
		        level: Level.L1_1,
		    },
		    {
		        max_macroblocks_per_second: 6000,
		        max_macroblock_frame_size: 396,
		        level: Level.L1_2,
		    },
		    {
		        max_macroblocks_per_second: 11880,
		        max_macroblock_frame_size: 396,
		        level: Level.L1_3,
		    },
		    {
		        max_macroblocks_per_second: 11880,
		        max_macroblock_frame_size: 396,
		        level: Level.L2,
		    },
		    {
		        max_macroblocks_per_second: 19800,
		        max_macroblock_frame_size: 792,
		        level: Level.L2_1,
		    },
		    {
		        max_macroblocks_per_second: 20250,
		        max_macroblock_frame_size: 1620,
		        level: Level.L2_2,
		    },
		    {
		        max_macroblocks_per_second: 40500,
		        max_macroblock_frame_size: 1620,
		        level: Level.L3,
		    },
		    {
		        max_macroblocks_per_second: 108000,
		        max_macroblock_frame_size: 3600,
		        level: Level.L3_1,
		    },
		    {
		        max_macroblocks_per_second: 216000,
		        max_macroblock_frame_size: 5120,
		        level: Level.L3_2,
		    },
		    {
		        max_macroblocks_per_second: 245760,
		        max_macroblock_frame_size: 8192,
		        level: Level.L4,
		    },
		    {
		        max_macroblocks_per_second: 245760,
		        max_macroblock_frame_size: 8192,
		        level: Level.L4_1,
		    },
		    {
		        max_macroblocks_per_second: 522240,
		        max_macroblock_frame_size: 8704,
		        level: Level.L4_2,
		    },
		    {
		        max_macroblocks_per_second: 589824,
		        max_macroblock_frame_size: 22080,
		        level: Level.L5,
		    },
		    {
		        max_macroblocks_per_second: 983040,
		        max_macroblock_frame_size: 36864,
		        level: Level.L5_1,
		    },
		    {
		        max_macroblocks_per_second: 2073600,
		        max_macroblock_frame_size: 36864,
		        level: Level.L5_2,
		    },
		];
		/**
		 * Parse profile level id that is represented as a string of 3 hex bytes.
		 * Nothing will be returned if the string is not a recognized H264 profile
		 * level id.
		 */
		function parseProfileLevelId(str) {
		    // For level_idc=11 and profile_idc=0x42, 0x4D, or 0x58, the constraint set3
		    // flag specifies if level 1b or level 1.1 is used.
		    const ConstraintSet3Flag = 0x10;
		    // The string should consist of 3 bytes in hexadecimal format.
		    if (typeof str !== 'string' || str.length !== 6) {
		        return undefined;
		    }
		    const profile_level_id_numeric = parseInt(str, 16);
		    if (profile_level_id_numeric === 0) {
		        return undefined;
		    }
		    // Separate into three bytes.
		    const level_idc = (profile_level_id_numeric & 0xff);
		    const profile_iop = (profile_level_id_numeric >> 8) & 0xff;
		    const profile_idc = (profile_level_id_numeric >> 16) & 0xff;
		    // Parse level based on level_idc and constraint set 3 flag.
		    let level;
		    switch (level_idc) {
		        case Level.L1_1: {
		            level =
		                (profile_iop & ConstraintSet3Flag) !== 0 ? Level.L1_b : Level.L1_1;
		            break;
		        }
		        case Level.L1:
		        case Level.L1_2:
		        case Level.L1_3:
		        case Level.L2:
		        case Level.L2_1:
		        case Level.L2_2:
		        case Level.L3:
		        case Level.L3_1:
		        case Level.L3_2:
		        case Level.L4:
		        case Level.L4_1:
		        case Level.L4_2:
		        case Level.L5:
		        case Level.L5_1:
		        case Level.L5_2: {
		            level = level_idc;
		            break;
		        }
		        // Unrecognized level_idc.
		        default: {
		            logger.warn(`parseProfileLevelId() | unrecognized level_idc [str:${str}, level_idc:${level_idc}]`);
		            return undefined;
		        }
		    }
		    // Parse profile_idc/profile_iop into a Profile enum.
		    for (const pattern of ProfilePatterns) {
		        if (profile_idc === pattern.profile_idc &&
		            pattern.profile_iop.isMatch(profile_iop)) {
		            logger.debug(`parseProfileLevelId() | result [str:${str}, profile:${pattern.profile}, level:${level}]`);
		            return new ProfileLevelId(pattern.profile, level);
		        }
		    }
		    logger.warn(`parseProfileLevelId() | unrecognized profile_idc/profile_iop combination [str:${str}, profile_idc:${profile_idc}, profile_iop:${profile_iop}]`);
		    return undefined;
		}
		/**
		 * Returns canonical string representation as three hex bytes of the profile
		 * level id, or returns nothing for invalid profile level ids.
		 */
		function profileLevelIdToString(profile_level_id) {
		    // Handle special case level == 1b.
		    if (profile_level_id.level == Level.L1_b) {
		        switch (profile_level_id.profile) {
		            case Profile.ConstrainedBaseline: {
		                return '42f00b';
		            }
		            case Profile.Baseline: {
		                return '42100b';
		            }
		            case Profile.Main: {
		                return '4d100b';
		            }
		            // Level 1_b is not allowed for other profiles.
		            default: {
		                logger.warn(`profileLevelIdToString() | Level 1_b not is allowed for profile ${profile_level_id.profile}`);
		                return undefined;
		            }
		        }
		    }
		    let profile_idc_iop_string;
		    switch (profile_level_id.profile) {
		        case Profile.ConstrainedBaseline: {
		            profile_idc_iop_string = '42e0';
		            break;
		        }
		        case Profile.Baseline: {
		            profile_idc_iop_string = '4200';
		            break;
		        }
		        case Profile.Main: {
		            profile_idc_iop_string = '4d00';
		            break;
		        }
		        case Profile.ConstrainedHigh: {
		            profile_idc_iop_string = '640c';
		            break;
		        }
		        case Profile.High: {
		            profile_idc_iop_string = '6400';
		            break;
		        }
		        case Profile.PredictiveHigh444: {
		            profile_idc_iop_string = 'f400';
		            break;
		        }
		        default: {
		            logger.warn(`profileLevelIdToString() | unrecognized profile ${profile_level_id.profile}`);
		            return undefined;
		        }
		    }
		    let levelStr = profile_level_id.level.toString(16);
		    if (levelStr.length === 1) {
		        levelStr = `0${levelStr}`;
		    }
		    return `${profile_idc_iop_string}${levelStr}`;
		}
		/**
		 * Returns a human friendly name for the given profile.
		 */
		function profileToString(profile) {
		    switch (profile) {
		        case Profile.ConstrainedBaseline: {
		            return 'ConstrainedBaseline';
		        }
		        case Profile.Baseline: {
		            return 'Baseline';
		        }
		        case Profile.Main: {
		            return 'Main';
		        }
		        case Profile.ConstrainedHigh: {
		            return 'ConstrainedHigh';
		        }
		        case Profile.High: {
		            return 'High';
		        }
		        case Profile.PredictiveHigh444: {
		            return 'PredictiveHigh444';
		        }
		        default: {
		            logger.warn(`profileToString() | unrecognized profile ${profile}`);
		            return undefined;
		        }
		    }
		}
		/**
		 * Returns a human friendly name for the given level.
		 */
		function levelToString(level) {
		    switch (level) {
		        case Level.L1_b: {
		            return '1b';
		        }
		        case Level.L1: {
		            return '1';
		        }
		        case Level.L1_1: {
		            return '1.1';
		        }
		        case Level.L1_2: {
		            return '1.2';
		        }
		        case Level.L1_3: {
		            return '1.3';
		        }
		        case Level.L2: {
		            return '2';
		        }
		        case Level.L2_1: {
		            return '2.1';
		        }
		        case Level.L2_2: {
		            return '2.2';
		        }
		        case Level.L3: {
		            return '3';
		        }
		        case Level.L3_1: {
		            return '3.1';
		        }
		        case Level.L3_2: {
		            return '3.2';
		        }
		        case Level.L4: {
		            return '4';
		        }
		        case Level.L4_1: {
		            return '4.1';
		        }
		        case Level.L4_2: {
		            return '4.2';
		        }
		        case Level.L5: {
		            return '5';
		        }
		        case Level.L5_1: {
		            return '5.1';
		        }
		        case Level.L5_2: {
		            return '5.2';
		        }
		        default: {
		            logger.warn(`levelToString() | unrecognized level ${level}`);
		            return undefined;
		        }
		    }
		}
		/**
		 * Parse profile level id that is represented as a string of 3 hex bytes
		 * contained in an SDP key-value map. A default profile level id will be
		 * returned if the profile-level-id key is missing. Nothing will be returned
		 * if the key is present but the string is invalid.
		 */
		function parseSdpProfileLevelId(params = {}) {
		    const profile_level_id = params['profile-level-id'];
		    return profile_level_id
		        ? parseProfileLevelId(profile_level_id)
		        : DefaultProfileLevelId;
		}
		/**
		 * Returns true if the codec parameters have the same H264 profile, i.e. the
		 * same H264 profile (Baseline, High, etc).
		 */
		function isSameProfile(params1 = {}, params2 = {}) {
		    const profile_level_id_1 = parseSdpProfileLevelId(params1);
		    const profile_level_id_2 = parseSdpProfileLevelId(params2);
		    // Compare H264 profiles, but not levels.
		    return Boolean(profile_level_id_1 &&
		        profile_level_id_2 &&
		        profile_level_id_1.profile === profile_level_id_2.profile);
		}
		/**
		 * Returns true if the codec parameters have the same H264 profile, i.e. the
		 * same H264 profile (Baseline, High, etc) and same level.
		 */
		function isSameProfileAndLevel(params1 = {}, params2 = {}) {
		    const profile_level_id_1 = parseSdpProfileLevelId(params1);
		    const profile_level_id_2 = parseSdpProfileLevelId(params2);
		    // Compare H264 profiles, but not levels.
		    return Boolean(profile_level_id_1 &&
		        profile_level_id_2 &&
		        profile_level_id_1.profile === profile_level_id_2.profile &&
		        profile_level_id_1.level == profile_level_id_2.level);
		}
		/**
		 * Generate codec parameters that will be used as answer in an SDP negotiation
		 * based on local supported parameters and remote offered parameters. Both
		 * local_supported_params and remote_offered_params represent sendrecv media
		 * descriptions, i.e they are a mix of both encode and decode capabilities. In
		 * theory, when the profile in local_supported_params represent a strict
		 * superset of the profile in remote_offered_params, we could limit the profile
		 * in the answer to the profile in remote_offered_params.
		 *
		 * However, to simplify the code, each supported H264 profile should be listed
		 * explicitly in the list of local supported codecs, even if they are redundant.
		 * Then each local codec in the list should be tested one at a time against the
		 * remote codec, and only when the profiles are equal should this function be
		 * called. Therefore, this function does not need to handle profile intersection,
		 * and the profile of local_supported_params and remote_offered_params must be
		 * equal before calling this function. The parameters that are used when
		 * negotiating are the level part of profile-level-id and
		 * level-asymmetry-allowed.
		 */
		function generateProfileLevelIdStringForAnswer(local_supported_params = {}, remote_offered_params = {}) {
		    // If both local and remote params do not contain profile-level-id, they are
		    // both using the default profile. In this case, don't return anything.
		    if (!local_supported_params['profile-level-id'] &&
		        !remote_offered_params['profile-level-id']) {
		        logger.warn('generateProfileLevelIdStringForAnswer() | profile-level-id missing in local and remote params');
		        return undefined;
		    }
		    // Parse profile-level-ids.
		    const local_profile_level_id = parseSdpProfileLevelId(local_supported_params);
		    const remote_profile_level_id = parseSdpProfileLevelId(remote_offered_params);
		    // The local and remote codec must have valid and equal H264 Profiles.
		    if (!local_profile_level_id) {
		        throw new TypeError('invalid local_profile_level_id');
		    }
		    if (!remote_profile_level_id) {
		        throw new TypeError('invalid remote_profile_level_id');
		    }
		    if (local_profile_level_id.profile !== remote_profile_level_id.profile) {
		        throw new TypeError('H264 Profile mismatch');
		    }
		    // Parse level information.
		    const level_asymmetry_allowed = isLevelAsymmetryAllowed(local_supported_params) &&
		        isLevelAsymmetryAllowed(remote_offered_params);
		    const local_level = local_profile_level_id.level;
		    const remote_level = remote_profile_level_id.level;
		    const min_level = minLevel(local_level, remote_level);
		    // Determine answer level. When level asymmetry is not allowed, level upgrade
		    // is not allowed, i.e., the level in the answer must be equal to or lower
		    // than the level in the offer.
		    const answer_level = level_asymmetry_allowed ? local_level : min_level;
		    logger.debug(`generateProfileLevelIdStringForAnswer() | result [profile:${local_profile_level_id.profile}, level:${answer_level}]`);
		    // Return the resulting profile-level-id for the answer parameters.
		    return profileLevelIdToString(new ProfileLevelId(local_profile_level_id.profile, answer_level));
		}
		/**
		 * Given that a decoder supports up to a given frame size (in pixels) at up to
		 * a given number of frames per second, return the highest H264 level where it
		 * can guarantee that it will be able to support all valid encoded streams that
		 * are within that level.
		 */
		function supportedLevel(max_frame_pixel_count, max_fps) {
		    const PixelsPerMacroblock = 16 * 16;
		    for (let i = LevelConstraints.length - 1; i >= 0; --i) {
		        const level_constraint = LevelConstraints[i];
		        if (level_constraint.max_macroblock_frame_size * PixelsPerMacroblock <=
		            max_frame_pixel_count &&
		            level_constraint.max_macroblocks_per_second <=
		                max_fps * level_constraint.max_macroblock_frame_size) {
		            logger.debug(`supportedLevel() | result [max_frame_pixel_count:${max_frame_pixel_count}, max_fps:${max_fps}, level:${level_constraint.level}]`);
		            return level_constraint.level;
		        }
		    }
		    // No level supported.
		    logger.warn(`supportedLevel() | no level supported [max_frame_pixel_count:${max_frame_pixel_count}, max_fps:${max_fps}]`);
		    return undefined;
		}
		/**
		 * Convert a string of 8 characters into a byte where the positions containing
		 * character c will have their bit set. For example, c = 'x', str = "x1xx0000"
		 * will return 0b10110000.
		 */
		function byteMaskString(c, str) {
		    return ((Number(str[0] === c) << 7) |
		        (Number(str[1] === c) << 6) |
		        (Number(str[2] === c) << 5) |
		        (Number(str[3] === c) << 4) |
		        (Number(str[4] === c) << 3) |
		        (Number(str[5] === c) << 2) |
		        (Number(str[6] === c) << 1) |
		        (Number(str[7] === c) << 0));
		}
		// Compare H264 levels and handle the level 1b case.
		function isLessLevel(a, b) {
		    if (a === Level.L1_b) {
		        return b !== Level.L1 && b !== Level.L1_b;
		    }
		    if (b === Level.L1_b) {
		        return a !== Level.L1;
		    }
		    return a < b;
		}
		function minLevel(a, b) {
		    return isLessLevel(a, b) ? a : b;
		}
		function isLevelAsymmetryAllowed(params = {}) {
		    const level_asymmetry_allowed = params['level-asymmetry-allowed'];
		    return (level_asymmetry_allowed === true ||
		        level_asymmetry_allowed === 1 ||
		        level_asymmetry_allowed === '1');
		}
		return lib$3;
	}

	var hasRequiredOrtc;

	function requireOrtc () {
		if (hasRequiredOrtc) return ortc;
		hasRequiredOrtc = 1;
		Object.defineProperty(ortc, "__esModule", { value: true });
		ortc.validateRtpCapabilities = validateRtpCapabilities;
		ortc.validateRtpParameters = validateRtpParameters;
		ortc.validateSctpStreamParameters = validateSctpStreamParameters;
		ortc.validateSctpCapabilities = validateSctpCapabilities;
		ortc.getExtendedRtpCapabilities = getExtendedRtpCapabilities;
		ortc.getRecvRtpCapabilities = getRecvRtpCapabilities;
		ortc.getSendingRtpParameters = getSendingRtpParameters;
		ortc.getSendingRemoteRtpParameters = getSendingRemoteRtpParameters;
		ortc.reduceCodecs = reduceCodecs;
		ortc.generateProbatorRtpParameters = generateProbatorRtpParameters;
		ortc.canSend = canSend;
		ortc.canReceive = canReceive;
		const h264 = requireLib$4();
		const utils = requireUtils$2();
		const RTP_PROBATOR_MID = 'probator';
		const RTP_PROBATOR_SSRC = 1234;
		const RTP_PROBATOR_CODEC_PAYLOAD_TYPE = 127;
		/**
		 * Validates RtpCapabilities. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateRtpCapabilities(caps) {
		    if (typeof caps !== 'object') {
		        throw new TypeError('caps is not an object');
		    }
		    // codecs is optional. If unset, fill with an empty array.
		    if (caps.codecs && !Array.isArray(caps.codecs)) {
		        throw new TypeError('caps.codecs is not an array');
		    }
		    else if (!caps.codecs) {
		        caps.codecs = [];
		    }
		    for (const codec of caps.codecs) {
		        validateRtpCodecCapability(codec);
		    }
		    // headerExtensions is optional. If unset, fill with an empty array.
		    if (caps.headerExtensions && !Array.isArray(caps.headerExtensions)) {
		        throw new TypeError('caps.headerExtensions is not an array');
		    }
		    else if (!caps.headerExtensions) {
		        caps.headerExtensions = [];
		    }
		    for (const ext of caps.headerExtensions) {
		        validateRtpHeaderExtension(ext);
		    }
		}
		/**
		 * Validates RtpParameters. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateRtpParameters(params) {
		    if (typeof params !== 'object') {
		        throw new TypeError('params is not an object');
		    }
		    // mid is optional.
		    if (params.mid && typeof params.mid !== 'string') {
		        throw new TypeError('params.mid is not a string');
		    }
		    // codecs is mandatory.
		    if (!Array.isArray(params.codecs)) {
		        throw new TypeError('missing params.codecs');
		    }
		    for (const codec of params.codecs) {
		        validateRtpCodecParameters(codec);
		    }
		    // headerExtensions is optional. If unset, fill with an empty array.
		    if (params.headerExtensions && !Array.isArray(params.headerExtensions)) {
		        throw new TypeError('params.headerExtensions is not an array');
		    }
		    else if (!params.headerExtensions) {
		        params.headerExtensions = [];
		    }
		    for (const ext of params.headerExtensions) {
		        validateRtpHeaderExtensionParameters(ext);
		    }
		    // encodings is optional. If unset, fill with an empty array.
		    if (params.encodings && !Array.isArray(params.encodings)) {
		        throw new TypeError('params.encodings is not an array');
		    }
		    else if (!params.encodings) {
		        params.encodings = [];
		    }
		    for (const encoding of params.encodings) {
		        validateRtpEncodingParameters(encoding);
		    }
		    // rtcp is optional. If unset, fill with an empty object.
		    if (params.rtcp && typeof params.rtcp !== 'object') {
		        throw new TypeError('params.rtcp is not an object');
		    }
		    else if (!params.rtcp) {
		        params.rtcp = {};
		    }
		    validateRtcpParameters(params.rtcp);
		}
		/**
		 * Validates SctpStreamParameters. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateSctpStreamParameters(params) {
		    if (typeof params !== 'object') {
		        throw new TypeError('params is not an object');
		    }
		    // streamId is mandatory.
		    if (typeof params.streamId !== 'number') {
		        throw new TypeError('missing params.streamId');
		    }
		    // ordered is optional.
		    let orderedGiven = false;
		    if (typeof params.ordered === 'boolean') {
		        orderedGiven = true;
		    }
		    else {
		        params.ordered = true;
		    }
		    // maxPacketLifeTime is optional.
		    if (params.maxPacketLifeTime &&
		        typeof params.maxPacketLifeTime !== 'number') {
		        throw new TypeError('invalid params.maxPacketLifeTime');
		    }
		    // maxRetransmits is optional.
		    if (params.maxRetransmits && typeof params.maxRetransmits !== 'number') {
		        throw new TypeError('invalid params.maxRetransmits');
		    }
		    if (params.maxPacketLifeTime && params.maxRetransmits) {
		        throw new TypeError('cannot provide both maxPacketLifeTime and maxRetransmits');
		    }
		    if (orderedGiven &&
		        params.ordered &&
		        (params.maxPacketLifeTime || params.maxRetransmits)) {
		        throw new TypeError('cannot be ordered with maxPacketLifeTime or maxRetransmits');
		    }
		    else if (!orderedGiven &&
		        (params.maxPacketLifeTime || params.maxRetransmits)) {
		        params.ordered = false;
		    }
		    // label is optional.
		    if (params.label && typeof params.label !== 'string') {
		        throw new TypeError('invalid params.label');
		    }
		    // protocol is optional.
		    if (params.protocol && typeof params.protocol !== 'string') {
		        throw new TypeError('invalid params.protocol');
		    }
		}
		/**
		 * Validates SctpCapabilities. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateSctpCapabilities(caps) {
		    if (typeof caps !== 'object') {
		        throw new TypeError('caps is not an object');
		    }
		    // numStreams is mandatory.
		    if (!caps.numStreams || typeof caps.numStreams !== 'object') {
		        throw new TypeError('missing caps.numStreams');
		    }
		    validateNumSctpStreams(caps.numStreams);
		}
		/**
		 * Generate extended RTP capabilities for sending and receiving.
		 *
		 * Resulting codecs keep order preferrred by local or remote capabilities
		 * depending on `preferLocalCodecsOrder`.
		 */
		function getExtendedRtpCapabilities(localCaps, remoteCaps, preferLocalCodecsOrder) {
		    const extendedRtpCapabilities = {
		        codecs: [],
		        headerExtensions: [],
		    };
		    // Match media codecs and keep the order preferred by local capabilities.
		    if (preferLocalCodecsOrder) {
		        for (const localCodec of localCaps.codecs ?? []) {
		            if (isRtxCodec(localCodec)) {
		                continue;
		            }
		            const matchingRemoteCodec = (remoteCaps.codecs ?? []).find((remoteCodec) => matchCodecs(remoteCodec, localCodec, { strict: true, modify: true }));
		            if (!matchingRemoteCodec) {
		                continue;
		            }
		            const extendedCodec = {
		                mimeType: localCodec.mimeType,
		                kind: localCodec.kind,
		                clockRate: localCodec.clockRate,
		                channels: localCodec.channels,
		                localPayloadType: localCodec.preferredPayloadType,
		                localRtxPayloadType: undefined,
		                remotePayloadType: matchingRemoteCodec.preferredPayloadType,
		                remoteRtxPayloadType: undefined,
		                localParameters: localCodec.parameters,
		                remoteParameters: matchingRemoteCodec.parameters,
		                rtcpFeedback: reduceRtcpFeedback(localCodec, matchingRemoteCodec),
		            };
		            extendedRtpCapabilities.codecs.push(extendedCodec);
		        }
		    }
		    // Match media codecs and keep the order preferred by remote capabilities.
		    else {
		        for (const remoteCodec of remoteCaps.codecs ?? []) {
		            if (isRtxCodec(remoteCodec)) {
		                continue;
		            }
		            const matchingLocalCodec = (localCaps.codecs ?? []).find((localCodec) => matchCodecs(localCodec, remoteCodec, { strict: true, modify: true }));
		            if (!matchingLocalCodec) {
		                continue;
		            }
		            const extendedCodec = {
		                mimeType: matchingLocalCodec.mimeType,
		                kind: matchingLocalCodec.kind,
		                clockRate: matchingLocalCodec.clockRate,
		                channels: matchingLocalCodec.channels,
		                localPayloadType: matchingLocalCodec.preferredPayloadType,
		                localRtxPayloadType: undefined,
		                remotePayloadType: remoteCodec.preferredPayloadType,
		                remoteRtxPayloadType: undefined,
		                localParameters: matchingLocalCodec.parameters,
		                remoteParameters: remoteCodec.parameters,
		                rtcpFeedback: reduceRtcpFeedback(matchingLocalCodec, remoteCodec),
		            };
		            extendedRtpCapabilities.codecs.push(extendedCodec);
		        }
		    }
		    // Match RTX codecs.
		    for (const extendedCodec of extendedRtpCapabilities.codecs) {
		        const matchingLocalRtxCodec = localCaps.codecs.find((localCodec) => isRtxCodec(localCodec) &&
		            localCodec.parameters.apt === extendedCodec.localPayloadType);
		        const matchingRemoteRtxCodec = remoteCaps.codecs.find((remoteCodec) => isRtxCodec(remoteCodec) &&
		            remoteCodec.parameters.apt === extendedCodec.remotePayloadType);
		        if (matchingLocalRtxCodec && matchingRemoteRtxCodec) {
		            extendedCodec.localRtxPayloadType =
		                matchingLocalRtxCodec.preferredPayloadType;
		            extendedCodec.remoteRtxPayloadType =
		                matchingRemoteRtxCodec.preferredPayloadType;
		        }
		    }
		    // Match header extensions.
		    for (const remoteExt of remoteCaps.headerExtensions) {
		        const matchingLocalExt = localCaps.headerExtensions.find((localExt) => matchHeaderExtensions(localExt, remoteExt));
		        if (!matchingLocalExt) {
		            continue;
		        }
		        const extendedExt = {
		            kind: remoteExt.kind,
		            uri: remoteExt.uri,
		            sendId: matchingLocalExt.preferredId,
		            recvId: remoteExt.preferredId,
		            encrypt: matchingLocalExt.preferredEncrypt,
		            direction: 'sendrecv',
		        };
		        switch (remoteExt.direction) {
		            case 'sendrecv': {
		                extendedExt.direction = 'sendrecv';
		                break;
		            }
		            case 'recvonly': {
		                extendedExt.direction = 'sendonly';
		                break;
		            }
		            case 'sendonly': {
		                extendedExt.direction = 'recvonly';
		                break;
		            }
		            case 'inactive': {
		                extendedExt.direction = 'inactive';
		                break;
		            }
		        }
		        extendedRtpCapabilities.headerExtensions.push(extendedExt);
		    }
		    return extendedRtpCapabilities;
		}
		/**
		 * Generate RTP capabilities for receiving media based on the given extended
		 * RTP capabilities.
		 */
		function getRecvRtpCapabilities(extendedRtpCapabilities) {
		    const rtpCapabilities = {
		        codecs: [],
		        headerExtensions: [],
		    };
		    for (const extendedCodec of extendedRtpCapabilities.codecs) {
		        const codec = {
		            mimeType: extendedCodec.mimeType,
		            kind: extendedCodec.kind,
		            preferredPayloadType: extendedCodec.remotePayloadType,
		            clockRate: extendedCodec.clockRate,
		            channels: extendedCodec.channels,
		            parameters: extendedCodec.localParameters,
		            rtcpFeedback: extendedCodec.rtcpFeedback,
		        };
		        rtpCapabilities.codecs.push(codec);
		        // Add RTX codec.
		        if (!extendedCodec.remoteRtxPayloadType) {
		            continue;
		        }
		        const rtxCodec = {
		            mimeType: `${extendedCodec.kind}/rtx`,
		            kind: extendedCodec.kind,
		            preferredPayloadType: extendedCodec.remoteRtxPayloadType,
		            clockRate: extendedCodec.clockRate,
		            parameters: {
		                apt: extendedCodec.remotePayloadType,
		            },
		            rtcpFeedback: [],
		        };
		        rtpCapabilities.codecs.push(rtxCodec);
		        // TODO: In the future, we need to add FEC, CN, etc, codecs.
		    }
		    for (const extendedExtension of extendedRtpCapabilities.headerExtensions) {
		        // Ignore RTP extensions not valid for receiving.
		        if (extendedExtension.direction !== 'sendrecv' &&
		            extendedExtension.direction !== 'recvonly') {
		            continue;
		        }
		        const ext = {
		            kind: extendedExtension.kind,
		            uri: extendedExtension.uri,
		            preferredId: extendedExtension.recvId,
		            preferredEncrypt: extendedExtension.encrypt,
		            direction: extendedExtension.direction,
		        };
		        rtpCapabilities.headerExtensions.push(ext);
		    }
		    return rtpCapabilities;
		}
		/**
		 * Generate RTP parameters of the given kind for sending media.
		 * NOTE: mid, encodings and rtcp fields are left empty.
		 */
		function getSendingRtpParameters(kind, extendedRtpCapabilities) {
		    const rtpParameters = {
		        mid: undefined,
		        codecs: [],
		        headerExtensions: [],
		        encodings: [],
		        rtcp: {},
		    };
		    for (const extendedCodec of extendedRtpCapabilities.codecs) {
		        if (extendedCodec.kind !== kind) {
		            continue;
		        }
		        const codec = {
		            mimeType: extendedCodec.mimeType,
		            payloadType: extendedCodec.localPayloadType,
		            clockRate: extendedCodec.clockRate,
		            channels: extendedCodec.channels,
		            parameters: extendedCodec.localParameters,
		            rtcpFeedback: extendedCodec.rtcpFeedback,
		        };
		        rtpParameters.codecs.push(codec);
		        // Add RTX codec.
		        if (extendedCodec.localRtxPayloadType) {
		            const rtxCodec = {
		                mimeType: `${extendedCodec.kind}/rtx`,
		                payloadType: extendedCodec.localRtxPayloadType,
		                clockRate: extendedCodec.clockRate,
		                parameters: {
		                    apt: extendedCodec.localPayloadType,
		                },
		                rtcpFeedback: [],
		            };
		            rtpParameters.codecs.push(rtxCodec);
		        }
		    }
		    for (const extendedExtension of extendedRtpCapabilities.headerExtensions) {
		        // Ignore RTP extensions of a different kind and those not valid for sending.
		        if ((extendedExtension.kind && extendedExtension.kind !== kind) ||
		            (extendedExtension.direction !== 'sendrecv' &&
		                extendedExtension.direction !== 'sendonly')) {
		            continue;
		        }
		        const ext = {
		            uri: extendedExtension.uri,
		            id: extendedExtension.sendId,
		            encrypt: extendedExtension.encrypt,
		            parameters: {},
		        };
		        rtpParameters.headerExtensions.push(ext);
		    }
		    return rtpParameters;
		}
		/**
		 * Generate RTP parameters of the given kind suitable for the remote SDP answer.
		 */
		function getSendingRemoteRtpParameters(kind, extendedRtpCapabilities) {
		    const rtpParameters = {
		        mid: undefined,
		        codecs: [],
		        headerExtensions: [],
		        encodings: [],
		        rtcp: {},
		    };
		    for (const extendedCodec of extendedRtpCapabilities.codecs) {
		        if (extendedCodec.kind !== kind) {
		            continue;
		        }
		        const codec = {
		            mimeType: extendedCodec.mimeType,
		            payloadType: extendedCodec.localPayloadType,
		            clockRate: extendedCodec.clockRate,
		            channels: extendedCodec.channels,
		            parameters: extendedCodec.remoteParameters,
		            rtcpFeedback: extendedCodec.rtcpFeedback,
		        };
		        rtpParameters.codecs.push(codec);
		        // Add RTX codec.
		        if (extendedCodec.localRtxPayloadType) {
		            const rtxCodec = {
		                mimeType: `${extendedCodec.kind}/rtx`,
		                payloadType: extendedCodec.localRtxPayloadType,
		                clockRate: extendedCodec.clockRate,
		                parameters: {
		                    apt: extendedCodec.localPayloadType,
		                },
		                rtcpFeedback: [],
		            };
		            rtpParameters.codecs.push(rtxCodec);
		        }
		    }
		    for (const extendedExtension of extendedRtpCapabilities.headerExtensions) {
		        // Ignore RTP extensions of a different kind and those not valid for sending.
		        if ((extendedExtension.kind && extendedExtension.kind !== kind) ||
		            (extendedExtension.direction !== 'sendrecv' &&
		                extendedExtension.direction !== 'sendonly')) {
		            continue;
		        }
		        const ext = {
		            uri: extendedExtension.uri,
		            id: extendedExtension.sendId,
		            encrypt: extendedExtension.encrypt,
		            parameters: {},
		        };
		        rtpParameters.headerExtensions.push(ext);
		    }
		    // Reduce codecs' RTCP feedback. Use Transport-CC if available, REMB otherwise.
		    if (rtpParameters.headerExtensions.some(ext => ext.uri ===
		        'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01')) {
		        for (const codec of rtpParameters.codecs) {
		            codec.rtcpFeedback = (codec.rtcpFeedback ?? []).filter((fb) => fb.type !== 'goog-remb');
		        }
		    }
		    else if (rtpParameters.headerExtensions.some(ext => ext.uri === 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time')) {
		        for (const codec of rtpParameters.codecs) {
		            codec.rtcpFeedback = (codec.rtcpFeedback ?? []).filter(fb => fb.type !== 'transport-cc');
		        }
		    }
		    else {
		        for (const codec of rtpParameters.codecs) {
		            codec.rtcpFeedback = (codec.rtcpFeedback ?? []).filter((fb) => fb.type !== 'transport-cc' && fb.type !== 'goog-remb');
		        }
		    }
		    return rtpParameters;
		}
		/**
		 * Reduce given codecs by returning an array of codecs "compatible" with the
		 * given capability codec. If no capability codec is given, take the first
		 * one(s).
		 *
		 * Given codecs must be generated by ortc.getSendingRtpParameters() or
		 * ortc.getSendingRemoteRtpParameters().
		 *
		 * The returned array of codecs also include a RTX codec if available.
		 */
		function reduceCodecs(codecs, capCodec) {
		    const filteredCodecs = [];
		    // If no capability codec is given, take the first one (and RTX).
		    if (!capCodec) {
		        filteredCodecs.push(codecs[0]);
		        if (isRtxCodec(codecs[1])) {
		            filteredCodecs.push(codecs[1]);
		        }
		    }
		    // Otherwise look for a compatible set of codecs.
		    else {
		        for (let idx = 0; idx < codecs.length; ++idx) {
		            if (matchCodecs(codecs[idx], capCodec, { strict: true })) {
		                filteredCodecs.push(codecs[idx]);
		                if (isRtxCodec(codecs[idx + 1])) {
		                    filteredCodecs.push(codecs[idx + 1]);
		                }
		                break;
		            }
		        }
		        if (filteredCodecs.length === 0) {
		            throw new TypeError('no matching codec found');
		        }
		    }
		    return filteredCodecs;
		}
		/**
		 * Create RTP parameters for a Consumer for the RTP probator.
		 */
		function generateProbatorRtpParameters(videoRtpParameters) {
		    // Clone given reference video RTP parameters.
		    videoRtpParameters = utils.clone(videoRtpParameters);
		    // This may throw.
		    validateRtpParameters(videoRtpParameters);
		    const rtpParameters = {
		        mid: RTP_PROBATOR_MID,
		        codecs: [],
		        headerExtensions: [],
		        encodings: [{ ssrc: RTP_PROBATOR_SSRC }],
		        rtcp: { cname: 'probator' },
		    };
		    rtpParameters.codecs.push(videoRtpParameters.codecs[0]);
		    rtpParameters.codecs[0].payloadType = RTP_PROBATOR_CODEC_PAYLOAD_TYPE;
		    rtpParameters.headerExtensions = videoRtpParameters.headerExtensions;
		    return rtpParameters;
		}
		/**
		 * Whether media can be sent based on the given RTP capabilities.
		 */
		function canSend(kind, extendedRtpCapabilities) {
		    return extendedRtpCapabilities.codecs.some((codec) => codec.kind === kind);
		}
		/**
		 * Whether the given RTP parameters can be received with the given RTP
		 * capabilities.
		 */
		function canReceive(rtpParameters, extendedRtpCapabilities) {
		    // This may throw.
		    validateRtpParameters(rtpParameters);
		    if (rtpParameters.codecs.length === 0) {
		        return false;
		    }
		    const firstMediaCodec = rtpParameters.codecs[0];
		    return extendedRtpCapabilities.codecs.some((codec) => codec.remotePayloadType === firstMediaCodec.payloadType);
		}
		/**
		 * Validates RtpCodecCapability. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateRtpCodecCapability(codec) {
		    const MimeTypeRegex = new RegExp('^(audio|video)/(.+)', 'i');
		    if (typeof codec !== 'object') {
		        throw new TypeError('codec is not an object');
		    }
		    // mimeType is mandatory.
		    if (!codec.mimeType || typeof codec.mimeType !== 'string') {
		        throw new TypeError('missing codec.mimeType');
		    }
		    const mimeTypeMatch = MimeTypeRegex.exec(codec.mimeType);
		    if (!mimeTypeMatch) {
		        throw new TypeError('invalid codec.mimeType');
		    }
		    // Just override kind with media component of mimeType.
		    codec.kind = mimeTypeMatch[1].toLowerCase();
		    // preferredPayloadType is optional.
		    if (codec.preferredPayloadType &&
		        typeof codec.preferredPayloadType !== 'number') {
		        throw new TypeError('invalid codec.preferredPayloadType');
		    }
		    // clockRate is mandatory.
		    if (typeof codec.clockRate !== 'number') {
		        throw new TypeError('missing codec.clockRate');
		    }
		    // channels is optional. If unset, set it to 1 (just if audio).
		    if (codec.kind === 'audio') {
		        if (typeof codec.channels !== 'number') {
		            codec.channels = 1;
		        }
		    }
		    else {
		        delete codec.channels;
		    }
		    // parameters is optional. If unset, set it to an empty object.
		    if (!codec.parameters || typeof codec.parameters !== 'object') {
		        codec.parameters = {};
		    }
		    for (const key of Object.keys(codec.parameters)) {
		        let value = codec.parameters[key];
		        if (value === undefined) {
		            codec.parameters[key] = '';
		            value = '';
		        }
		        if (typeof value !== 'string' && typeof value !== 'number') {
		            throw new TypeError(`invalid codec parameter [key:${key}s, value:${value}]`);
		        }
		        // Specific parameters validation.
		        if (key === 'apt') {
		            if (typeof value !== 'number') {
		                throw new TypeError('invalid codec apt parameter');
		            }
		        }
		    }
		    // rtcpFeedback is optional. If unset, set it to an empty array.
		    if (!codec.rtcpFeedback || !Array.isArray(codec.rtcpFeedback)) {
		        codec.rtcpFeedback = [];
		    }
		    for (const fb of codec.rtcpFeedback) {
		        validateRtcpFeedback(fb);
		    }
		}
		/**
		 * Validates RtcpFeedback. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateRtcpFeedback(fb) {
		    if (typeof fb !== 'object') {
		        throw new TypeError('fb is not an object');
		    }
		    // type is mandatory.
		    if (!fb.type || typeof fb.type !== 'string') {
		        throw new TypeError('missing fb.type');
		    }
		    // parameter is optional. If unset set it to an empty string.
		    if (!fb.parameter || typeof fb.parameter !== 'string') {
		        fb.parameter = '';
		    }
		}
		/**
		 * Validates RtpHeaderExtension. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateRtpHeaderExtension(ext) {
		    if (typeof ext !== 'object') {
		        throw new TypeError('ext is not an object');
		    }
		    // kind is mandatory.
		    if (ext.kind !== 'audio' && ext.kind !== 'video') {
		        throw new TypeError('invalid ext.kind');
		    }
		    // uri is mandatory.
		    if (!ext.uri || typeof ext.uri !== 'string') {
		        throw new TypeError('missing ext.uri');
		    }
		    // preferredId is mandatory.
		    if (typeof ext.preferredId !== 'number') {
		        throw new TypeError('missing ext.preferredId');
		    }
		    // preferredEncrypt is optional. If unset set it to false.
		    if (ext.preferredEncrypt && typeof ext.preferredEncrypt !== 'boolean') {
		        throw new TypeError('invalid ext.preferredEncrypt');
		    }
		    else if (!ext.preferredEncrypt) {
		        ext.preferredEncrypt = false;
		    }
		    // direction is optional. If unset set it to sendrecv.
		    if (ext.direction && typeof ext.direction !== 'string') {
		        throw new TypeError('invalid ext.direction');
		    }
		    else if (!ext.direction) {
		        ext.direction = 'sendrecv';
		    }
		}
		/**
		 * Validates RtpCodecParameters. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateRtpCodecParameters(codec) {
		    const MimeTypeRegex = new RegExp('^(audio|video)/(.+)', 'i');
		    if (typeof codec !== 'object') {
		        throw new TypeError('codec is not an object');
		    }
		    // mimeType is mandatory.
		    if (!codec.mimeType || typeof codec.mimeType !== 'string') {
		        throw new TypeError('missing codec.mimeType');
		    }
		    const mimeTypeMatch = MimeTypeRegex.exec(codec.mimeType);
		    if (!mimeTypeMatch) {
		        throw new TypeError('invalid codec.mimeType');
		    }
		    // payloadType is mandatory.
		    if (typeof codec.payloadType !== 'number') {
		        throw new TypeError('missing codec.payloadType');
		    }
		    // clockRate is mandatory.
		    if (typeof codec.clockRate !== 'number') {
		        throw new TypeError('missing codec.clockRate');
		    }
		    const kind = mimeTypeMatch[1].toLowerCase();
		    // channels is optional. If unset, set it to 1 (just if audio).
		    if (kind === 'audio') {
		        if (typeof codec.channels !== 'number') {
		            codec.channels = 1;
		        }
		    }
		    else {
		        delete codec.channels;
		    }
		    // parameters is optional. If unset, set it to an empty object.
		    if (!codec.parameters || typeof codec.parameters !== 'object') {
		        codec.parameters = {};
		    }
		    for (const key of Object.keys(codec.parameters)) {
		        let value = codec.parameters[key];
		        if (value === undefined) {
		            codec.parameters[key] = '';
		            value = '';
		        }
		        if (typeof value !== 'string' && typeof value !== 'number') {
		            throw new TypeError(`invalid codec parameter [key:${key}s, value:${value}]`);
		        }
		        // Specific parameters validation.
		        if (key === 'apt') {
		            if (typeof value !== 'number') {
		                throw new TypeError('invalid codec apt parameter');
		            }
		        }
		    }
		    // rtcpFeedback is optional. If unset, set it to an empty array.
		    if (!codec.rtcpFeedback || !Array.isArray(codec.rtcpFeedback)) {
		        codec.rtcpFeedback = [];
		    }
		    for (const fb of codec.rtcpFeedback) {
		        validateRtcpFeedback(fb);
		    }
		}
		/**
		 * Validates RtpHeaderExtensionParameteters. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateRtpHeaderExtensionParameters(ext) {
		    if (typeof ext !== 'object') {
		        throw new TypeError('ext is not an object');
		    }
		    // uri is mandatory.
		    if (!ext.uri || typeof ext.uri !== 'string') {
		        throw new TypeError('missing ext.uri');
		    }
		    // id is mandatory.
		    if (typeof ext.id !== 'number') {
		        throw new TypeError('missing ext.id');
		    }
		    // encrypt is optional. If unset set it to false.
		    if (ext.encrypt && typeof ext.encrypt !== 'boolean') {
		        throw new TypeError('invalid ext.encrypt');
		    }
		    else if (!ext.encrypt) {
		        ext.encrypt = false;
		    }
		    // parameters is optional. If unset, set it to an empty object.
		    if (!ext.parameters || typeof ext.parameters !== 'object') {
		        ext.parameters = {};
		    }
		    for (const key of Object.keys(ext.parameters)) {
		        let value = ext.parameters[key];
		        if (value === undefined) {
		            ext.parameters[key] = '';
		            value = '';
		        }
		        if (typeof value !== 'string' && typeof value !== 'number') {
		            throw new TypeError('invalid header extension parameter');
		        }
		    }
		}
		/**
		 * Validates RtpEncodingParameters. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateRtpEncodingParameters(encoding) {
		    if (typeof encoding !== 'object') {
		        throw new TypeError('encoding is not an object');
		    }
		    // ssrc is optional.
		    if (encoding.ssrc && typeof encoding.ssrc !== 'number') {
		        throw new TypeError('invalid encoding.ssrc');
		    }
		    // rid is optional.
		    if (encoding.rid && typeof encoding.rid !== 'string') {
		        throw new TypeError('invalid encoding.rid');
		    }
		    // rtx is optional.
		    if (encoding.rtx && typeof encoding.rtx !== 'object') {
		        throw new TypeError('invalid encoding.rtx');
		    }
		    else if (encoding.rtx) {
		        // RTX ssrc is mandatory if rtx is present.
		        if (typeof encoding.rtx.ssrc !== 'number') {
		            throw new TypeError('missing encoding.rtx.ssrc');
		        }
		    }
		    // dtx is optional. If unset set it to false.
		    if (!encoding.dtx || typeof encoding.dtx !== 'boolean') {
		        encoding.dtx = false;
		    }
		    // scalabilityMode is optional.
		    if (encoding.scalabilityMode &&
		        typeof encoding.scalabilityMode !== 'string') {
		        throw new TypeError('invalid encoding.scalabilityMode');
		    }
		}
		/**
		 * Validates RtcpParameters. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateRtcpParameters(rtcp) {
		    if (typeof rtcp !== 'object') {
		        throw new TypeError('rtcp is not an object');
		    }
		    // cname is optional.
		    if (rtcp.cname && typeof rtcp.cname !== 'string') {
		        throw new TypeError('invalid rtcp.cname');
		    }
		    // reducedSize is optional. If unset set it to true.
		    if (!rtcp.reducedSize || typeof rtcp.reducedSize !== 'boolean') {
		        rtcp.reducedSize = true;
		    }
		}
		/**
		 * Validates NumSctpStreams. It may modify given data by adding missing
		 * fields with default values.
		 * It throws if invalid.
		 */
		function validateNumSctpStreams(numStreams) {
		    if (typeof numStreams !== 'object') {
		        throw new TypeError('numStreams is not an object');
		    }
		    // OS is mandatory.
		    if (typeof numStreams.OS !== 'number') {
		        throw new TypeError('missing numStreams.OS');
		    }
		    // MIS is mandatory.
		    if (typeof numStreams.MIS !== 'number') {
		        throw new TypeError('missing numStreams.MIS');
		    }
		}
		function isRtxCodec(codec) {
		    if (!codec) {
		        return false;
		    }
		    return /.+\/rtx$/i.test(codec.mimeType);
		}
		function matchCodecs(aCodec, bCodec, { strict = false, modify = false } = {}) {
		    const aMimeType = aCodec.mimeType.toLowerCase();
		    const bMimeType = bCodec.mimeType.toLowerCase();
		    if (aMimeType !== bMimeType) {
		        return false;
		    }
		    if (aCodec.clockRate !== bCodec.clockRate) {
		        return false;
		    }
		    if (aCodec.channels !== bCodec.channels) {
		        return false;
		    }
		    // Per codec special checks.
		    switch (aMimeType) {
		        case 'video/h264': {
		            if (strict) {
		                const aPacketizationMode = aCodec.parameters['packetization-mode'] ?? 0;
		                const bPacketizationMode = bCodec.parameters['packetization-mode'] ?? 0;
		                if (aPacketizationMode !== bPacketizationMode) {
		                    return false;
		                }
		                if (!h264.isSameProfile(aCodec.parameters, bCodec.parameters)) {
		                    return false;
		                }
		                let selectedProfileLevelId;
		                try {
		                    selectedProfileLevelId = h264.generateProfileLevelIdStringForAnswer(aCodec.parameters, bCodec.parameters);
		                }
		                catch (error) {
		                    return false;
		                }
		                if (modify) {
		                    if (selectedProfileLevelId) {
		                        aCodec.parameters['profile-level-id'] = selectedProfileLevelId;
		                        bCodec.parameters['profile-level-id'] = selectedProfileLevelId;
		                    }
		                    else {
		                        delete aCodec.parameters['profile-level-id'];
		                        delete bCodec.parameters['profile-level-id'];
		                    }
		                }
		            }
		            break;
		        }
		        case 'video/vp9': {
		            if (strict) {
		                const aProfileId = aCodec.parameters['profile-id'] ?? 0;
		                const bProfileId = bCodec.parameters['profile-id'] ?? 0;
		                if (aProfileId !== bProfileId) {
		                    return false;
		                }
		            }
		            break;
		        }
		    }
		    return true;
		}
		function matchHeaderExtensions(aExt, bExt) {
		    if (aExt.kind && bExt.kind && aExt.kind !== bExt.kind) {
		        return false;
		    }
		    if (aExt.uri !== bExt.uri) {
		        return false;
		    }
		    return true;
		}
		function reduceRtcpFeedback(codecA, codecB) {
		    const reducedRtcpFeedback = [];
		    for (const aFb of codecA.rtcpFeedback ?? []) {
		        const matchingBFb = (codecB.rtcpFeedback ?? []).find((bFb) => bFb.type === aFb.type &&
		            (bFb.parameter === aFb.parameter || (!bFb.parameter && !aFb.parameter)));
		        if (matchingBFb) {
		            reducedRtcpFeedback.push(matchingBFb);
		        }
		    }
		    return reducedRtcpFeedback;
		}
		return ortc;
	}

	var Transport = {};

	var lib$2 = {};

	var AwaitQueue = {};

	var Logger = {};

	var hasRequiredLogger;

	function requireLogger () {
		if (hasRequiredLogger) return Logger;
		hasRequiredLogger = 1;
		Object.defineProperty(Logger, "__esModule", { value: true });
		Logger.Logger = void 0;
		const debug = requireSrc();
		const LIB_NAME = 'awaitqueue';
		let Logger$1 = class Logger {
		    _debug;
		    _warn;
		    _error;
		    constructor(prefix) {
		        if (prefix) {
		            this._debug = debug(`${LIB_NAME}:${prefix}`);
		            this._warn = debug(`${LIB_NAME}:WARN:${prefix}`);
		            this._error = debug(`${LIB_NAME}:ERROR:${prefix}`);
		        }
		        else {
		            this._debug = debug(LIB_NAME);
		            this._warn = debug(`${LIB_NAME}:WARN`);
		            this._error = debug(`${LIB_NAME}:ERROR`);
		        }
		        /* eslint-disable no-console */
		        this._debug.log = console.info.bind(console);
		        this._warn.log = console.warn.bind(console);
		        this._error.log = console.error.bind(console);
		        /* eslint-enable no-console */
		    }
		    get debug() {
		        return this._debug;
		    }
		    get warn() {
		        return this._warn;
		    }
		    get error() {
		        return this._error;
		    }
		};
		Logger.Logger = Logger$1;
		return Logger;
	}

	var errors = {};

	var hasRequiredErrors;

	function requireErrors () {
		if (hasRequiredErrors) return errors;
		hasRequiredErrors = 1;
		Object.defineProperty(errors, "__esModule", { value: true });
		errors.AwaitQueueRemovedTaskError = errors.AwaitQueueStoppedError = void 0;
		/**
		 * Custom Error derived class used to reject pending tasks once stop() method
		 * has been called.
		 */
		class AwaitQueueStoppedError extends Error {
		    constructor(message) {
		        super(message ?? 'queue stopped');
		        this.name = 'AwaitQueueStoppedError';
		        if (typeof Error.captureStackTrace === 'function') {
		            Error.captureStackTrace(this, AwaitQueueStoppedError);
		        }
		    }
		}
		errors.AwaitQueueStoppedError = AwaitQueueStoppedError;
		/**
		 * Custom Error derived class used to reject pending tasks once removeTask()
		 * method has been called.
		 */
		class AwaitQueueRemovedTaskError extends Error {
		    constructor(message) {
		        super(message ?? 'queue task removed');
		        this.name = 'AwaitQueueRemovedTaskError';
		        if (typeof Error.captureStackTrace === 'function') {
		            Error.captureStackTrace(this, AwaitQueueRemovedTaskError);
		        }
		    }
		}
		errors.AwaitQueueRemovedTaskError = AwaitQueueRemovedTaskError;
		return errors;
	}

	var hasRequiredAwaitQueue;

	function requireAwaitQueue () {
		if (hasRequiredAwaitQueue) return AwaitQueue;
		hasRequiredAwaitQueue = 1;
		Object.defineProperty(AwaitQueue, "__esModule", { value: true });
		AwaitQueue.AwaitQueue = void 0;
		const Logger_1 = requireLogger();
		const errors_1 = requireErrors();
		const logger = new Logger_1.Logger('AwaitQueue');
		let AwaitQueue$1 = class AwaitQueue {
		    // Queue of pending tasks (map of PendingTasks indexed by id).
		    pendingTasks = new Map();
		    // Incrementing PendingTask id.
		    nextTaskId = 0;
		    // Whether stop() method is stopping all pending tasks.
		    stopping = false;
		    constructor() {
		        logger.debug('constructor()');
		    }
		    get size() {
		        return this.pendingTasks.size;
		    }
		    async push(task, name) {
		        name = name ?? task.name;
		        logger.debug(`push() [name:${name}]`);
		        if (typeof task !== 'function') {
		            throw new TypeError('given task is not a function');
		        }
		        if (name) {
		            try {
		                Object.defineProperty(task, 'name', { value: name });
		            }
		            catch (error) { }
		        }
		        return new Promise((resolve, reject) => {
		            const pendingTask = {
		                id: this.nextTaskId++,
		                task: task,
		                name: name,
		                enqueuedAt: Date.now(),
		                executedAt: undefined,
		                completed: false,
		                resolve: (result) => {
		                    // pendingTask.resolve() can only be called in execute() method. Since
		                    // resolve() was called it means that the task successfully completed.
		                    // However the task may have been stopped before it completed (via
		                    // stop() or remove()) so its completed flag was already set. If this
		                    // is the case, abort here since next task (if any) is already being
		                    // executed.
		                    if (pendingTask.completed) {
		                        return;
		                    }
		                    pendingTask.completed = true;
		                    // Remove the task from the queue.
		                    this.pendingTasks.delete(pendingTask.id);
		                    logger.debug(`resolving task [name:${pendingTask.name}]`);
		                    // Resolve the task with the obtained result.
		                    resolve(result);
		                    // Execute the next pending task (if any).
		                    const [nextPendingTask] = this.pendingTasks.values();
		                    // NOTE: During the resolve() callback the user app may have interacted
		                    // with the queue. For instance, the app may have pushed a task while
		                    // the queue was empty so such a task is already being executed. If so,
		                    // don't execute it twice.
		                    if (nextPendingTask && !nextPendingTask.executedAt) {
		                        void this.execute(nextPendingTask);
		                    }
		                },
		                reject: (error) => {
		                    // pendingTask.reject() can be called within execute() method if the
		                    // task completed with error. However it may have also been called in
		                    // stop() or remove() methods (before or while being executed) so its
		                    // completed flag was already set. If so, abort here since next task
		                    // (if any) is already being executed.
		                    if (pendingTask.completed) {
		                        return;
		                    }
		                    pendingTask.completed = true;
		                    // Remove the task from the queue.
		                    this.pendingTasks.delete(pendingTask.id);
		                    logger.debug(`rejecting task [name:${pendingTask.name}]: %s`, String(error));
		                    // Reject the task with the obtained error.
		                    reject(error);
		                    // Execute the next pending task (if any) unless stop() is running.
		                    if (!this.stopping) {
		                        const [nextPendingTask] = this.pendingTasks.values();
		                        // NOTE: During the reject() callback the user app may have interacted
		                        // with the queue. For instance, the app may have pushed a task while
		                        // the queue was empty so such a task is already being executed. If so,
		                        // don't execute it twice.
		                        if (nextPendingTask && !nextPendingTask.executedAt) {
		                            void this.execute(nextPendingTask);
		                        }
		                    }
		                },
		            };
		            // Append task to the queue.
		            this.pendingTasks.set(pendingTask.id, pendingTask);
		            // And execute it if this is the only task in the queue.
		            if (this.pendingTasks.size === 1) {
		                void this.execute(pendingTask);
		            }
		        });
		    }
		    stop() {
		        logger.debug('stop()');
		        this.stopping = true;
		        for (const pendingTask of this.pendingTasks.values()) {
		            logger.debug(`stop() | stopping task [name:${pendingTask.name}]`);
		            pendingTask.reject(new errors_1.AwaitQueueStoppedError());
		        }
		        this.stopping = false;
		    }
		    remove(taskIdx) {
		        logger.debug(`remove() [taskIdx:${taskIdx}]`);
		        const pendingTask = Array.from(this.pendingTasks.values())[taskIdx];
		        if (!pendingTask) {
		            logger.debug(`stop() | no task with given idx [taskIdx:${taskIdx}]`);
		            return;
		        }
		        pendingTask.reject(new errors_1.AwaitQueueRemovedTaskError());
		    }
		    dump() {
		        const now = Date.now();
		        let idx = 0;
		        return Array.from(this.pendingTasks.values()).map(pendingTask => ({
		            idx: idx++,
		            task: pendingTask.task,
		            name: pendingTask.name,
		            enqueuedTime: pendingTask.executedAt
		                ? pendingTask.executedAt - pendingTask.enqueuedAt
		                : now - pendingTask.enqueuedAt,
		            executionTime: pendingTask.executedAt ? now - pendingTask.executedAt : 0,
		        }));
		    }
		    async execute(pendingTask) {
		        logger.debug(`execute() [name:${pendingTask.name}]`);
		        if (pendingTask.executedAt) {
		            throw new Error('task already being executed');
		        }
		        pendingTask.executedAt = Date.now();
		        try {
		            const result = await pendingTask.task();
		            // Resolve the task with its resolved result (if any).
		            pendingTask.resolve(result);
		        }
		        catch (error) {
		            // Reject the task with its rejected error.
		            pendingTask.reject(error);
		        }
		    }
		};
		AwaitQueue.AwaitQueue = AwaitQueue$1;
		return AwaitQueue;
	}

	var hasRequiredLib$3;

	function requireLib$3 () {
		if (hasRequiredLib$3) return lib$2;
		hasRequiredLib$3 = 1;
		(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.AwaitQueueRemovedTaskError = exports.AwaitQueueStoppedError = exports.AwaitQueue = void 0;
			var AwaitQueue_1 = requireAwaitQueue();
			Object.defineProperty(exports, "AwaitQueue", { enumerable: true, get: function () { return AwaitQueue_1.AwaitQueue; } });
			var errors_1 = requireErrors();
			Object.defineProperty(exports, "AwaitQueueStoppedError", { enumerable: true, get: function () { return errors_1.AwaitQueueStoppedError; } });
			Object.defineProperty(exports, "AwaitQueueRemovedTaskError", { enumerable: true, get: function () { return errors_1.AwaitQueueRemovedTaskError; } }); 
		} (lib$2));
		return lib$2;
	}

	var Producer = {};

	var hasRequiredProducer;

	function requireProducer () {
		if (hasRequiredProducer) return Producer;
		hasRequiredProducer = 1;
		Object.defineProperty(Producer, "__esModule", { value: true });
		Producer.Producer = void 0;
		const Logger_1 = requireLogger$2();
		const enhancedEvents_1 = requireEnhancedEvents();
		const errors_1 = requireErrors$1();
		const logger = new Logger_1.Logger('Producer');
		let Producer$1 = class Producer extends enhancedEvents_1.EnhancedEventEmitter {
		    // Id.
		    _id;
		    // Local id.
		    _localId;
		    // Closed flag.
		    _closed = false;
		    // Associated RTCRtpSender.
		    _rtpSender;
		    // Local track.
		    _track;
		    // Producer kind.
		    _kind;
		    // RTP parameters.
		    _rtpParameters;
		    // Paused flag.
		    _paused;
		    // Video max spatial layer.
		    _maxSpatialLayer;
		    // Whether the Producer should call stop() in given tracks.
		    _stopTracks;
		    // Whether the Producer should set track.enabled = false when paused.
		    _disableTrackOnPause;
		    // Whether we should replace the RTCRtpSender.track with null when paused.
		    _zeroRtpOnPause;
		    // App custom data.
		    _appData;
		    // Observer instance.
		    _observer = new enhancedEvents_1.EnhancedEventEmitter();
		    constructor({ id, localId, rtpSender, track, rtpParameters, stopTracks, disableTrackOnPause, zeroRtpOnPause, appData, }) {
		        super();
		        logger.debug('constructor()');
		        this._id = id;
		        this._localId = localId;
		        this._rtpSender = rtpSender;
		        this._track = track;
		        this._kind = track.kind;
		        this._rtpParameters = rtpParameters;
		        this._paused = disableTrackOnPause ? !track.enabled : false;
		        this._maxSpatialLayer = undefined;
		        this._stopTracks = stopTracks;
		        this._disableTrackOnPause = disableTrackOnPause;
		        this._zeroRtpOnPause = zeroRtpOnPause;
		        this._appData = appData ?? {};
		        this.onTrackEnded = this.onTrackEnded.bind(this);
		        // NOTE: Minor issue. If zeroRtpOnPause is true, we cannot emit the
		        // '@replacetrack' event here, so RTCRtpSender.track won't be null.
		        this.handleTrack();
		    }
		    /**
		     * Producer id.
		     */
		    get id() {
		        return this._id;
		    }
		    /**
		     * Local id.
		     */
		    get localId() {
		        return this._localId;
		    }
		    /**
		     * Whether the Producer is closed.
		     */
		    get closed() {
		        return this._closed;
		    }
		    /**
		     * Media kind.
		     */
		    get kind() {
		        return this._kind;
		    }
		    /**
		     * Associated RTCRtpSender.
		     */
		    get rtpSender() {
		        return this._rtpSender;
		    }
		    /**
		     * The associated track.
		     */
		    get track() {
		        return this._track;
		    }
		    /**
		     * RTP parameters.
		     */
		    get rtpParameters() {
		        return this._rtpParameters;
		    }
		    /**
		     * Whether the Producer is paused.
		     */
		    get paused() {
		        return this._paused;
		    }
		    /**
		     * Max spatial layer.
		     *
		     * @type {Number | undefined}
		     */
		    get maxSpatialLayer() {
		        return this._maxSpatialLayer;
		    }
		    /**
		     * App custom data.
		     */
		    get appData() {
		        return this._appData;
		    }
		    /**
		     * App custom data setter.
		     */
		    set appData(appData) {
		        this._appData = appData;
		    }
		    get observer() {
		        return this._observer;
		    }
		    /**
		     * Closes the Producer.
		     */
		    close() {
		        if (this._closed) {
		            return;
		        }
		        logger.debug('close()');
		        this._closed = true;
		        this.destroyTrack();
		        this.emit('@close');
		        // Emit observer event.
		        this._observer.safeEmit('close');
		    }
		    /**
		     * Transport was closed.
		     */
		    transportClosed() {
		        if (this._closed) {
		            return;
		        }
		        logger.debug('transportClosed()');
		        this._closed = true;
		        this.destroyTrack();
		        this.safeEmit('transportclose');
		        // Emit observer event.
		        this._observer.safeEmit('close');
		    }
		    /**
		     * Get associated RTCRtpSender stats.
		     */
		    async getStats() {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        return new Promise((resolve, reject) => {
		            this.safeEmit('@getstats', resolve, reject);
		        });
		    }
		    /**
		     * Pauses sending media.
		     */
		    pause() {
		        logger.debug('pause()');
		        if (this._closed) {
		            logger.error('pause() | Producer closed');
		            return;
		        }
		        this._paused = true;
		        if (this._track && this._disableTrackOnPause) {
		            this._track.enabled = false;
		        }
		        if (this._zeroRtpOnPause) {
		            new Promise((resolve, reject) => {
		                this.safeEmit('@pause', resolve, reject);
		            }).catch(() => { });
		        }
		        // Emit observer event.
		        this._observer.safeEmit('pause');
		    }
		    /**
		     * Resumes sending media.
		     */
		    resume() {
		        logger.debug('resume()');
		        if (this._closed) {
		            logger.error('resume() | Producer closed');
		            return;
		        }
		        this._paused = false;
		        if (this._track && this._disableTrackOnPause) {
		            this._track.enabled = true;
		        }
		        if (this._zeroRtpOnPause) {
		            new Promise((resolve, reject) => {
		                this.safeEmit('@resume', resolve, reject);
		            }).catch(() => { });
		        }
		        // Emit observer event.
		        this._observer.safeEmit('resume');
		    }
		    /**
		     * Replaces the current track with a new one or null.
		     */
		    async replaceTrack({ track, }) {
		        logger.debug('replaceTrack() [track:%o]', track);
		        if (this._closed) {
		            // This must be done here. Otherwise there is no chance to stop the given
		            // track.
		            if (track && this._stopTracks) {
		                try {
		                    track.stop();
		                }
		                catch (error) { }
		            }
		            throw new errors_1.InvalidStateError('closed');
		        }
		        else if (track && track.readyState === 'ended') {
		            throw new errors_1.InvalidStateError('track ended');
		        }
		        // Do nothing if this is the same track as the current handled one.
		        if (track === this._track) {
		            logger.debug('replaceTrack() | same track, ignored');
		            return;
		        }
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@replacetrack', track, resolve, reject);
		        });
		        // Destroy the previous track.
		        this.destroyTrack();
		        // Set the new track.
		        this._track = track;
		        // If this Producer was paused/resumed and the state of the new
		        // track does not match, fix it.
		        if (this._track && this._disableTrackOnPause) {
		            if (!this._paused) {
		                this._track.enabled = true;
		            }
		            else if (this._paused) {
		                this._track.enabled = false;
		            }
		        }
		        // Handle the effective track.
		        this.handleTrack();
		    }
		    /**
		     * Sets the video max spatial layer to be sent.
		     */
		    async setMaxSpatialLayer(spatialLayer) {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        else if (this._kind !== 'video') {
		            throw new errors_1.UnsupportedError('not a video Producer');
		        }
		        else if (typeof spatialLayer !== 'number') {
		            throw new TypeError('invalid spatialLayer');
		        }
		        if (spatialLayer === this._maxSpatialLayer) {
		            return;
		        }
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@setmaxspatiallayer', spatialLayer, resolve, reject);
		        }).catch(() => { });
		        this._maxSpatialLayer = spatialLayer;
		    }
		    async setRtpEncodingParameters(params) {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        else if (typeof params !== 'object') {
		            throw new TypeError('invalid params');
		        }
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@setrtpencodingparameters', params, resolve, reject);
		        });
		    }
		    onTrackEnded() {
		        logger.debug('track "ended" event');
		        this.safeEmit('trackended');
		        // Emit observer event.
		        this._observer.safeEmit('trackended');
		    }
		    handleTrack() {
		        if (!this._track) {
		            return;
		        }
		        this._track.addEventListener('ended', this.onTrackEnded);
		    }
		    destroyTrack() {
		        if (!this._track) {
		            return;
		        }
		        try {
		            this._track.removeEventListener('ended', this.onTrackEnded);
		            // Just stop the track unless the app set stopTracks: false.
		            if (this._stopTracks) {
		                this._track.stop();
		            }
		        }
		        catch (error) { }
		    }
		};
		Producer.Producer = Producer$1;
		return Producer;
	}

	var Consumer = {};

	var hasRequiredConsumer;

	function requireConsumer () {
		if (hasRequiredConsumer) return Consumer;
		hasRequiredConsumer = 1;
		Object.defineProperty(Consumer, "__esModule", { value: true });
		Consumer.Consumer = void 0;
		const Logger_1 = requireLogger$2();
		const enhancedEvents_1 = requireEnhancedEvents();
		const errors_1 = requireErrors$1();
		const logger = new Logger_1.Logger('Consumer');
		let Consumer$1 = class Consumer extends enhancedEvents_1.EnhancedEventEmitter {
		    // Id.
		    _id;
		    // Local id.
		    _localId;
		    // Associated Producer id.
		    _producerId;
		    // Closed flag.
		    _closed = false;
		    // Associated RTCRtpReceiver.
		    _rtpReceiver;
		    // Remote track.
		    _track;
		    // RTP parameters.
		    _rtpParameters;
		    // Paused flag.
		    _paused;
		    // App custom data.
		    _appData;
		    // Observer instance.
		    _observer = new enhancedEvents_1.EnhancedEventEmitter();
		    constructor({ id, localId, producerId, rtpReceiver, track, rtpParameters, appData, }) {
		        super();
		        logger.debug('constructor()');
		        this._id = id;
		        this._localId = localId;
		        this._producerId = producerId;
		        this._rtpReceiver = rtpReceiver;
		        this._track = track;
		        this._rtpParameters = rtpParameters;
		        this._paused = !track.enabled;
		        this._appData = appData ?? {};
		        this.onTrackEnded = this.onTrackEnded.bind(this);
		        this.handleTrack();
		    }
		    /**
		     * Consumer id.
		     */
		    get id() {
		        return this._id;
		    }
		    /**
		     * Local id.
		     */
		    get localId() {
		        return this._localId;
		    }
		    /**
		     * Associated Producer id.
		     */
		    get producerId() {
		        return this._producerId;
		    }
		    /**
		     * Whether the Consumer is closed.
		     */
		    get closed() {
		        return this._closed;
		    }
		    /**
		     * Media kind.
		     */
		    get kind() {
		        return this._track.kind;
		    }
		    /**
		     * Associated RTCRtpReceiver.
		     */
		    get rtpReceiver() {
		        return this._rtpReceiver;
		    }
		    /**
		     * The associated track.
		     */
		    get track() {
		        return this._track;
		    }
		    /**
		     * RTP parameters.
		     */
		    get rtpParameters() {
		        return this._rtpParameters;
		    }
		    /**
		     * Whether the Consumer is paused.
		     */
		    get paused() {
		        return this._paused;
		    }
		    /**
		     * App custom data.
		     */
		    get appData() {
		        return this._appData;
		    }
		    /**
		     * App custom data setter.
		     */
		    set appData(appData) {
		        this._appData = appData;
		    }
		    get observer() {
		        return this._observer;
		    }
		    /**
		     * Closes the Consumer.
		     */
		    close() {
		        if (this._closed) {
		            return;
		        }
		        logger.debug('close()');
		        this._closed = true;
		        this.destroyTrack();
		        this.emit('@close');
		        // Emit observer event.
		        this._observer.safeEmit('close');
		    }
		    /**
		     * Transport was closed.
		     */
		    transportClosed() {
		        if (this._closed) {
		            return;
		        }
		        logger.debug('transportClosed()');
		        this._closed = true;
		        this.destroyTrack();
		        this.safeEmit('transportclose');
		        // Emit observer event.
		        this._observer.safeEmit('close');
		    }
		    /**
		     * Get associated RTCRtpReceiver stats.
		     */
		    async getStats() {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        return new Promise((resolve, reject) => {
		            this.safeEmit('@getstats', resolve, reject);
		        });
		    }
		    /**
		     * Pauses receiving media.
		     */
		    pause() {
		        logger.debug('pause()');
		        if (this._closed) {
		            logger.error('pause() | Consumer closed');
		            return;
		        }
		        if (this._paused) {
		            logger.debug('pause() | Consumer is already paused');
		            return;
		        }
		        this._paused = true;
		        this._track.enabled = false;
		        this.emit('@pause');
		        // Emit observer event.
		        this._observer.safeEmit('pause');
		    }
		    /**
		     * Resumes receiving media.
		     */
		    resume() {
		        logger.debug('resume()');
		        if (this._closed) {
		            logger.error('resume() | Consumer closed');
		            return;
		        }
		        if (!this._paused) {
		            logger.debug('resume() | Consumer is already resumed');
		            return;
		        }
		        this._paused = false;
		        this._track.enabled = true;
		        this.emit('@resume');
		        // Emit observer event.
		        this._observer.safeEmit('resume');
		    }
		    onTrackEnded() {
		        logger.debug('track "ended" event');
		        this.safeEmit('trackended');
		        // Emit observer event.
		        this._observer.safeEmit('trackended');
		    }
		    handleTrack() {
		        this._track.addEventListener('ended', this.onTrackEnded);
		    }
		    destroyTrack() {
		        try {
		            this._track.removeEventListener('ended', this.onTrackEnded);
		            this._track.stop();
		        }
		        catch (error) { }
		    }
		};
		Consumer.Consumer = Consumer$1;
		return Consumer;
	}

	var DataProducer = {};

	var hasRequiredDataProducer;

	function requireDataProducer () {
		if (hasRequiredDataProducer) return DataProducer;
		hasRequiredDataProducer = 1;
		Object.defineProperty(DataProducer, "__esModule", { value: true });
		DataProducer.DataProducer = void 0;
		const Logger_1 = requireLogger$2();
		const enhancedEvents_1 = requireEnhancedEvents();
		const errors_1 = requireErrors$1();
		const logger = new Logger_1.Logger('DataProducer');
		let DataProducer$1 = class DataProducer extends enhancedEvents_1.EnhancedEventEmitter {
		    // Id.
		    _id;
		    // The underlying RTCDataChannel instance.
		    _dataChannel;
		    // Closed flag.
		    _closed = false;
		    // SCTP stream parameters.
		    _sctpStreamParameters;
		    // App custom data.
		    _appData;
		    // Observer instance.
		    _observer = new enhancedEvents_1.EnhancedEventEmitter();
		    constructor({ id, dataChannel, sctpStreamParameters, appData, }) {
		        super();
		        logger.debug('constructor()');
		        this._id = id;
		        this._dataChannel = dataChannel;
		        this._sctpStreamParameters = sctpStreamParameters;
		        this._appData = appData ?? {};
		        this.handleDataChannel();
		    }
		    /**
		     * DataProducer id.
		     */
		    get id() {
		        return this._id;
		    }
		    /**
		     * Whether the DataProducer is closed.
		     */
		    get closed() {
		        return this._closed;
		    }
		    /**
		     * SCTP stream parameters.
		     */
		    get sctpStreamParameters() {
		        return this._sctpStreamParameters;
		    }
		    /**
		     * DataChannel readyState.
		     */
		    get readyState() {
		        return this._dataChannel.readyState;
		    }
		    /**
		     * DataChannel label.
		     */
		    get label() {
		        return this._dataChannel.label;
		    }
		    /**
		     * DataChannel protocol.
		     */
		    get protocol() {
		        return this._dataChannel.protocol;
		    }
		    /**
		     * DataChannel bufferedAmount.
		     */
		    get bufferedAmount() {
		        return this._dataChannel.bufferedAmount;
		    }
		    /**
		     * DataChannel bufferedAmountLowThreshold.
		     */
		    get bufferedAmountLowThreshold() {
		        return this._dataChannel.bufferedAmountLowThreshold;
		    }
		    /**
		     * Set DataChannel bufferedAmountLowThreshold.
		     */
		    set bufferedAmountLowThreshold(bufferedAmountLowThreshold) {
		        this._dataChannel.bufferedAmountLowThreshold = bufferedAmountLowThreshold;
		    }
		    /**
		     * App custom data.
		     */
		    get appData() {
		        return this._appData;
		    }
		    /**
		     * App custom data setter.
		     */
		    set appData(appData) {
		        this._appData = appData;
		    }
		    get observer() {
		        return this._observer;
		    }
		    /**
		     * Closes the DataProducer.
		     */
		    close() {
		        if (this._closed) {
		            return;
		        }
		        logger.debug('close()');
		        this._closed = true;
		        this._dataChannel.close();
		        this.emit('@close');
		        // Emit observer event.
		        this._observer.safeEmit('close');
		    }
		    /**
		     * Transport was closed.
		     */
		    transportClosed() {
		        if (this._closed) {
		            return;
		        }
		        logger.debug('transportClosed()');
		        this._closed = true;
		        this._dataChannel.close();
		        this.safeEmit('transportclose');
		        // Emit observer event.
		        this._observer.safeEmit('close');
		    }
		    /**
		     * Send a message.
		     *
		     * @param {String|Blob|ArrayBuffer|ArrayBufferView} data.
		     */
		    send(data) {
		        logger.debug('send()');
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        this._dataChannel.send(data);
		    }
		    handleDataChannel() {
		        this._dataChannel.addEventListener('open', () => {
		            if (this._closed) {
		                return;
		            }
		            logger.debug('DataChannel "open" event');
		            this.safeEmit('open');
		        });
		        this._dataChannel.addEventListener('error', (event) => {
		            if (this._closed) {
		                return;
		            }
		            let { error } = event;
		            if (!error) {
		                error = new Error('unknown DataChannel error');
		            }
		            if (error.errorDetail === 'sctp-failure') {
		                logger.error('DataChannel SCTP error [sctpCauseCode:%s]: %s', error.sctpCauseCode, error.message);
		            }
		            else {
		                logger.error('DataChannel "error" event: %o', error);
		            }
		            this.safeEmit('error', error);
		        });
		        this._dataChannel.addEventListener('close', () => {
		            if (this._closed) {
		                return;
		            }
		            logger.warn('DataChannel "close" event');
		            this._closed = true;
		            this.emit('@close');
		            this.safeEmit('close');
		            // Emit observer event.
		            this._observer.safeEmit('close');
		        });
		        this._dataChannel.addEventListener('message', () => {
		            if (this._closed) {
		                return;
		            }
		            logger.warn('DataChannel "message" event in a DataProducer, message discarded');
		        });
		        this._dataChannel.addEventListener('bufferedamountlow', () => {
		            if (this._closed) {
		                return;
		            }
		            this.safeEmit('bufferedamountlow');
		        });
		    }
		};
		DataProducer.DataProducer = DataProducer$1;
		return DataProducer;
	}

	var DataConsumer = {};

	var hasRequiredDataConsumer;

	function requireDataConsumer () {
		if (hasRequiredDataConsumer) return DataConsumer;
		hasRequiredDataConsumer = 1;
		Object.defineProperty(DataConsumer, "__esModule", { value: true });
		DataConsumer.DataConsumer = void 0;
		const Logger_1 = requireLogger$2();
		const enhancedEvents_1 = requireEnhancedEvents();
		const logger = new Logger_1.Logger('DataConsumer');
		let DataConsumer$1 = class DataConsumer extends enhancedEvents_1.EnhancedEventEmitter {
		    // Id.
		    _id;
		    // Associated DataProducer Id.
		    _dataProducerId;
		    // The underlying RTCDataChannel instance.
		    _dataChannel;
		    // Closed flag.
		    _closed = false;
		    // SCTP stream parameters.
		    _sctpStreamParameters;
		    // App custom data.
		    _appData;
		    // Observer instance.
		    _observer = new enhancedEvents_1.EnhancedEventEmitter();
		    constructor({ id, dataProducerId, dataChannel, sctpStreamParameters, appData, }) {
		        super();
		        logger.debug('constructor()');
		        this._id = id;
		        this._dataProducerId = dataProducerId;
		        this._dataChannel = dataChannel;
		        this._sctpStreamParameters = sctpStreamParameters;
		        this._appData = appData ?? {};
		        this.handleDataChannel();
		    }
		    /**
		     * DataConsumer id.
		     */
		    get id() {
		        return this._id;
		    }
		    /**
		     * Associated DataProducer id.
		     */
		    get dataProducerId() {
		        return this._dataProducerId;
		    }
		    /**
		     * Whether the DataConsumer is closed.
		     */
		    get closed() {
		        return this._closed;
		    }
		    /**
		     * SCTP stream parameters.
		     */
		    get sctpStreamParameters() {
		        return this._sctpStreamParameters;
		    }
		    /**
		     * DataChannel readyState.
		     */
		    get readyState() {
		        return this._dataChannel.readyState;
		    }
		    /**
		     * DataChannel label.
		     */
		    get label() {
		        return this._dataChannel.label;
		    }
		    /**
		     * DataChannel protocol.
		     */
		    get protocol() {
		        return this._dataChannel.protocol;
		    }
		    /**
		     * DataChannel binaryType.
		     */
		    get binaryType() {
		        return this._dataChannel.binaryType;
		    }
		    /**
		     * Set DataChannel binaryType.
		     */
		    set binaryType(binaryType) {
		        this._dataChannel.binaryType = binaryType;
		    }
		    /**
		     * App custom data.
		     */
		    get appData() {
		        return this._appData;
		    }
		    /**
		     * App custom data setter.
		     */
		    set appData(appData) {
		        this._appData = appData;
		    }
		    get observer() {
		        return this._observer;
		    }
		    /**
		     * Closes the DataConsumer.
		     */
		    close() {
		        if (this._closed) {
		            return;
		        }
		        logger.debug('close()');
		        this._closed = true;
		        this._dataChannel.close();
		        this.emit('@close');
		        // Emit observer event.
		        this._observer.safeEmit('close');
		    }
		    /**
		     * Transport was closed.
		     */
		    transportClosed() {
		        if (this._closed) {
		            return;
		        }
		        logger.debug('transportClosed()');
		        this._closed = true;
		        this._dataChannel.close();
		        this.safeEmit('transportclose');
		        // Emit observer event.
		        this._observer.safeEmit('close');
		    }
		    handleDataChannel() {
		        this._dataChannel.addEventListener('open', () => {
		            if (this._closed) {
		                return;
		            }
		            logger.debug('DataChannel "open" event');
		            this.safeEmit('open');
		        });
		        this._dataChannel.addEventListener('error', (event) => {
		            if (this._closed) {
		                return;
		            }
		            let { error } = event;
		            if (!error) {
		                error = new Error('unknown DataChannel error');
		            }
		            if (error.errorDetail === 'sctp-failure') {
		                logger.error('DataChannel SCTP error [sctpCauseCode:%s]: %s', error.sctpCauseCode, error.message);
		            }
		            else {
		                logger.error('DataChannel "error" event: %o', error);
		            }
		            this.safeEmit('error', error);
		        });
		        this._dataChannel.addEventListener('close', () => {
		            if (this._closed) {
		                return;
		            }
		            logger.warn('DataChannel "close" event');
		            this._closed = true;
		            this.emit('@close');
		            this.safeEmit('close');
		            // Emit observer event.
		            this._observer.safeEmit('close');
		        });
		        this._dataChannel.addEventListener('message', (event) => {
		            if (this._closed) {
		                return;
		            }
		            this.safeEmit('message', event.data);
		        });
		    }
		};
		DataConsumer.DataConsumer = DataConsumer$1;
		return DataConsumer;
	}

	var hasRequiredTransport;

	function requireTransport () {
		if (hasRequiredTransport) return Transport;
		hasRequiredTransport = 1;
		Object.defineProperty(Transport, "__esModule", { value: true });
		Transport.Transport = void 0;
		const awaitqueue_1 = requireLib$3();
		const Logger_1 = requireLogger$2();
		const enhancedEvents_1 = requireEnhancedEvents();
		const errors_1 = requireErrors$1();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const Producer_1 = requireProducer();
		const Consumer_1 = requireConsumer();
		const DataProducer_1 = requireDataProducer();
		const DataConsumer_1 = requireDataConsumer();
		const logger = new Logger_1.Logger('Transport');
		class ConsumerCreationTask {
		    consumerOptions;
		    promise;
		    resolve;
		    reject;
		    constructor(consumerOptions) {
		        this.consumerOptions = consumerOptions;
		        this.promise = new Promise((resolve, reject) => {
		            this.resolve = resolve;
		            this.reject = reject;
		        });
		    }
		}
		let Transport$1 = class Transport extends enhancedEvents_1.EnhancedEventEmitter {
		    // Id.
		    _id;
		    // Closed flag.
		    _closed = false;
		    // Direction.
		    _direction;
		    // Extended RTP capabilities.
		    _extendedRtpCapabilities;
		    // Whether we can produce audio/video based on computed extended RTP
		    // capabilities.
		    _canProduceByKind;
		    // SCTP max message size if enabled, null otherwise.
		    _maxSctpMessageSize;
		    // RTC handler isntance.
		    _handler;
		    // Transport ICE gathering state.
		    _iceGatheringState = 'new';
		    // Transport connection state.
		    _connectionState = 'new';
		    // App custom data.
		    _appData;
		    // Map of Producers indexed by id.
		    _producers = new Map();
		    // Map of Consumers indexed by id.
		    _consumers = new Map();
		    // Map of DataProducers indexed by id.
		    _dataProducers = new Map();
		    // Map of DataConsumers indexed by id.
		    _dataConsumers = new Map();
		    // Whether the Consumer for RTP probation has been created.
		    _probatorConsumerCreated = false;
		    // AwaitQueue instance to make async tasks happen sequentially.
		    _awaitQueue = new awaitqueue_1.AwaitQueue();
		    // Consumer creation tasks awaiting to be processed.
		    _pendingConsumerTasks = [];
		    // Consumer creation in progress flag.
		    _consumerCreationInProgress = false;
		    // Consumers pending to be paused.
		    _pendingPauseConsumers = new Map();
		    // Consumer pause in progress flag.
		    _consumerPauseInProgress = false;
		    // Consumers pending to be resumed.
		    _pendingResumeConsumers = new Map();
		    // Consumer resume in progress flag.
		    _consumerResumeInProgress = false;
		    // Consumers pending to be closed.
		    _pendingCloseConsumers = new Map();
		    // Consumer close in progress flag.
		    _consumerCloseInProgress = false;
		    // Observer instance.
		    _observer = new enhancedEvents_1.EnhancedEventEmitter();
		    constructor({ direction, id, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, appData, handlerFactory, extendedRtpCapabilities, canProduceByKind, }) {
		        super();
		        logger.debug('constructor() [id:%s, direction:%s]', id, direction);
		        this._id = id;
		        this._direction = direction;
		        this._extendedRtpCapabilities = extendedRtpCapabilities;
		        this._canProduceByKind = canProduceByKind;
		        this._maxSctpMessageSize = sctpParameters
		            ? sctpParameters.maxMessageSize
		            : null;
		        // Clone and sanitize additionalSettings.
		        const clonedAdditionalSettings = utils.clone(additionalSettings) ?? {};
		        delete clonedAdditionalSettings.iceServers;
		        delete clonedAdditionalSettings.iceTransportPolicy;
		        delete clonedAdditionalSettings.bundlePolicy;
		        delete clonedAdditionalSettings.rtcpMuxPolicy;
		        delete clonedAdditionalSettings.sdpSemantics;
		        this._handler = handlerFactory();
		        this._handler.run({
		            direction,
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		            iceServers,
		            iceTransportPolicy,
		            additionalSettings: clonedAdditionalSettings,
		            proprietaryConstraints,
		            extendedRtpCapabilities,
		        });
		        this._appData = appData ?? {};
		        this.handleHandler();
		    }
		    /**
		     * Transport id.
		     */
		    get id() {
		        return this._id;
		    }
		    /**
		     * Whether the Transport is closed.
		     */
		    get closed() {
		        return this._closed;
		    }
		    /**
		     * Transport direction.
		     */
		    get direction() {
		        return this._direction;
		    }
		    /**
		     * RTC handler instance.
		     */
		    get handler() {
		        return this._handler;
		    }
		    /**
		     * ICE gathering state.
		     */
		    get iceGatheringState() {
		        return this._iceGatheringState;
		    }
		    /**
		     * Connection state.
		     */
		    get connectionState() {
		        return this._connectionState;
		    }
		    /**
		     * App custom data.
		     */
		    get appData() {
		        return this._appData;
		    }
		    /**
		     * App custom data setter.
		     */
		    set appData(appData) {
		        this._appData = appData;
		    }
		    get observer() {
		        return this._observer;
		    }
		    /**
		     * Close the Transport.
		     */
		    close() {
		        if (this._closed) {
		            return;
		        }
		        logger.debug('close()');
		        this._closed = true;
		        // Stop the AwaitQueue.
		        this._awaitQueue.stop();
		        // Close the handler.
		        this._handler.close();
		        // Change connection state to 'closed' since the handler may not emit
		        // '@connectionstatechange' event.
		        this._connectionState = 'closed';
		        // Close all Producers.
		        for (const producer of this._producers.values()) {
		            producer.transportClosed();
		        }
		        this._producers.clear();
		        // Close all Consumers.
		        for (const consumer of this._consumers.values()) {
		            consumer.transportClosed();
		        }
		        this._consumers.clear();
		        // Close all DataProducers.
		        for (const dataProducer of this._dataProducers.values()) {
		            dataProducer.transportClosed();
		        }
		        this._dataProducers.clear();
		        // Close all DataConsumers.
		        for (const dataConsumer of this._dataConsumers.values()) {
		            dataConsumer.transportClosed();
		        }
		        this._dataConsumers.clear();
		        // Emit observer event.
		        this._observer.safeEmit('close');
		    }
		    /**
		     * Get associated Transport (RTCPeerConnection) stats.
		     *
		     * @returns {RTCStatsReport}
		     */
		    async getStats() {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        return this._handler.getTransportStats();
		    }
		    /**
		     * Restart ICE connection.
		     */
		    async restartIce({ iceParameters, }) {
		        logger.debug('restartIce()');
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        else if (!iceParameters) {
		            throw new TypeError('missing iceParameters');
		        }
		        // Enqueue command.
		        return this._awaitQueue.push(async () => await this._handler.restartIce(iceParameters), 'transport.restartIce()');
		    }
		    /**
		     * Update ICE servers.
		     */
		    async updateIceServers({ iceServers, } = {}) {
		        logger.debug('updateIceServers()');
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        else if (!Array.isArray(iceServers)) {
		            throw new TypeError('missing iceServers');
		        }
		        // Enqueue command.
		        return this._awaitQueue.push(async () => this._handler.updateIceServers(iceServers), 'transport.updateIceServers()');
		    }
		    /**
		     * Create a Producer.
		     */
		    async produce({ track, encodings, codecOptions, codec, stopTracks = true, disableTrackOnPause = true, zeroRtpOnPause = false, onRtpSender, appData = {}, } = {}) {
		        logger.debug('produce() [track:%o]', track);
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        else if (!track) {
		            throw new TypeError('missing track');
		        }
		        else if (this._direction !== 'send') {
		            throw new errors_1.UnsupportedError('not a sending Transport');
		        }
		        else if (!this._canProduceByKind[track.kind]) {
		            throw new errors_1.UnsupportedError(`cannot produce ${track.kind}`);
		        }
		        else if (track.readyState === 'ended') {
		            throw new errors_1.InvalidStateError('track ended');
		        }
		        else if (this.listenerCount('connect') === 0 &&
		            this._connectionState === 'new') {
		            throw new TypeError('no "connect" listener set into this transport');
		        }
		        else if (this.listenerCount('produce') === 0) {
		            throw new TypeError('no "produce" listener set into this transport');
		        }
		        else if (appData && typeof appData !== 'object') {
		            throw new TypeError('if given, appData must be an object');
		        }
		        // Enqueue command.
		        return (this._awaitQueue
		            .push(async () => {
		            let normalizedEncodings;
		            if (encodings && !Array.isArray(encodings)) {
		                throw TypeError('encodings must be an array');
		            }
		            else if (encodings && encodings.length === 0) {
		                normalizedEncodings = undefined;
		            }
		            else if (encodings) {
		                normalizedEncodings = encodings.map((encoding) => {
		                    const normalizedEncoding = { active: true };
		                    if (encoding.active === false) {
		                        normalizedEncoding.active = false;
		                    }
		                    if (typeof encoding.dtx === 'boolean') {
		                        normalizedEncoding.dtx = encoding.dtx;
		                    }
		                    if (typeof encoding.scalabilityMode === 'string') {
		                        normalizedEncoding.scalabilityMode = encoding.scalabilityMode;
		                    }
		                    if (typeof encoding.scaleResolutionDownBy === 'number') {
		                        normalizedEncoding.scaleResolutionDownBy =
		                            encoding.scaleResolutionDownBy;
		                    }
		                    if (typeof encoding.maxBitrate === 'number') {
		                        normalizedEncoding.maxBitrate = encoding.maxBitrate;
		                    }
		                    if (typeof encoding.maxFramerate === 'number') {
		                        normalizedEncoding.maxFramerate = encoding.maxFramerate;
		                    }
		                    if (typeof encoding.adaptivePtime === 'boolean') {
		                        normalizedEncoding.adaptivePtime = encoding.adaptivePtime;
		                    }
		                    if (typeof encoding.priority === 'string') {
		                        normalizedEncoding.priority = encoding.priority;
		                    }
		                    if (typeof encoding.networkPriority === 'string') {
		                        normalizedEncoding.networkPriority = encoding.networkPriority;
		                    }
		                    return normalizedEncoding;
		                });
		            }
		            const { localId, rtpParameters, rtpSender } = await this._handler.send({
		                track,
		                encodings: normalizedEncodings,
		                codecOptions,
		                codec,
		                onRtpSender,
		            });
		            try {
		                // This will fill rtpParameters's missing fields with default values.
		                ortc.validateRtpParameters(rtpParameters);
		                const { id } = await new Promise((resolve, reject) => {
		                    this.safeEmit('produce', {
		                        kind: track.kind,
		                        rtpParameters,
		                        appData,
		                    }, resolve, reject);
		                });
		                const producer = new Producer_1.Producer({
		                    id,
		                    localId,
		                    rtpSender,
		                    track,
		                    rtpParameters,
		                    stopTracks,
		                    disableTrackOnPause,
		                    zeroRtpOnPause,
		                    appData,
		                });
		                this._producers.set(producer.id, producer);
		                this.handleProducer(producer);
		                // Emit observer event.
		                this._observer.safeEmit('newproducer', producer);
		                return producer;
		            }
		            catch (error) {
		                this._handler.stopSending(localId).catch(() => { });
		                throw error;
		            }
		        }, 'transport.produce()')
		            // This catch is needed to stop the given track if the command above
		            // failed due to closed Transport.
		            .catch((error) => {
		            if (stopTracks) {
		                try {
		                    track.stop();
		                }
		                catch (error2) { }
		            }
		            throw error;
		        }));
		    }
		    /**
		     * Create a Consumer to consume a remote Producer.
		     */
		    async consume({ id, producerId, kind, rtpParameters, streamId, onRtpReceiver, appData = {}, }) {
		        logger.debug('consume()');
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        else if (this._direction !== 'recv') {
		            throw new errors_1.UnsupportedError('not a receiving Transport');
		        }
		        else if (typeof id !== 'string') {
		            throw new TypeError('missing id');
		        }
		        else if (typeof producerId !== 'string') {
		            throw new TypeError('missing producerId');
		        }
		        else if (kind !== 'audio' && kind !== 'video') {
		            throw new TypeError(`invalid kind '${kind}'`);
		        }
		        else if (this.listenerCount('connect') === 0 &&
		            this._connectionState === 'new') {
		            throw new TypeError('no "connect" listener set into this transport');
		        }
		        else if (appData && typeof appData !== 'object') {
		            throw new TypeError('if given, appData must be an object');
		        }
		        // Clone given RTP parameters to not modify input data.
		        const clonedRtpParameters = utils.clone(rtpParameters);
		        // Ensure the device can consume it.
		        const canConsume = ortc.canReceive(clonedRtpParameters, this._extendedRtpCapabilities);
		        if (!canConsume) {
		            throw new errors_1.UnsupportedError('cannot consume this Producer');
		        }
		        const consumerCreationTask = new ConsumerCreationTask({
		            id,
		            producerId,
		            kind,
		            rtpParameters: clonedRtpParameters,
		            streamId,
		            onRtpReceiver,
		            appData,
		        });
		        // Store the Consumer creation task.
		        this._pendingConsumerTasks.push(consumerCreationTask);
		        // There is no Consumer creation in progress, create it now.
		        queueMicrotask(() => {
		            if (this._closed) {
		                return;
		            }
		            if (this._consumerCreationInProgress === false) {
		                this.createPendingConsumers();
		            }
		        });
		        return consumerCreationTask.promise;
		    }
		    /**
		     * Create a DataProducer
		     */
		    async produceData({ ordered = true, maxPacketLifeTime, maxRetransmits, label = '', protocol = '', appData = {}, } = {}) {
		        logger.debug('produceData()');
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        else if (this._direction !== 'send') {
		            throw new errors_1.UnsupportedError('not a sending Transport');
		        }
		        else if (!this._maxSctpMessageSize) {
		            throw new errors_1.UnsupportedError('SCTP not enabled by remote Transport');
		        }
		        else if (this.listenerCount('connect') === 0 &&
		            this._connectionState === 'new') {
		            throw new TypeError('no "connect" listener set into this transport');
		        }
		        else if (this.listenerCount('producedata') === 0) {
		            throw new TypeError('no "producedata" listener set into this transport');
		        }
		        else if (appData && typeof appData !== 'object') {
		            throw new TypeError('if given, appData must be an object');
		        }
		        if (maxPacketLifeTime || maxRetransmits) {
		            ordered = false;
		        }
		        // Enqueue command.
		        return this._awaitQueue.push(async () => {
		            const { dataChannel, sctpStreamParameters } = await this._handler.sendDataChannel({
		                ordered,
		                maxPacketLifeTime,
		                maxRetransmits,
		                label,
		                protocol,
		            });
		            // This will fill sctpStreamParameters's missing fields with default values.
		            ortc.validateSctpStreamParameters(sctpStreamParameters);
		            const { id } = await new Promise((resolve, reject) => {
		                this.safeEmit('producedata', {
		                    sctpStreamParameters,
		                    label,
		                    protocol,
		                    appData,
		                }, resolve, reject);
		            });
		            const dataProducer = new DataProducer_1.DataProducer({
		                id,
		                dataChannel,
		                sctpStreamParameters,
		                appData,
		            });
		            this._dataProducers.set(dataProducer.id, dataProducer);
		            this.handleDataProducer(dataProducer);
		            // Emit observer event.
		            this._observer.safeEmit('newdataproducer', dataProducer);
		            return dataProducer;
		        }, 'transport.produceData()');
		    }
		    /**
		     * Create a DataConsumer
		     */
		    async consumeData({ id, dataProducerId, sctpStreamParameters, label = '', protocol = '', appData = {}, }) {
		        logger.debug('consumeData()');
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('closed');
		        }
		        else if (this._direction !== 'recv') {
		            throw new errors_1.UnsupportedError('not a receiving Transport');
		        }
		        else if (!this._maxSctpMessageSize) {
		            throw new errors_1.UnsupportedError('SCTP not enabled by remote Transport');
		        }
		        else if (typeof id !== 'string') {
		            throw new TypeError('missing id');
		        }
		        else if (typeof dataProducerId !== 'string') {
		            throw new TypeError('missing dataProducerId');
		        }
		        else if (this.listenerCount('connect') === 0 &&
		            this._connectionState === 'new') {
		            throw new TypeError('no "connect" listener set into this transport');
		        }
		        else if (appData && typeof appData !== 'object') {
		            throw new TypeError('if given, appData must be an object');
		        }
		        // Clone given SCTP stream parameters to not modify input data.
		        const clonedSctpStreamParameters = utils.clone(sctpStreamParameters);
		        // This may throw.
		        ortc.validateSctpStreamParameters(clonedSctpStreamParameters);
		        // Enqueue command.
		        return this._awaitQueue.push(async () => {
		            const { dataChannel } = await this._handler.receiveDataChannel({
		                sctpStreamParameters: clonedSctpStreamParameters,
		                label,
		                protocol,
		            });
		            const dataConsumer = new DataConsumer_1.DataConsumer({
		                id,
		                dataProducerId,
		                dataChannel,
		                sctpStreamParameters: clonedSctpStreamParameters,
		                appData,
		            });
		            this._dataConsumers.set(dataConsumer.id, dataConsumer);
		            this.handleDataConsumer(dataConsumer);
		            // Emit observer event.
		            this._observer.safeEmit('newdataconsumer', dataConsumer);
		            return dataConsumer;
		        }, 'transport.consumeData()');
		    }
		    // This method is guaranteed to never throw.
		    createPendingConsumers() {
		        this._consumerCreationInProgress = true;
		        this._awaitQueue
		            .push(async () => {
		            if (this._pendingConsumerTasks.length === 0) {
		                logger.debug('createPendingConsumers() | there is no Consumer to be created');
		                return;
		            }
		            const pendingConsumerTasks = [...this._pendingConsumerTasks];
		            // Clear pending Consumer tasks.
		            this._pendingConsumerTasks = [];
		            // Video Consumer in order to create the probator.
		            let videoConsumerForProbator = undefined;
		            // Fill options list.
		            const optionsList = [];
		            for (const task of pendingConsumerTasks) {
		                const { id, kind, rtpParameters, streamId, onRtpReceiver } = task.consumerOptions;
		                optionsList.push({
		                    trackId: id,
		                    kind: kind,
		                    rtpParameters,
		                    streamId,
		                    onRtpReceiver,
		                });
		            }
		            try {
		                const results = await this._handler.receive(optionsList);
		                for (let idx = 0; idx < results.length; ++idx) {
		                    const task = pendingConsumerTasks[idx];
		                    const result = results[idx];
		                    const { id, producerId, kind, rtpParameters, appData } = task.consumerOptions;
		                    const { localId, rtpReceiver, track } = result;
		                    const consumer = new Consumer_1.Consumer({
		                        id: id,
		                        localId,
		                        producerId: producerId,
		                        rtpReceiver,
		                        track,
		                        rtpParameters,
		                        appData: appData,
		                    });
		                    this._consumers.set(consumer.id, consumer);
		                    this.handleConsumer(consumer);
		                    // If this is the first video Consumer and the Consumer for RTP probation
		                    // has not yet been created, it's time to create it.
		                    if (!this._probatorConsumerCreated &&
		                        !videoConsumerForProbator &&
		                        kind === 'video') {
		                        videoConsumerForProbator = consumer;
		                    }
		                    // Emit observer event.
		                    this._observer.safeEmit('newconsumer', consumer);
		                    task.resolve(consumer);
		                }
		            }
		            catch (error) {
		                for (const task of pendingConsumerTasks) {
		                    task.reject(error);
		                }
		            }
		            // If RTP probation must be handled, do it now.
		            if (videoConsumerForProbator) {
		                try {
		                    const probatorRtpParameters = ortc.generateProbatorRtpParameters(videoConsumerForProbator.rtpParameters);
		                    await this._handler.receive([
		                        {
		                            trackId: 'probator',
		                            kind: 'video',
		                            rtpParameters: probatorRtpParameters,
		                        },
		                    ]);
		                    logger.debug('createPendingConsumers() | Consumer for RTP probation created');
		                    this._probatorConsumerCreated = true;
		                }
		                catch (error) {
		                    logger.error('createPendingConsumers() | failed to create Consumer for RTP probation:%o', error);
		                }
		            }
		        }, 'transport.createPendingConsumers()')
		            .then(() => {
		            this._consumerCreationInProgress = false;
		            // There are pending Consumer tasks, enqueue their creation.
		            if (this._pendingConsumerTasks.length > 0) {
		                this.createPendingConsumers();
		            }
		        })
		            // NOTE: We only get here when the await queue is closed.
		            .catch(() => { });
		    }
		    pausePendingConsumers() {
		        this._consumerPauseInProgress = true;
		        this._awaitQueue
		            .push(async () => {
		            if (this._pendingPauseConsumers.size === 0) {
		                logger.debug('pausePendingConsumers() | there is no Consumer to be paused');
		                return;
		            }
		            const pendingPauseConsumers = Array.from(this._pendingPauseConsumers.values());
		            // Clear pending pause Consumer map.
		            this._pendingPauseConsumers.clear();
		            try {
		                const localIds = pendingPauseConsumers.map(consumer => consumer.localId);
		                await this._handler.pauseReceiving(localIds);
		            }
		            catch (error) {
		                logger.error('pausePendingConsumers() | failed to pause Consumers:', error);
		            }
		        }, 'transport.pausePendingConsumers')
		            .then(() => {
		            this._consumerPauseInProgress = false;
		            // There are pending Consumers to be paused, do it.
		            if (this._pendingPauseConsumers.size > 0) {
		                this.pausePendingConsumers();
		            }
		        })
		            // NOTE: We only get here when the await queue is closed.
		            .catch(() => { });
		    }
		    resumePendingConsumers() {
		        this._consumerResumeInProgress = true;
		        this._awaitQueue
		            .push(async () => {
		            if (this._pendingResumeConsumers.size === 0) {
		                logger.debug('resumePendingConsumers() | there is no Consumer to be resumed');
		                return;
		            }
		            const pendingResumeConsumers = Array.from(this._pendingResumeConsumers.values());
		            // Clear pending resume Consumer map.
		            this._pendingResumeConsumers.clear();
		            try {
		                const localIds = pendingResumeConsumers.map(consumer => consumer.localId);
		                await this._handler.resumeReceiving(localIds);
		            }
		            catch (error) {
		                logger.error('resumePendingConsumers() | failed to resume Consumers:', error);
		            }
		        }, 'transport.resumePendingConsumers')
		            .then(() => {
		            this._consumerResumeInProgress = false;
		            // There are pending Consumer to be resumed, do it.
		            if (this._pendingResumeConsumers.size > 0) {
		                this.resumePendingConsumers();
		            }
		        })
		            // NOTE: We only get here when the await queue is closed.
		            .catch(() => { });
		    }
		    closePendingConsumers() {
		        this._consumerCloseInProgress = true;
		        this._awaitQueue
		            .push(async () => {
		            if (this._pendingCloseConsumers.size === 0) {
		                logger.debug('closePendingConsumers() | there is no Consumer to be closed');
		                return;
		            }
		            const pendingCloseConsumers = Array.from(this._pendingCloseConsumers.values());
		            // Clear pending close Consumer map.
		            this._pendingCloseConsumers.clear();
		            try {
		                await this._handler.stopReceiving(pendingCloseConsumers.map(consumer => consumer.localId));
		            }
		            catch (error) {
		                logger.error('closePendingConsumers() | failed to close Consumers:', error);
		            }
		        }, 'transport.closePendingConsumers')
		            .then(() => {
		            this._consumerCloseInProgress = false;
		            // There are pending Consumer to be resumed, do it.
		            if (this._pendingCloseConsumers.size > 0) {
		                this.closePendingConsumers();
		            }
		        })
		            // NOTE: We only get here when the await queue is closed.
		            .catch(() => { });
		    }
		    handleHandler() {
		        const handler = this._handler;
		        handler.on('@connect', ({ dtlsParameters }, callback, errback) => {
		            if (this._closed) {
		                errback(new errors_1.InvalidStateError('closed'));
		                return;
		            }
		            this.safeEmit('connect', { dtlsParameters }, callback, errback);
		        });
		        handler.on('@icegatheringstatechange', (iceGatheringState) => {
		            if (iceGatheringState === this._iceGatheringState) {
		                return;
		            }
		            logger.debug('ICE gathering state changed to %s', iceGatheringState);
		            this._iceGatheringState = iceGatheringState;
		            if (!this._closed) {
		                this.safeEmit('icegatheringstatechange', iceGatheringState);
		            }
		        });
		        handler.on('@icecandidateerror', (event) => {
		            logger.warn(`ICE candidate error [url:${event.url}, localAddress:${event.address}, localPort:${event.port}]: ${event.errorCode} "${event.errorText}"`);
		            this.safeEmit('icecandidateerror', event);
		        });
		        handler.on('@connectionstatechange', (connectionState) => {
		            if (connectionState === this._connectionState) {
		                return;
		            }
		            logger.debug('connection state changed to %s', connectionState);
		            this._connectionState = connectionState;
		            if (!this._closed) {
		                this.safeEmit('connectionstatechange', connectionState);
		            }
		        });
		    }
		    handleProducer(producer) {
		        producer.on('@close', () => {
		            this._producers.delete(producer.id);
		            if (this._closed) {
		                return;
		            }
		            this._awaitQueue
		                .push(async () => await this._handler.stopSending(producer.localId), 'producer @close event')
		                .catch((error) => logger.warn('producer.close() failed:%o', error));
		        });
		        producer.on('@pause', (callback, errback) => {
		            this._awaitQueue
		                .push(async () => await this._handler.pauseSending(producer.localId), 'producer @pause event')
		                .then(callback)
		                .catch(errback);
		        });
		        producer.on('@resume', (callback, errback) => {
		            this._awaitQueue
		                .push(async () => await this._handler.resumeSending(producer.localId), 'producer @resume event')
		                .then(callback)
		                .catch(errback);
		        });
		        producer.on('@replacetrack', (track, callback, errback) => {
		            this._awaitQueue
		                .push(async () => await this._handler.replaceTrack(producer.localId, track), 'producer @replacetrack event')
		                .then(callback)
		                .catch(errback);
		        });
		        producer.on('@setmaxspatiallayer', (spatialLayer, callback, errback) => {
		            this._awaitQueue
		                .push(async () => await this._handler.setMaxSpatialLayer(producer.localId, spatialLayer), 'producer @setmaxspatiallayer event')
		                .then(callback)
		                .catch(errback);
		        });
		        producer.on('@setrtpencodingparameters', (params, callback, errback) => {
		            this._awaitQueue
		                .push(async () => await this._handler.setRtpEncodingParameters(producer.localId, params), 'producer @setrtpencodingparameters event')
		                .then(callback)
		                .catch(errback);
		        });
		        producer.on('@getstats', (callback, errback) => {
		            if (this._closed) {
		                return errback(new errors_1.InvalidStateError('closed'));
		            }
		            this._handler
		                .getSenderStats(producer.localId)
		                .then(callback)
		                .catch(errback);
		        });
		    }
		    handleConsumer(consumer) {
		        consumer.on('@close', () => {
		            this._consumers.delete(consumer.id);
		            this._pendingPauseConsumers.delete(consumer.id);
		            this._pendingResumeConsumers.delete(consumer.id);
		            if (this._closed) {
		                return;
		            }
		            // Store the Consumer into the close list.
		            this._pendingCloseConsumers.set(consumer.id, consumer);
		            // There is no Consumer close in progress, do it now.
		            if (this._consumerCloseInProgress === false) {
		                this.closePendingConsumers();
		            }
		        });
		        consumer.on('@pause', () => {
		            // If Consumer is pending to be resumed, remove from pending resume list.
		            if (this._pendingResumeConsumers.has(consumer.id)) {
		                this._pendingResumeConsumers.delete(consumer.id);
		            }
		            // Store the Consumer into the pending list.
		            this._pendingPauseConsumers.set(consumer.id, consumer);
		            // There is no Consumer pause in progress, do it now.
		            queueMicrotask(() => {
		                if (this._closed) {
		                    return;
		                }
		                if (this._consumerPauseInProgress === false) {
		                    this.pausePendingConsumers();
		                }
		            });
		        });
		        consumer.on('@resume', () => {
		            // If Consumer is pending to be paused, remove from pending pause list.
		            if (this._pendingPauseConsumers.has(consumer.id)) {
		                this._pendingPauseConsumers.delete(consumer.id);
		            }
		            // Store the Consumer into the pending list.
		            this._pendingResumeConsumers.set(consumer.id, consumer);
		            // There is no Consumer resume in progress, do it now.
		            queueMicrotask(() => {
		                if (this._closed) {
		                    return;
		                }
		                if (this._consumerResumeInProgress === false) {
		                    this.resumePendingConsumers();
		                }
		            });
		        });
		        consumer.on('@getstats', (callback, errback) => {
		            if (this._closed) {
		                return errback(new errors_1.InvalidStateError('closed'));
		            }
		            this._handler
		                .getReceiverStats(consumer.localId)
		                .then(callback)
		                .catch(errback);
		        });
		    }
		    handleDataProducer(dataProducer) {
		        dataProducer.on('@close', () => {
		            this._dataProducers.delete(dataProducer.id);
		        });
		    }
		    handleDataConsumer(dataConsumer) {
		        dataConsumer.on('@close', () => {
		            this._dataConsumers.delete(dataConsumer.id);
		        });
		    }
		};
		Transport.Transport = Transport$1;
		return Transport;
	}

	var Chrome111 = {};

	var lib$1 = {};

	var parser = {};

	var grammar = {exports: {}};

	var hasRequiredGrammar;

	function requireGrammar () {
		if (hasRequiredGrammar) return grammar.exports;
		hasRequiredGrammar = 1;
		var grammar$1 = grammar.exports = {
		  v: [{
		    name: 'version',
		    reg: /^(\d*)$/
		  }],
		  o: [{
		    // o=- 20518 0 IN IP4 203.0.113.1
		    // NB: sessionId will be a String in most cases because it is huge
		    name: 'origin',
		    reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
		    names: ['username', 'sessionId', 'sessionVersion', 'netType', 'ipVer', 'address'],
		    format: '%s %s %d %s IP%d %s'
		  }],
		  // default parsing of these only (though some of these feel outdated)
		  s: [{ name: 'name' }],
		  i: [{ name: 'description' }],
		  u: [{ name: 'uri' }],
		  e: [{ name: 'email' }],
		  p: [{ name: 'phone' }],
		  z: [{ name: 'timezones' }], // TODO: this one can actually be parsed properly...
		  r: [{ name: 'repeats' }],   // TODO: this one can also be parsed properly
		  // k: [{}], // outdated thing ignored
		  t: [{
		    // t=0 0
		    name: 'timing',
		    reg: /^(\d*) (\d*)/,
		    names: ['start', 'stop'],
		    format: '%d %d'
		  }],
		  c: [{
		    // c=IN IP4 10.47.197.26
		    name: 'connection',
		    reg: /^IN IP(\d) (\S*)/,
		    names: ['version', 'ip'],
		    format: 'IN IP%d %s'
		  }],
		  b: [{
		    // b=AS:4000
		    push: 'bandwidth',
		    reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
		    names: ['type', 'limit'],
		    format: '%s:%s'
		  }],
		  m: [{
		    // m=video 51744 RTP/AVP 126 97 98 34 31
		    // NB: special - pushes to session
		    // TODO: rtp/fmtp should be filtered by the payloads found here?
		    reg: /^(\w*) (\d*) ([\w/]*)(?: (.*))?/,
		    names: ['type', 'port', 'protocol', 'payloads'],
		    format: '%s %d %s %s'
		  }],
		  a: [
		    {
		      // a=rtpmap:110 opus/48000/2
		      push: 'rtp',
		      reg: /^rtpmap:(\d*) ([\w\-.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
		      names: ['payload', 'codec', 'rate', 'encoding'],
		      format: function (o) {
		        return (o.encoding)
		          ? 'rtpmap:%d %s/%s/%s'
		          : o.rate
		            ? 'rtpmap:%d %s/%s'
		            : 'rtpmap:%d %s';
		      }
		    },
		    {
		      // a=fmtp:108 profile-level-id=24;object=23;bitrate=64000
		      // a=fmtp:111 minptime=10; useinbandfec=1
		      push: 'fmtp',
		      reg: /^fmtp:(\d*) ([\S| ]*)/,
		      names: ['payload', 'config'],
		      format: 'fmtp:%d %s'
		    },
		    {
		      // a=control:streamid=0
		      name: 'control',
		      reg: /^control:(.*)/,
		      format: 'control:%s'
		    },
		    {
		      // a=rtcp:65179 IN IP4 193.84.77.194
		      name: 'rtcp',
		      reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
		      names: ['port', 'netType', 'ipVer', 'address'],
		      format: function (o) {
		        return (o.address != null)
		          ? 'rtcp:%d %s IP%d %s'
		          : 'rtcp:%d';
		      }
		    },
		    {
		      // a=rtcp-fb:98 trr-int 100
		      push: 'rtcpFbTrrInt',
		      reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
		      names: ['payload', 'value'],
		      format: 'rtcp-fb:%s trr-int %d'
		    },
		    {
		      // a=rtcp-fb:98 nack rpsi
		      push: 'rtcpFb',
		      reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
		      names: ['payload', 'type', 'subtype'],
		      format: function (o) {
		        return (o.subtype != null)
		          ? 'rtcp-fb:%s %s %s'
		          : 'rtcp-fb:%s %s';
		      }
		    },
		    {
		      // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
		      // a=extmap:1/recvonly URI-gps-string
		      // a=extmap:3 urn:ietf:params:rtp-hdrext:encrypt urn:ietf:params:rtp-hdrext:smpte-tc 25@600/24
		      push: 'ext',
		      reg: /^extmap:(\d+)(?:\/(\w+))?(?: (urn:ietf:params:rtp-hdrext:encrypt))? (\S*)(?: (\S*))?/,
		      names: ['value', 'direction', 'encrypt-uri', 'uri', 'config'],
		      format: function (o) {
		        return (
		          'extmap:%d' +
		          (o.direction ? '/%s' : '%v') +
		          (o['encrypt-uri'] ? ' %s' : '%v') +
		          ' %s' +
		          (o.config ? ' %s' : '')
		        );
		      }
		    },
		    {
		      // a=extmap-allow-mixed
		      name: 'extmapAllowMixed',
		      reg: /^(extmap-allow-mixed)/
		    },
		    {
		      // a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:PS1uQCVeeCFCanVmcjkpPywjNWhcYD0mXXtxaVBR|2^20|1:32
		      push: 'crypto',
		      reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
		      names: ['id', 'suite', 'config', 'sessionConfig'],
		      format: function (o) {
		        return (o.sessionConfig != null)
		          ? 'crypto:%d %s %s %s'
		          : 'crypto:%d %s %s';
		      }
		    },
		    {
		      // a=setup:actpass
		      name: 'setup',
		      reg: /^setup:(\w*)/,
		      format: 'setup:%s'
		    },
		    {
		      // a=connection:new
		      name: 'connectionType',
		      reg: /^connection:(new|existing)/,
		      format: 'connection:%s'
		    },
		    {
		      // a=mid:1
		      name: 'mid',
		      reg: /^mid:([^\s]*)/,
		      format: 'mid:%s'
		    },
		    {
		      // a=msid:0c8b064d-d807-43b4-b434-f92a889d8587 98178685-d409-46e0-8e16-7ef0db0db64a
		      name: 'msid',
		      reg: /^msid:(.*)/,
		      format: 'msid:%s'
		    },
		    {
		      // a=ptime:20
		      name: 'ptime',
		      reg: /^ptime:(\d*(?:\.\d*)*)/,
		      format: 'ptime:%d'
		    },
		    {
		      // a=maxptime:60
		      name: 'maxptime',
		      reg: /^maxptime:(\d*(?:\.\d*)*)/,
		      format: 'maxptime:%d'
		    },
		    {
		      // a=sendrecv
		      name: 'direction',
		      reg: /^(sendrecv|recvonly|sendonly|inactive)/
		    },
		    {
		      // a=ice-lite
		      name: 'icelite',
		      reg: /^(ice-lite)/
		    },
		    {
		      // a=ice-ufrag:F7gI
		      name: 'iceUfrag',
		      reg: /^ice-ufrag:(\S*)/,
		      format: 'ice-ufrag:%s'
		    },
		    {
		      // a=ice-pwd:x9cml/YzichV2+XlhiMu8g
		      name: 'icePwd',
		      reg: /^ice-pwd:(\S*)/,
		      format: 'ice-pwd:%s'
		    },
		    {
		      // a=fingerprint:SHA-1 00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33
		      name: 'fingerprint',
		      reg: /^fingerprint:(\S*) (\S*)/,
		      names: ['type', 'hash'],
		      format: 'fingerprint:%s %s'
		    },
		    {
		      // a=candidate:0 1 UDP 2113667327 203.0.113.1 54400 typ host
		      // a=candidate:1162875081 1 udp 2113937151 192.168.34.75 60017 typ host generation 0 network-id 3 network-cost 10
		      // a=candidate:3289912957 2 udp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 generation 0 network-id 3 network-cost 10
		      // a=candidate:229815620 1 tcp 1518280447 192.168.150.19 60017 typ host tcptype active generation 0 network-id 3 network-cost 10
		      // a=candidate:3289912957 2 tcp 1845501695 193.84.77.194 60017 typ srflx raddr 192.168.34.75 rport 60017 tcptype passive generation 0 network-id 3 network-cost 10
		      push:'candidates',
		      reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
		      names: ['foundation', 'component', 'transport', 'priority', 'ip', 'port', 'type', 'raddr', 'rport', 'tcptype', 'generation', 'network-id', 'network-cost'],
		      format: function (o) {
		        var str = 'candidate:%s %d %s %d %s %d typ %s';

		        str += (o.raddr != null) ? ' raddr %s rport %d' : '%v%v';

		        // NB: candidate has three optional chunks, so %void middles one if it's missing
		        str += (o.tcptype != null) ? ' tcptype %s' : '%v';

		        if (o.generation != null) {
		          str += ' generation %d';
		        }

		        str += (o['network-id'] != null) ? ' network-id %d' : '%v';
		        str += (o['network-cost'] != null) ? ' network-cost %d' : '%v';
		        return str;
		      }
		    },
		    {
		      // a=end-of-candidates (keep after the candidates line for readability)
		      name: 'endOfCandidates',
		      reg: /^(end-of-candidates)/
		    },
		    {
		      // a=remote-candidates:1 203.0.113.1 54400 2 203.0.113.1 54401 ...
		      name: 'remoteCandidates',
		      reg: /^remote-candidates:(.*)/,
		      format: 'remote-candidates:%s'
		    },
		    {
		      // a=ice-options:google-ice
		      name: 'iceOptions',
		      reg: /^ice-options:(\S*)/,
		      format: 'ice-options:%s'
		    },
		    {
		      // a=ssrc:2566107569 cname:t9YU8M1UxTF8Y1A1
		      push: 'ssrcs',
		      reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
		      names: ['id', 'attribute', 'value'],
		      format: function (o) {
		        var str = 'ssrc:%d';
		        if (o.attribute != null) {
		          str += ' %s';
		          if (o.value != null) {
		            str += ':%s';
		          }
		        }
		        return str;
		      }
		    },
		    {
		      // a=ssrc-group:FEC 1 2
		      // a=ssrc-group:FEC-FR 3004364195 1080772241
		      push: 'ssrcGroups',
		      // token-char = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7E
		      reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
		      names: ['semantics', 'ssrcs'],
		      format: 'ssrc-group:%s %s'
		    },
		    {
		      // a=msid-semantic: WMS Jvlam5X3SX1OP6pn20zWogvaKJz5Hjf9OnlV
		      name: 'msidSemantic',
		      reg: /^msid-semantic:\s?(\w*) (\S*)/,
		      names: ['semantic', 'token'],
		      format: 'msid-semantic: %s %s' // space after ':' is not accidental
		    },
		    {
		      // a=group:BUNDLE audio video
		      push: 'groups',
		      reg: /^group:(\w*) (.*)/,
		      names: ['type', 'mids'],
		      format: 'group:%s %s'
		    },
		    {
		      // a=rtcp-mux
		      name: 'rtcpMux',
		      reg: /^(rtcp-mux)/
		    },
		    {
		      // a=rtcp-rsize
		      name: 'rtcpRsize',
		      reg: /^(rtcp-rsize)/
		    },
		    {
		      // a=sctpmap:5000 webrtc-datachannel 1024
		      name: 'sctpmap',
		      reg: /^sctpmap:([\w_/]*) (\S*)(?: (\S*))?/,
		      names: ['sctpmapNumber', 'app', 'maxMessageSize'],
		      format: function (o) {
		        return (o.maxMessageSize != null)
		          ? 'sctpmap:%s %s %s'
		          : 'sctpmap:%s %s';
		      }
		    },
		    {
		      // a=x-google-flag:conference
		      name: 'xGoogleFlag',
		      reg: /^x-google-flag:([^\s]*)/,
		      format: 'x-google-flag:%s'
		    },
		    {
		      // a=rid:1 send max-width=1280;max-height=720;max-fps=30;depend=0
		      push: 'rids',
		      reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
		      names: ['id', 'direction', 'params'],
		      format: function (o) {
		        return (o.params) ? 'rid:%s %s %s' : 'rid:%s %s';
		      }
		    },
		    {
		      // a=imageattr:97 send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320] recv [x=330,y=250]
		      // a=imageattr:* send [x=800,y=640] recv *
		      // a=imageattr:100 recv [x=320,y=240]
		      push: 'imageattrs',
		      reg: new RegExp(
		        // a=imageattr:97
		        '^imageattr:(\\d+|\\*)' +
		        // send [x=800,y=640,sar=1.1,q=0.6] [x=480,y=320]
		        '[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)' +
		        // recv [x=330,y=250]
		        '(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?'
		      ),
		      names: ['pt', 'dir1', 'attrs1', 'dir2', 'attrs2'],
		      format: function (o) {
		        return 'imageattr:%s %s %s' + (o.dir2 ? ' %s %s' : '');
		      }
		    },
		    {
		      // a=simulcast:send 1,2,3;~4,~5 recv 6;~7,~8
		      // a=simulcast:recv 1;4,5 send 6;7
		      name: 'simulcast',
		      reg: new RegExp(
		        // a=simulcast:
		        '^simulcast:' +
		        // send 1,2,3;~4,~5
		        '(send|recv) ([a-zA-Z0-9\\-_~;,]+)' +
		        // space + recv 6;~7,~8
		        '(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?' +
		        // end
		        '$'
		      ),
		      names: ['dir1', 'list1', 'dir2', 'list2'],
		      format: function (o) {
		        return 'simulcast:%s %s' + (o.dir2 ? ' %s %s' : '');
		      }
		    },
		    {
		      // old simulcast draft 03 (implemented by Firefox)
		      //   https://tools.ietf.org/html/draft-ietf-mmusic-sdp-simulcast-03
		      // a=simulcast: recv pt=97;98 send pt=97
		      // a=simulcast: send rid=5;6;7 paused=6,7
		      name: 'simulcast_03',
		      reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
		      names: ['value'],
		      format: 'simulcast: %s'
		    },
		    {
		      // a=framerate:25
		      // a=framerate:29.97
		      name: 'framerate',
		      reg: /^framerate:(\d+(?:$|\.\d+))/,
		      format: 'framerate:%s'
		    },
		    {
		      // RFC4570
		      // a=source-filter: incl IN IP4 239.5.2.31 10.1.15.5
		      name: 'sourceFilter',
		      reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
		      names: ['filterMode', 'netType', 'addressTypes', 'destAddress', 'srcList'],
		      format: 'source-filter: %s %s %s %s %s'
		    },
		    {
		      // a=bundle-only
		      name: 'bundleOnly',
		      reg: /^(bundle-only)/
		    },
		    {
		      // a=label:1
		      name: 'label',
		      reg: /^label:(.+)/,
		      format: 'label:%s'
		    },
		    {
		      // RFC version 26 for SCTP over DTLS
		      // https://tools.ietf.org/html/draft-ietf-mmusic-sctp-sdp-26#section-5
		      name: 'sctpPort',
		      reg: /^sctp-port:(\d+)$/,
		      format: 'sctp-port:%s'
		    },
		    {
		      // RFC version 26 for SCTP over DTLS
		      // https://tools.ietf.org/html/draft-ietf-mmusic-sctp-sdp-26#section-6
		      name: 'maxMessageSize',
		      reg: /^max-message-size:(\d+)$/,
		      format: 'max-message-size:%s'
		    },
		    {
		      // RFC7273
		      // a=ts-refclk:ptp=IEEE1588-2008:39-A7-94-FF-FE-07-CB-D0:37
		      push:'tsRefClocks',
		      reg: /^ts-refclk:([^\s=]*)(?:=(\S*))?/,
		      names: ['clksrc', 'clksrcExt'],
		      format: function (o) {
		        return 'ts-refclk:%s' + (o.clksrcExt != null ? '=%s' : '');
		      }
		    },
		    {
		      // RFC7273
		      // a=mediaclk:direct=963214424
		      name:'mediaClk',
		      reg: /^mediaclk:(?:id=(\S*))? *([^\s=]*)(?:=(\S*))?(?: *rate=(\d+)\/(\d+))?/,
		      names: ['id', 'mediaClockName', 'mediaClockValue', 'rateNumerator', 'rateDenominator'],
		      format: function (o) {
		        var str = 'mediaclk:';
		        str += (o.id != null ? 'id=%s %s' : '%v%s');
		        str += (o.mediaClockValue != null ? '=%s' : '');
		        str += (o.rateNumerator != null ? ' rate=%s' : '');
		        str += (o.rateDenominator != null ? '/%s' : '');
		        return str;
		      }
		    },
		    {
		      // a=keywds:keywords
		      name: 'keywords',
		      reg: /^keywds:(.+)$/,
		      format: 'keywds:%s'
		    },
		    {
		      // a=content:main
		      name: 'content',
		      reg: /^content:(.+)/,
		      format: 'content:%s'
		    },
		    // BFCP https://tools.ietf.org/html/rfc4583
		    {
		      // a=floorctrl:c-s
		      name: 'bfcpFloorCtrl',
		      reg: /^floorctrl:(c-only|s-only|c-s)/,
		      format: 'floorctrl:%s'
		    },
		    {
		      // a=confid:1
		      name: 'bfcpConfId',
		      reg: /^confid:(\d+)/,
		      format: 'confid:%s'
		    },
		    {
		      // a=userid:1
		      name: 'bfcpUserId',
		      reg: /^userid:(\d+)/,
		      format: 'userid:%s'
		    },
		    {
		      // a=floorid:1
		      name: 'bfcpFloorId',
		      reg: /^floorid:(.+) (?:m-stream|mstrm):(.+)/,
		      names: ['id', 'mStream'],
		      format: 'floorid:%s mstrm:%s'
		    },
		    {
		      // any a= that we don't understand is kept verbatim on media.invalid
		      push: 'invalid',
		      names: ['value']
		    }
		  ]
		};

		// set sensible defaults to avoid polluting the grammar with boring details
		Object.keys(grammar$1).forEach(function (key) {
		  var objs = grammar$1[key];
		  objs.forEach(function (obj) {
		    if (!obj.reg) {
		      obj.reg = /(.*)/;
		    }
		    if (!obj.format) {
		      obj.format = '%s';
		    }
		  });
		});
		return grammar.exports;
	}

	var hasRequiredParser;

	function requireParser () {
		if (hasRequiredParser) return parser;
		hasRequiredParser = 1;
		(function (exports) {
			var toIntIfInt = function (v) {
			  return String(Number(v)) === v ? Number(v) : v;
			};

			var attachProperties = function (match, location, names, rawName) {
			  if (rawName && !names) {
			    location[rawName] = toIntIfInt(match[1]);
			  }
			  else {
			    for (var i = 0; i < names.length; i += 1) {
			      if (match[i+1] != null) {
			        location[names[i]] = toIntIfInt(match[i+1]);
			      }
			    }
			  }
			};

			var parseReg = function (obj, location, content) {
			  var needsBlank = obj.name && obj.names;
			  if (obj.push && !location[obj.push]) {
			    location[obj.push] = [];
			  }
			  else if (needsBlank && !location[obj.name]) {
			    location[obj.name] = {};
			  }
			  var keyLocation = obj.push ?
			    {} :  // blank object that will be pushed
			    needsBlank ? location[obj.name] : location; // otherwise, named location or root

			  attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);

			  if (obj.push) {
			    location[obj.push].push(keyLocation);
			  }
			};

			var grammar = requireGrammar();
			var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);

			exports.parse = function (sdp) {
			  var session = {}
			    , media = []
			    , location = session; // points at where properties go under (one of the above)

			  // parse lines we understand
			  sdp.split(/(\r\n|\r|\n)/).filter(validLine).forEach(function (l) {
			    var type = l[0];
			    var content = l.slice(2);
			    if (type === 'm') {
			      media.push({rtp: [], fmtp: []});
			      location = media[media.length-1]; // point at latest media line
			    }

			    for (var j = 0; j < (grammar[type] || []).length; j += 1) {
			      var obj = grammar[type][j];
			      if (obj.reg.test(content)) {
			        return parseReg(obj, location, content);
			      }
			    }
			  });

			  session.media = media; // link it up
			  return session;
			};

			var paramReducer = function (acc, expr) {
			  var s = expr.split(/=(.+)/, 2);
			  if (s.length === 2) {
			    acc[s[0]] = toIntIfInt(s[1]);
			  } else if (s.length === 1 && expr.length > 1) {
			    acc[s[0]] = undefined;
			  }
			  return acc;
			};

			exports.parseParams = function (str) {
			  return str.split(/;\s?/).reduce(paramReducer, {});
			};

			// For backward compatibility - alias will be removed in 3.0.0
			exports.parseFmtpConfig = exports.parseParams;

			exports.parsePayloads = function (str) {
			  return str.toString().split(' ').map(Number);
			};

			exports.parseRemoteCandidates = function (str) {
			  var candidates = [];
			  var parts = str.split(' ').map(toIntIfInt);
			  for (var i = 0; i < parts.length; i += 3) {
			    candidates.push({
			      component: parts[i],
			      ip: parts[i + 1],
			      port: parts[i + 2]
			    });
			  }
			  return candidates;
			};

			exports.parseImageAttributes = function (str) {
			  return str.split(' ').map(function (item) {
			    return item.substring(1, item.length-1).split(',').reduce(paramReducer, {});
			  });
			};

			exports.parseSimulcastStreamList = function (str) {
			  return str.split(';').map(function (stream) {
			    return stream.split(',').map(function (format) {
			      var scid, paused = false;

			      if (format[0] !== '~') {
			        scid = toIntIfInt(format);
			      } else {
			        scid = toIntIfInt(format.substring(1, format.length));
			        paused = true;
			      }

			      return {
			        scid: scid,
			        paused: paused
			      };
			    });
			  });
			}; 
		} (parser));
		return parser;
	}

	var writer;
	var hasRequiredWriter;

	function requireWriter () {
		if (hasRequiredWriter) return writer;
		hasRequiredWriter = 1;
		var grammar = requireGrammar();

		// customized util.format - discards excess arguments and can void middle ones
		var formatRegExp = /%[sdv%]/g;
		var format = function (formatStr) {
		  var i = 1;
		  var args = arguments;
		  var len = args.length;
		  return formatStr.replace(formatRegExp, function (x) {
		    if (i >= len) {
		      return x; // missing argument
		    }
		    var arg = args[i];
		    i += 1;
		    switch (x) {
		    case '%%':
		      return '%';
		    case '%s':
		      return String(arg);
		    case '%d':
		      return Number(arg);
		    case '%v':
		      return '';
		    }
		  });
		  // NB: we discard excess arguments - they are typically undefined from makeLine
		};

		var makeLine = function (type, obj, location) {
		  var str = obj.format instanceof Function ?
		    (obj.format(obj.push ? location : location[obj.name])) :
		    obj.format;

		  var args = [type + '=' + str];
		  if (obj.names) {
		    for (var i = 0; i < obj.names.length; i += 1) {
		      var n = obj.names[i];
		      if (obj.name) {
		        args.push(location[obj.name][n]);
		      }
		      else { // for mLine and push attributes
		        args.push(location[obj.names[i]]);
		      }
		    }
		  }
		  else {
		    args.push(location[obj.name]);
		  }
		  return format.apply(null, args);
		};

		// RFC specified order
		// TODO: extend this with all the rest
		var defaultOuterOrder = [
		  'v', 'o', 's', 'i',
		  'u', 'e', 'p', 'c',
		  'b', 't', 'r', 'z', 'a'
		];
		var defaultInnerOrder = ['i', 'c', 'b', 'a'];


		writer = function (session, opts) {
		  opts = opts || {};
		  // ensure certain properties exist
		  if (session.version == null) {
		    session.version = 0; // 'v=0' must be there (only defined version atm)
		  }
		  if (session.name == null) {
		    session.name = ' '; // 's= ' must be there if no meaningful name set
		  }
		  session.media.forEach(function (mLine) {
		    if (mLine.payloads == null) {
		      mLine.payloads = '';
		    }
		  });

		  var outerOrder = opts.outerOrder || defaultOuterOrder;
		  var innerOrder = opts.innerOrder || defaultInnerOrder;
		  var sdp = [];

		  // loop through outerOrder for matching properties on session
		  outerOrder.forEach(function (type) {
		    grammar[type].forEach(function (obj) {
		      if (obj.name in session && session[obj.name] != null) {
		        sdp.push(makeLine(type, obj, session));
		      }
		      else if (obj.push in session && session[obj.push] != null) {
		        session[obj.push].forEach(function (el) {
		          sdp.push(makeLine(type, obj, el));
		        });
		      }
		    });
		  });

		  // then for each media line, follow the innerOrder
		  session.media.forEach(function (mLine) {
		    sdp.push(makeLine('m', grammar.m[0], mLine));

		    innerOrder.forEach(function (type) {
		      grammar[type].forEach(function (obj) {
		        if (obj.name in mLine && mLine[obj.name] != null) {
		          sdp.push(makeLine(type, obj, mLine));
		        }
		        else if (obj.push in mLine && mLine[obj.push] != null) {
		          mLine[obj.push].forEach(function (el) {
		            sdp.push(makeLine(type, obj, el));
		          });
		        }
		      });
		    });
		  });

		  return sdp.join('\r\n') + '\r\n';
		};
		return writer;
	}

	var hasRequiredLib$2;

	function requireLib$2 () {
		if (hasRequiredLib$2) return lib$1;
		hasRequiredLib$2 = 1;
		var parser = requireParser();
		var writer = requireWriter();
		var grammar = requireGrammar();

		lib$1.grammar = grammar;
		lib$1.write = writer;
		lib$1.parse = parser.parse;
		lib$1.parseParams = parser.parseParams;
		lib$1.parseFmtpConfig = parser.parseFmtpConfig; // Alias of parseParams().
		lib$1.parsePayloads = parser.parsePayloads;
		lib$1.parseRemoteCandidates = parser.parseRemoteCandidates;
		lib$1.parseImageAttributes = parser.parseImageAttributes;
		lib$1.parseSimulcastStreamList = parser.parseSimulcastStreamList;
		return lib$1;
	}

	var commonUtils = {};

	var hasRequiredCommonUtils;

	function requireCommonUtils () {
		if (hasRequiredCommonUtils) return commonUtils;
		hasRequiredCommonUtils = 1;
		Object.defineProperty(commonUtils, "__esModule", { value: true });
		commonUtils.extractRtpCapabilities = extractRtpCapabilities;
		commonUtils.extractDtlsParameters = extractDtlsParameters;
		commonUtils.getCname = getCname;
		commonUtils.applyCodecParameters = applyCodecParameters;
		const sdpTransform = requireLib$2();
		/**
		 * This function must be called with an SDP with 1 m=audio and 1 m=video
		 * sections.
		 */
		function extractRtpCapabilities({ sdpObject, }) {
		    // Map of RtpCodecParameters indexed by payload type.
		    const codecsMap = new Map();
		    // Array of RtpHeaderExtensions.
		    const headerExtensions = [];
		    // Whether a m=audio/video section has been already found.
		    let gotAudio = false;
		    let gotVideo = false;
		    for (const m of sdpObject.media) {
		        const kind = m.type;
		        switch (kind) {
		            case 'audio': {
		                if (gotAudio) {
		                    continue;
		                }
		                gotAudio = true;
		                break;
		            }
		            case 'video': {
		                if (gotVideo) {
		                    continue;
		                }
		                gotVideo = true;
		                break;
		            }
		            default: {
		                continue;
		            }
		        }
		        // Get codecs.
		        for (const rtp of m.rtp) {
		            const codec = {
		                kind: kind,
		                mimeType: `${kind}/${rtp.codec}`,
		                preferredPayloadType: rtp.payload,
		                clockRate: rtp.rate,
		                channels: rtp.encoding,
		                parameters: {},
		                rtcpFeedback: [],
		            };
		            codecsMap.set(codec.preferredPayloadType, codec);
		        }
		        // Get codec parameters.
		        for (const fmtp of m.fmtp ?? []) {
		            const parameters = sdpTransform.parseParams(fmtp.config);
		            const codec = codecsMap.get(fmtp.payload);
		            if (!codec) {
		                continue;
		            }
		            // Specials case to convert parameter value to string.
		            if (parameters?.hasOwnProperty('profile-level-id')) {
		                parameters['profile-level-id'] = String(parameters['profile-level-id']);
		            }
		            codec.parameters = parameters;
		        }
		        // Get RTCP feedback for each codec.
		        for (const fb of m.rtcpFb ?? []) {
		            const feedback = {
		                type: fb.type,
		                parameter: fb.subtype,
		            };
		            if (!feedback.parameter) {
		                delete feedback.parameter;
		            }
		            // rtcp-fb payload is not '*', so just apply it to its corresponding
		            // codec.
		            if (fb.payload !== '*') {
		                const codec = codecsMap.get(fb.payload);
		                if (!codec) {
		                    continue;
		                }
		                codec.rtcpFeedback.push(feedback);
		            }
		            // If rtcp-fb payload is '*' it must be applied to all codecs with same
		            // kind (with some exceptions such as RTX codec).
		            else {
		                for (const codec of codecsMap.values()) {
		                    if (codec.kind === kind && !/.+\/rtx$/i.test(codec.mimeType)) {
		                        codec.rtcpFeedback.push(feedback);
		                    }
		                }
		            }
		        }
		        // Get RTP header extensions.
		        for (const ext of m.ext ?? []) {
		            // Ignore encrypted extensions (not yet supported in mediasoup).
		            if (ext['encrypt-uri']) {
		                continue;
		            }
		            const headerExtension = {
		                kind: kind,
		                uri: ext.uri,
		                preferredId: ext.value,
		            };
		            headerExtensions.push(headerExtension);
		        }
		    }
		    const rtpCapabilities = {
		        codecs: Array.from(codecsMap.values()),
		        headerExtensions: headerExtensions,
		    };
		    return rtpCapabilities;
		}
		function extractDtlsParameters({ sdpObject, }) {
		    let setup = sdpObject.setup;
		    let fingerprint = sdpObject.fingerprint;
		    if (!setup || !fingerprint) {
		        const mediaObject = (sdpObject.media ?? []).find((m) => m.port !== 0);
		        if (mediaObject) {
		            setup ??= mediaObject.setup;
		            fingerprint ??= mediaObject.fingerprint;
		        }
		    }
		    if (!setup) {
		        throw new Error('no a=setup found at SDP session or media level');
		    }
		    else if (!fingerprint) {
		        throw new Error('no a=fingerprint found at SDP session or media level');
		    }
		    let role;
		    switch (setup) {
		        case 'active': {
		            role = 'client';
		            break;
		        }
		        case 'passive': {
		            role = 'server';
		            break;
		        }
		        case 'actpass': {
		            role = 'auto';
		            break;
		        }
		    }
		    const dtlsParameters = {
		        role,
		        fingerprints: [
		            {
		                algorithm: fingerprint.type,
		                value: fingerprint.hash,
		            },
		        ],
		    };
		    return dtlsParameters;
		}
		function getCname({ offerMediaObject, }) {
		    const ssrcCnameLine = (offerMediaObject.ssrcs ?? []).find((line) => line.attribute === 'cname');
		    if (!ssrcCnameLine) {
		        return '';
		    }
		    return ssrcCnameLine.value;
		}
		/**
		 * Apply codec parameters in the given SDP m= section answer based on the
		 * given RTP parameters of an offer.
		 */
		function applyCodecParameters({ offerRtpParameters, answerMediaObject, }) {
		    for (const codec of offerRtpParameters.codecs) {
		        const mimeType = codec.mimeType.toLowerCase();
		        // Avoid parsing codec parameters for unhandled codecs.
		        if (mimeType !== 'audio/opus') {
		            continue;
		        }
		        const rtp = (answerMediaObject.rtp ?? []).find((r) => r.payload === codec.payloadType);
		        if (!rtp) {
		            continue;
		        }
		        // Just in case.
		        answerMediaObject.fmtp = answerMediaObject.fmtp ?? [];
		        let fmtp = answerMediaObject.fmtp.find((f) => f.payload === codec.payloadType);
		        if (!fmtp) {
		            fmtp = { payload: codec.payloadType, config: '' };
		            answerMediaObject.fmtp.push(fmtp);
		        }
		        const parameters = sdpTransform.parseParams(fmtp.config);
		        switch (mimeType) {
		            case 'audio/opus': {
		                const spropStereo = codec.parameters['sprop-stereo'];
		                if (spropStereo !== undefined) {
		                    parameters['stereo'] = Number(spropStereo) ? 1 : 0;
		                }
		                break;
		            }
		        }
		        // Write the codec fmtp.config back.
		        fmtp.config = '';
		        for (const key of Object.keys(parameters)) {
		            if (fmtp.config) {
		                fmtp.config += ';';
		            }
		            fmtp.config += `${key}=${parameters[key]}`;
		        }
		    }
		}
		return commonUtils;
	}

	var unifiedPlanUtils = {};

	var hasRequiredUnifiedPlanUtils;

	function requireUnifiedPlanUtils () {
		if (hasRequiredUnifiedPlanUtils) return unifiedPlanUtils;
		hasRequiredUnifiedPlanUtils = 1;
		Object.defineProperty(unifiedPlanUtils, "__esModule", { value: true });
		unifiedPlanUtils.getRtpEncodings = getRtpEncodings;
		unifiedPlanUtils.addLegacySimulcast = addLegacySimulcast;
		function getRtpEncodings({ offerMediaObject, }) {
		    const ssrcs = new Set();
		    for (const line of offerMediaObject.ssrcs ?? []) {
		        const ssrc = line.id;
		        ssrcs.add(ssrc);
		    }
		    if (ssrcs.size === 0) {
		        throw new Error('no a=ssrc lines found');
		    }
		    const ssrcToRtxSsrc = new Map();
		    // First assume RTX is used.
		    for (const line of offerMediaObject.ssrcGroups ?? []) {
		        if (line.semantics !== 'FID') {
		            continue;
		        }
		        let [ssrc, rtxSsrc] = line.ssrcs.split(/\s+/);
		        ssrc = Number(ssrc);
		        rtxSsrc = Number(rtxSsrc);
		        if (ssrcs.has(ssrc)) {
		            // Remove both the SSRC and RTX SSRC from the set so later we know
		            // that they are already handled.
		            ssrcs.delete(ssrc);
		            ssrcs.delete(rtxSsrc);
		            // Add to the map.
		            ssrcToRtxSsrc.set(ssrc, rtxSsrc);
		        }
		    }
		    // If the set of SSRCs is not empty it means that RTX is not being used, so
		    // take media SSRCs from there.
		    for (const ssrc of ssrcs) {
		        // Add to the map.
		        ssrcToRtxSsrc.set(ssrc, null);
		    }
		    const encodings = [];
		    for (const [ssrc, rtxSsrc] of ssrcToRtxSsrc) {
		        const encoding = { ssrc };
		        if (rtxSsrc) {
		            encoding.rtx = { ssrc: rtxSsrc };
		        }
		        encodings.push(encoding);
		    }
		    return encodings;
		}
		/**
		 * Adds multi-ssrc based simulcast into the given SDP media section offer.
		 */
		function addLegacySimulcast({ offerMediaObject, numStreams, }) {
		    if (numStreams <= 1) {
		        throw new TypeError('numStreams must be greater than 1');
		    }
		    // Get the SSRC.
		    const ssrcMsidLine = (offerMediaObject.ssrcs ?? []).find((line) => line.attribute === 'msid');
		    if (!ssrcMsidLine) {
		        throw new Error('a=ssrc line with msid information not found');
		    }
		    const [streamId, trackId] = ssrcMsidLine.value.split(' ');
		    const firstSsrc = Number(ssrcMsidLine.id);
		    let firstRtxSsrc;
		    // Get the SSRC for RTX.
		    (offerMediaObject.ssrcGroups ?? []).some((line) => {
		        if (line.semantics !== 'FID') {
		            return false;
		        }
		        const ssrcs = line.ssrcs.split(/\s+/);
		        if (Number(ssrcs[0]) === firstSsrc) {
		            firstRtxSsrc = Number(ssrcs[1]);
		            return true;
		        }
		        else {
		            return false;
		        }
		    });
		    const ssrcCnameLine = offerMediaObject.ssrcs.find((line) => line.attribute === 'cname');
		    if (!ssrcCnameLine) {
		        throw new Error('a=ssrc line with cname information not found');
		    }
		    const cname = ssrcCnameLine.value;
		    const ssrcs = [];
		    const rtxSsrcs = [];
		    for (let i = 0; i < numStreams; ++i) {
		        ssrcs.push(firstSsrc + i);
		        if (firstRtxSsrc) {
		            rtxSsrcs.push(firstRtxSsrc + i);
		        }
		    }
		    offerMediaObject.ssrcGroups = [];
		    offerMediaObject.ssrcs = [];
		    offerMediaObject.ssrcGroups.push({
		        semantics: 'SIM',
		        ssrcs: ssrcs.join(' '),
		    });
		    for (const ssrc of ssrcs) {
		        offerMediaObject.ssrcs.push({
		            id: ssrc,
		            attribute: 'cname',
		            value: cname,
		        });
		        offerMediaObject.ssrcs.push({
		            id: ssrc,
		            attribute: 'msid',
		            value: `${streamId} ${trackId}`,
		        });
		    }
		    for (let i = 0; i < rtxSsrcs.length; ++i) {
		        const ssrc = ssrcs[i];
		        const rtxSsrc = rtxSsrcs[i];
		        offerMediaObject.ssrcs.push({
		            id: rtxSsrc,
		            attribute: 'cname',
		            value: cname,
		        });
		        offerMediaObject.ssrcs.push({
		            id: rtxSsrc,
		            attribute: 'msid',
		            value: `${streamId} ${trackId}`,
		        });
		        offerMediaObject.ssrcGroups.push({
		            semantics: 'FID',
		            ssrcs: `${ssrc} ${rtxSsrc}`,
		        });
		    }
		}
		return unifiedPlanUtils;
	}

	var utils$1 = {};

	var hasRequiredUtils$1;

	function requireUtils$1 () {
		if (hasRequiredUtils$1) return utils$1;
		hasRequiredUtils$1 = 1;
		Object.defineProperty(utils$1, "__esModule", { value: true });
		utils$1.addNackSupportForOpus = addNackSupportForOpus;
		/**
		 * This function adds RTCP NACK support for OPUS codec in given capabilities.
		 */
		function addNackSupportForOpus(rtpCapabilities) {
		    for (const codec of rtpCapabilities.codecs ?? []) {
		        if ((codec.mimeType.toLowerCase() === 'audio/opus' ||
		            codec.mimeType.toLowerCase() === 'audio/multiopus') &&
		            !codec.rtcpFeedback?.some(fb => fb.type === 'nack' && !fb.parameter)) {
		            if (!codec.rtcpFeedback) {
		                codec.rtcpFeedback = [];
		            }
		            codec.rtcpFeedback.push({ type: 'nack' });
		        }
		    }
		}
		return utils$1;
	}

	var HandlerInterface = {};

	var hasRequiredHandlerInterface;

	function requireHandlerInterface () {
		if (hasRequiredHandlerInterface) return HandlerInterface;
		hasRequiredHandlerInterface = 1;
		Object.defineProperty(HandlerInterface, "__esModule", { value: true });
		HandlerInterface.HandlerInterface = void 0;
		const enhancedEvents_1 = requireEnhancedEvents();
		let HandlerInterface$1 = class HandlerInterface extends enhancedEvents_1.EnhancedEventEmitter {
		    constructor() {
		        super();
		    }
		};
		HandlerInterface.HandlerInterface = HandlerInterface$1;
		return HandlerInterface;
	}

	var RemoteSdp = {};

	var MediaSection = {};

	var hasRequiredMediaSection;

	function requireMediaSection () {
		if (hasRequiredMediaSection) return MediaSection;
		hasRequiredMediaSection = 1;
		Object.defineProperty(MediaSection, "__esModule", { value: true });
		MediaSection.OfferMediaSection = MediaSection.AnswerMediaSection = MediaSection.MediaSection = void 0;
		const sdpTransform = requireLib$2();
		const utils = requireUtils$2();
		let MediaSection$1 = class MediaSection {
		    // SDP media object.
		    _mediaObject;
		    // Whether this is Plan-B SDP.
		    _planB;
		    constructor({ iceParameters, iceCandidates, dtlsParameters, planB = false, }) {
		        this._mediaObject = {};
		        this._planB = planB;
		        if (iceParameters) {
		            this.setIceParameters(iceParameters);
		        }
		        if (iceCandidates) {
		            this._mediaObject.candidates = [];
		            for (const candidate of iceCandidates) {
		                const candidateObject = {};
		                // mediasoup does mandates rtcp-mux so candidates component is always
		                // RTP (1).
		                candidateObject.component = 1;
		                candidateObject.foundation = candidate.foundation;
		                // Be ready for new candidate.address field in mediasoup server side
		                // field and keep backward compatibility with deprecated candidate.ip.
		                candidateObject.ip = candidate.address ?? candidate.ip;
		                candidateObject.port = candidate.port;
		                candidateObject.priority = candidate.priority;
		                candidateObject.transport = candidate.protocol;
		                candidateObject.type = candidate.type;
		                if (candidate.tcpType) {
		                    candidateObject.tcptype = candidate.tcpType;
		                }
		                this._mediaObject.candidates.push(candidateObject);
		            }
		            this._mediaObject.endOfCandidates = 'end-of-candidates';
		            this._mediaObject.iceOptions = 'renomination';
		        }
		        if (dtlsParameters) {
		            this.setDtlsRole(dtlsParameters.role);
		        }
		    }
		    get mid() {
		        return String(this._mediaObject.mid);
		    }
		    get closed() {
		        return this._mediaObject.port === 0;
		    }
		    getObject() {
		        return this._mediaObject;
		    }
		    setIceParameters(iceParameters) {
		        this._mediaObject.iceUfrag = iceParameters.usernameFragment;
		        this._mediaObject.icePwd = iceParameters.password;
		    }
		    pause() {
		        this._mediaObject.direction = 'inactive';
		    }
		    disable() {
		        this.pause();
		        delete this._mediaObject.ext;
		        delete this._mediaObject.ssrcs;
		        delete this._mediaObject.ssrcGroups;
		        delete this._mediaObject.simulcast;
		        delete this._mediaObject.simulcast_03;
		        delete this._mediaObject.rids;
		        delete this._mediaObject.extmapAllowMixed;
		    }
		    close() {
		        this.disable();
		        this._mediaObject.port = 0;
		    }
		};
		MediaSection.MediaSection = MediaSection$1;
		class AnswerMediaSection extends MediaSection$1 {
		    constructor({ iceParameters, iceCandidates, dtlsParameters, sctpParameters, plainRtpParameters, planB = false, offerMediaObject, offerRtpParameters, answerRtpParameters, codecOptions, }) {
		        super({ iceParameters, iceCandidates, dtlsParameters, planB });
		        this._mediaObject.mid = String(offerMediaObject.mid);
		        this._mediaObject.type = offerMediaObject.type;
		        this._mediaObject.protocol = offerMediaObject.protocol;
		        if (!plainRtpParameters) {
		            this._mediaObject.connection = { ip: '127.0.0.1', version: 4 };
		            this._mediaObject.port = 7;
		        }
		        else {
		            this._mediaObject.connection = {
		                ip: plainRtpParameters.ip,
		                version: plainRtpParameters.ipVersion,
		            };
		            this._mediaObject.port = plainRtpParameters.port;
		        }
		        switch (offerMediaObject.type) {
		            case 'audio':
		            case 'video': {
		                this._mediaObject.direction = 'recvonly';
		                this._mediaObject.rtp = [];
		                this._mediaObject.rtcpFb = [];
		                this._mediaObject.fmtp = [];
		                for (const codec of answerRtpParameters.codecs) {
		                    const rtp = {
		                        payload: codec.payloadType,
		                        codec: getCodecName(codec),
		                        rate: codec.clockRate,
		                    };
		                    if (codec.channels > 1) {
		                        rtp.encoding = codec.channels;
		                    }
		                    this._mediaObject.rtp.push(rtp);
		                    const codecParameters = utils.clone(codec.parameters) ?? {};
		                    let codecRtcpFeedback = utils.clone(codec.rtcpFeedback) ?? [];
		                    if (codecOptions) {
		                        const { opusStereo, opusFec, opusDtx, opusMaxPlaybackRate, opusMaxAverageBitrate, opusPtime, opusNack, videoGoogleStartBitrate, videoGoogleMaxBitrate, videoGoogleMinBitrate, } = codecOptions;
		                        const offerCodec = offerRtpParameters.codecs.find((c) => c.payloadType === codec.payloadType);
		                        switch (codec.mimeType.toLowerCase()) {
		                            case 'audio/opus':
		                            case 'audio/multiopus': {
		                                if (opusStereo !== undefined) {
		                                    offerCodec.parameters['sprop-stereo'] = opusStereo ? 1 : 0;
		                                    codecParameters.stereo = opusStereo ? 1 : 0;
		                                }
		                                if (opusFec !== undefined) {
		                                    offerCodec.parameters.useinbandfec = opusFec ? 1 : 0;
		                                    codecParameters.useinbandfec = opusFec ? 1 : 0;
		                                }
		                                if (opusDtx !== undefined) {
		                                    offerCodec.parameters.usedtx = opusDtx ? 1 : 0;
		                                    codecParameters.usedtx = opusDtx ? 1 : 0;
		                                }
		                                if (opusMaxPlaybackRate !== undefined) {
		                                    codecParameters.maxplaybackrate = opusMaxPlaybackRate;
		                                }
		                                if (opusMaxAverageBitrate !== undefined) {
		                                    codecParameters.maxaveragebitrate = opusMaxAverageBitrate;
		                                }
		                                if (opusPtime !== undefined) {
		                                    offerCodec.parameters.ptime = opusPtime;
		                                    codecParameters.ptime = opusPtime;
		                                }
		                                // If opusNack is not set, we must remove NACK support for OPUS.
		                                // Otherwise it would be enabled for those handlers that artificially
		                                // announce it in their RTP capabilities.
		                                if (!opusNack) {
		                                    offerCodec.rtcpFeedback = offerCodec.rtcpFeedback.filter(fb => fb.type !== 'nack' || fb.parameter);
		                                    codecRtcpFeedback = codecRtcpFeedback.filter(fb => fb.type !== 'nack' || fb.parameter);
		                                }
		                                break;
		                            }
		                            case 'video/vp8':
		                            case 'video/vp9':
		                            case 'video/h264':
		                            case 'video/h265':
		                            case 'video/av1': {
		                                if (videoGoogleStartBitrate !== undefined) {
		                                    codecParameters['x-google-start-bitrate'] =
		                                        videoGoogleStartBitrate;
		                                }
		                                if (videoGoogleMaxBitrate !== undefined) {
		                                    codecParameters['x-google-max-bitrate'] =
		                                        videoGoogleMaxBitrate;
		                                }
		                                if (videoGoogleMinBitrate !== undefined) {
		                                    codecParameters['x-google-min-bitrate'] =
		                                        videoGoogleMinBitrate;
		                                }
		                                break;
		                            }
		                        }
		                    }
		                    const fmtp = {
		                        payload: codec.payloadType,
		                        config: '',
		                    };
		                    for (const key of Object.keys(codecParameters)) {
		                        if (fmtp.config) {
		                            fmtp.config += ';';
		                        }
		                        fmtp.config += `${key}=${codecParameters[key]}`;
		                    }
		                    if (fmtp.config) {
		                        this._mediaObject.fmtp.push(fmtp);
		                    }
		                    for (const fb of codecRtcpFeedback) {
		                        this._mediaObject.rtcpFb.push({
		                            payload: codec.payloadType,
		                            type: fb.type,
		                            subtype: fb.parameter,
		                        });
		                    }
		                }
		                this._mediaObject.payloads = answerRtpParameters.codecs
		                    .map((codec) => codec.payloadType)
		                    .join(' ');
		                this._mediaObject.ext = [];
		                for (const ext of answerRtpParameters.headerExtensions) {
		                    // Don't add a header extension if not present in the offer.
		                    const found = (offerMediaObject.ext ?? []).some((localExt) => localExt.uri === ext.uri);
		                    if (!found) {
		                        continue;
		                    }
		                    this._mediaObject.ext.push({
		                        uri: ext.uri,
		                        value: ext.id,
		                    });
		                }
		                // Allow both 1 byte and 2 bytes length header extensions since
		                // mediasoup can receive both at any time.
		                if (offerMediaObject.extmapAllowMixed === 'extmap-allow-mixed') {
		                    this._mediaObject.extmapAllowMixed = 'extmap-allow-mixed';
		                }
		                // Simulcast.
		                if (offerMediaObject.simulcast) {
		                    this._mediaObject.simulcast = {
		                        dir1: 'recv',
		                        list1: offerMediaObject.simulcast.list1,
		                    };
		                    this._mediaObject.rids = [];
		                    for (const rid of offerMediaObject.rids ?? []) {
		                        if (rid.direction !== 'send') {
		                            continue;
		                        }
		                        this._mediaObject.rids.push({
		                            id: rid.id,
		                            direction: 'recv',
		                        });
		                    }
		                }
		                // Simulcast (draft version 03).
		                else if (offerMediaObject.simulcast_03) {
		                    this._mediaObject.simulcast_03 = {
		                        value: offerMediaObject.simulcast_03.value.replace(/send/g, 'recv'),
		                    };
		                    this._mediaObject.rids = [];
		                    for (const rid of offerMediaObject.rids ?? []) {
		                        if (rid.direction !== 'send') {
		                            continue;
		                        }
		                        this._mediaObject.rids.push({
		                            id: rid.id,
		                            direction: 'recv',
		                        });
		                    }
		                }
		                this._mediaObject.rtcpMux = 'rtcp-mux';
		                this._mediaObject.rtcpRsize = 'rtcp-rsize';
		                if (this._planB && this._mediaObject.type === 'video') {
		                    this._mediaObject.xGoogleFlag = 'conference';
		                }
		                break;
		            }
		            case 'application': {
		                // New spec.
		                if (typeof offerMediaObject.sctpPort === 'number') {
		                    this._mediaObject.payloads = 'webrtc-datachannel';
		                    this._mediaObject.sctpPort = sctpParameters.port;
		                    this._mediaObject.maxMessageSize = sctpParameters.maxMessageSize;
		                }
		                // Old spec.
		                else if (offerMediaObject.sctpmap) {
		                    this._mediaObject.payloads = sctpParameters.port;
		                    this._mediaObject.sctpmap = {
		                        app: 'webrtc-datachannel',
		                        sctpmapNumber: sctpParameters.port,
		                        maxMessageSize: sctpParameters.maxMessageSize,
		                    };
		                }
		                break;
		            }
		        }
		    }
		    setDtlsRole(role) {
		        switch (role) {
		            case 'client': {
		                this._mediaObject.setup = 'active';
		                break;
		            }
		            case 'server': {
		                this._mediaObject.setup = 'passive';
		                break;
		            }
		            case 'auto': {
		                this._mediaObject.setup = 'actpass';
		                break;
		            }
		        }
		    }
		    resume() {
		        this._mediaObject.direction = 'recvonly';
		    }
		    muxSimulcastStreams(encodings) {
		        if (!this._mediaObject.simulcast?.list1) {
		            return;
		        }
		        const layers = {};
		        for (const encoding of encodings) {
		            if (encoding.rid) {
		                layers[encoding.rid] = encoding;
		            }
		        }
		        const raw = this._mediaObject.simulcast.list1;
		        const simulcastStreams = sdpTransform.parseSimulcastStreamList(raw);
		        for (const simulcastStream of simulcastStreams) {
		            for (const simulcastFormat of simulcastStream) {
		                simulcastFormat.paused = !layers[simulcastFormat.scid]?.active;
		            }
		        }
		        this._mediaObject.simulcast.list1 = simulcastStreams
		            .map(simulcastFormats => simulcastFormats.map(f => `${f.paused ? '~' : ''}${f.scid}`).join(','))
		            .join(';');
		    }
		}
		MediaSection.AnswerMediaSection = AnswerMediaSection;
		class OfferMediaSection extends MediaSection$1 {
		    constructor({ iceParameters, iceCandidates, dtlsParameters, sctpParameters, plainRtpParameters, planB = false, mid, kind, offerRtpParameters, streamId, trackId, oldDataChannelSpec = false, }) {
		        super({ iceParameters, iceCandidates, dtlsParameters, planB });
		        this._mediaObject.mid = String(mid);
		        this._mediaObject.type = kind;
		        if (!plainRtpParameters) {
		            this._mediaObject.connection = { ip: '127.0.0.1', version: 4 };
		            if (!sctpParameters) {
		                this._mediaObject.protocol = 'UDP/TLS/RTP/SAVPF';
		            }
		            else {
		                this._mediaObject.protocol = 'UDP/DTLS/SCTP';
		            }
		            this._mediaObject.port = 7;
		        }
		        else {
		            this._mediaObject.connection = {
		                ip: plainRtpParameters.ip,
		                version: plainRtpParameters.ipVersion,
		            };
		            this._mediaObject.protocol = 'RTP/AVP';
		            this._mediaObject.port = plainRtpParameters.port;
		        }
		        // Allow both 1 byte and 2 bytes length header extensions since
		        // mediasoup can send both at any time.
		        this._mediaObject.extmapAllowMixed = 'extmap-allow-mixed';
		        switch (kind) {
		            case 'audio':
		            case 'video': {
		                this._mediaObject.direction = 'sendonly';
		                this._mediaObject.rtp = [];
		                this._mediaObject.rtcpFb = [];
		                this._mediaObject.fmtp = [];
		                if (!this._planB) {
		                    this._mediaObject.msid = `${streamId ?? '-'} ${trackId}`;
		                }
		                for (const codec of offerRtpParameters.codecs) {
		                    const rtp = {
		                        payload: codec.payloadType,
		                        codec: getCodecName(codec),
		                        rate: codec.clockRate,
		                    };
		                    if (codec.channels > 1) {
		                        rtp.encoding = codec.channels;
		                    }
		                    this._mediaObject.rtp.push(rtp);
		                    const fmtp = {
		                        payload: codec.payloadType,
		                        config: '',
		                    };
		                    for (const key of Object.keys(codec.parameters)) {
		                        if (fmtp.config) {
		                            fmtp.config += ';';
		                        }
		                        fmtp.config += `${key}=${codec.parameters[key]}`;
		                    }
		                    if (fmtp.config) {
		                        this._mediaObject.fmtp.push(fmtp);
		                    }
		                    for (const fb of codec.rtcpFeedback) {
		                        this._mediaObject.rtcpFb.push({
		                            payload: codec.payloadType,
		                            type: fb.type,
		                            subtype: fb.parameter,
		                        });
		                    }
		                }
		                this._mediaObject.payloads = offerRtpParameters.codecs
		                    .map((codec) => codec.payloadType)
		                    .join(' ');
		                this._mediaObject.ext = [];
		                for (const ext of offerRtpParameters.headerExtensions) {
		                    this._mediaObject.ext.push({
		                        uri: ext.uri,
		                        value: ext.id,
		                    });
		                }
		                this._mediaObject.rtcpMux = 'rtcp-mux';
		                this._mediaObject.rtcpRsize = 'rtcp-rsize';
		                const encoding = offerRtpParameters.encodings[0];
		                const ssrc = encoding.ssrc;
		                const rtxSsrc = encoding.rtx?.ssrc;
		                this._mediaObject.ssrcs = [];
		                this._mediaObject.ssrcGroups = [];
		                if (offerRtpParameters.rtcp.cname) {
		                    this._mediaObject.ssrcs.push({
		                        id: ssrc,
		                        attribute: 'cname',
		                        value: offerRtpParameters.rtcp.cname,
		                    });
		                }
		                if (this._planB) {
		                    this._mediaObject.ssrcs.push({
		                        id: ssrc,
		                        attribute: 'msid',
		                        value: `${streamId ?? '-'} ${trackId}`,
		                    });
		                }
		                if (rtxSsrc) {
		                    if (offerRtpParameters.rtcp.cname) {
		                        this._mediaObject.ssrcs.push({
		                            id: rtxSsrc,
		                            attribute: 'cname',
		                            value: offerRtpParameters.rtcp.cname,
		                        });
		                    }
		                    if (this._planB) {
		                        this._mediaObject.ssrcs.push({
		                            id: rtxSsrc,
		                            attribute: 'msid',
		                            value: `${streamId ?? '-'} ${trackId}`,
		                        });
		                    }
		                    // Associate original and retransmission SSRCs.
		                    this._mediaObject.ssrcGroups.push({
		                        semantics: 'FID',
		                        ssrcs: `${ssrc} ${rtxSsrc}`,
		                    });
		                }
		                break;
		            }
		            case 'application': {
		                // New spec.
		                if (!oldDataChannelSpec) {
		                    this._mediaObject.payloads = 'webrtc-datachannel';
		                    this._mediaObject.sctpPort = sctpParameters.port;
		                    this._mediaObject.maxMessageSize = sctpParameters.maxMessageSize;
		                }
		                // Old spec.
		                else {
		                    this._mediaObject.payloads = sctpParameters.port;
		                    this._mediaObject.sctpmap = {
		                        app: 'webrtc-datachannel',
		                        sctpmapNumber: sctpParameters.port,
		                        maxMessageSize: sctpParameters.maxMessageSize,
		                    };
		                }
		                break;
		            }
		        }
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    setDtlsRole(role) {
		        // Always 'actpass'.
		        this._mediaObject.setup = 'actpass';
		    }
		    resume() {
		        this._mediaObject.direction = 'sendonly';
		    }
		    planBReceive({ offerRtpParameters, streamId, trackId, }) {
		        const encoding = offerRtpParameters.encodings[0];
		        const ssrc = encoding.ssrc;
		        const rtxSsrc = encoding.rtx?.ssrc;
		        const payloads = this._mediaObject.payloads.split(' ');
		        for (const codec of offerRtpParameters.codecs) {
		            if (payloads.includes(String(codec.payloadType))) {
		                continue;
		            }
		            const rtp = {
		                payload: codec.payloadType,
		                codec: getCodecName(codec),
		                rate: codec.clockRate,
		            };
		            if (codec.channels > 1) {
		                rtp.encoding = codec.channels;
		            }
		            this._mediaObject.rtp.push(rtp);
		            const fmtp = {
		                payload: codec.payloadType,
		                config: '',
		            };
		            for (const key of Object.keys(codec.parameters)) {
		                if (fmtp.config) {
		                    fmtp.config += ';';
		                }
		                fmtp.config += `${key}=${codec.parameters[key]}`;
		            }
		            if (fmtp.config) {
		                this._mediaObject.fmtp.push(fmtp);
		            }
		            for (const fb of codec.rtcpFeedback) {
		                this._mediaObject.rtcpFb.push({
		                    payload: codec.payloadType,
		                    type: fb.type,
		                    subtype: fb.parameter,
		                });
		            }
		        }
		        this._mediaObject.payloads += ` ${offerRtpParameters.codecs
	            .filter((codec) => !this._mediaObject.payloads.includes(codec.payloadType))
	            .map((codec) => codec.payloadType)
	            .join(' ')}`;
		        this._mediaObject.payloads = this._mediaObject.payloads.trim();
		        if (offerRtpParameters.rtcp.cname) {
		            this._mediaObject.ssrcs.push({
		                id: ssrc,
		                attribute: 'cname',
		                value: offerRtpParameters.rtcp.cname,
		            });
		        }
		        this._mediaObject.ssrcs.push({
		            id: ssrc,
		            attribute: 'msid',
		            value: `${streamId ?? '-'} ${trackId}`,
		        });
		        if (rtxSsrc) {
		            if (offerRtpParameters.rtcp.cname) {
		                this._mediaObject.ssrcs.push({
		                    id: rtxSsrc,
		                    attribute: 'cname',
		                    value: offerRtpParameters.rtcp.cname,
		                });
		            }
		            this._mediaObject.ssrcs.push({
		                id: rtxSsrc,
		                attribute: 'msid',
		                value: `${streamId ?? '-'} ${trackId}`,
		            });
		            // Associate original and retransmission SSRCs.
		            this._mediaObject.ssrcGroups.push({
		                semantics: 'FID',
		                ssrcs: `${ssrc} ${rtxSsrc}`,
		            });
		        }
		    }
		    planBStopReceiving({ offerRtpParameters, }) {
		        const encoding = offerRtpParameters.encodings[0];
		        const ssrc = encoding.ssrc;
		        const rtxSsrc = encoding.rtx?.ssrc;
		        this._mediaObject.ssrcs = this._mediaObject.ssrcs.filter((s) => s.id !== ssrc && s.id !== rtxSsrc);
		        if (rtxSsrc) {
		            this._mediaObject.ssrcGroups = this._mediaObject.ssrcGroups.filter((group) => group.ssrcs !== `${ssrc} ${rtxSsrc}`);
		        }
		    }
		}
		MediaSection.OfferMediaSection = OfferMediaSection;
		function getCodecName(codec) {
		    const MimeTypeRegex = new RegExp('^(audio|video)/(.+)', 'i');
		    const mimeTypeMatch = MimeTypeRegex.exec(codec.mimeType);
		    if (!mimeTypeMatch) {
		        throw new TypeError('invalid codec.mimeType');
		    }
		    return mimeTypeMatch[2];
		}
		return MediaSection;
	}

	var hasRequiredRemoteSdp;

	function requireRemoteSdp () {
		if (hasRequiredRemoteSdp) return RemoteSdp;
		hasRequiredRemoteSdp = 1;
		Object.defineProperty(RemoteSdp, "__esModule", { value: true });
		RemoteSdp.RemoteSdp = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const MediaSection_1 = requireMediaSection();
		const DD_CODECS = ['av1', 'h264'];
		const logger = new Logger_1.Logger('RemoteSdp');
		let RemoteSdp$1 = class RemoteSdp {
		    // Remote ICE parameters.
		    _iceParameters;
		    // Remote ICE candidates.
		    _iceCandidates;
		    // Remote DTLS parameters.
		    _dtlsParameters;
		    // Remote SCTP parameters.
		    _sctpParameters;
		    // Parameters for plain RTP (no SRTP nor DTLS no BUNDLE).
		    _plainRtpParameters;
		    // Whether this is Plan-B SDP.
		    _planB;
		    // MediaSection instances with same order as in the SDP.
		    _mediaSections = [];
		    // MediaSection indices indexed by MID.
		    _midToIndex = new Map();
		    // First MID.
		    _firstMid;
		    // SDP object.
		    _sdpObject;
		    constructor({ iceParameters, iceCandidates, dtlsParameters, sctpParameters, plainRtpParameters, planB = false, }) {
		        this._iceParameters = iceParameters;
		        this._iceCandidates = iceCandidates;
		        this._dtlsParameters = dtlsParameters;
		        this._sctpParameters = sctpParameters;
		        this._plainRtpParameters = plainRtpParameters;
		        this._planB = planB;
		        this._sdpObject = {
		            version: 0,
		            origin: {
		                address: '0.0.0.0',
		                ipVer: 4,
		                netType: 'IN',
		                sessionId: 10000,
		                sessionVersion: 0,
		                username: 'mediasoup-client',
		            },
		            name: '-',
		            timing: { start: 0, stop: 0 },
		            media: [],
		        };
		        // If ICE parameters are given, add ICE-Lite indicator.
		        if (iceParameters?.iceLite) {
		            this._sdpObject.icelite = 'ice-lite';
		        }
		        // If DTLS parameters are given, assume WebRTC and BUNDLE.
		        if (dtlsParameters) {
		            this._sdpObject.msidSemantic = { semantic: 'WMS', token: '*' };
		            // NOTE: We take the latest fingerprint.
		            const numFingerprints = this._dtlsParameters.fingerprints.length;
		            this._sdpObject.fingerprint = {
		                type: dtlsParameters.fingerprints[numFingerprints - 1].algorithm,
		                hash: dtlsParameters.fingerprints[numFingerprints - 1].value,
		            };
		            this._sdpObject.groups = [{ type: 'BUNDLE', mids: '' }];
		        }
		        // If there are plain RPT parameters, override SDP origin.
		        if (plainRtpParameters) {
		            this._sdpObject.origin.address = plainRtpParameters.ip;
		            this._sdpObject.origin.ipVer = plainRtpParameters.ipVersion;
		        }
		    }
		    updateIceParameters(iceParameters) {
		        logger.debug('updateIceParameters() [iceParameters:%o]', iceParameters);
		        this._iceParameters = iceParameters;
		        this._sdpObject.icelite = iceParameters.iceLite ? 'ice-lite' : undefined;
		        for (const mediaSection of this._mediaSections) {
		            mediaSection.setIceParameters(iceParameters);
		        }
		    }
		    updateDtlsRole(role) {
		        logger.debug('updateDtlsRole() [role:%s]', role);
		        this._dtlsParameters.role = role;
		        for (const mediaSection of this._mediaSections) {
		            mediaSection.setDtlsRole(role);
		        }
		    }
		    /**
		     * Set session level a=extmap-allow-mixed attibute.
		     */
		    setSessionExtmapAllowMixed() {
		        logger.debug('setSessionExtmapAllowMixed()');
		        this._sdpObject.extmapAllowMixed = 'extmap-allow-mixed';
		    }
		    getNextMediaSectionIdx() {
		        // If a closed media section is found, return its index.
		        for (let idx = 0; idx < this._mediaSections.length; ++idx) {
		            const mediaSection = this._mediaSections[idx];
		            if (mediaSection.closed) {
		                return { idx, reuseMid: mediaSection.mid };
		            }
		        }
		        // If no closed media section is found, return next one.
		        return { idx: this._mediaSections.length };
		    }
		    send({ offerMediaObject, reuseMid, offerRtpParameters, answerRtpParameters, codecOptions, }) {
		        const mediaSection = new MediaSection_1.AnswerMediaSection({
		            iceParameters: this._iceParameters,
		            iceCandidates: this._iceCandidates,
		            dtlsParameters: this._dtlsParameters,
		            plainRtpParameters: this._plainRtpParameters,
		            planB: this._planB,
		            offerMediaObject,
		            offerRtpParameters,
		            answerRtpParameters,
		            codecOptions,
		        });
		        const mediaObject = mediaSection.getObject();
		        // Remove Dependency Descriptor extension unless there is support for
		        // the codec in mediasoup.
		        // @ts-expect-error --- mediaObject type is 'any'.
		        const ddCodec = mediaObject.rtp.find((rtp) => DD_CODECS.includes(rtp.codec.toLowerCase()));
		        if (!ddCodec) {
		            // @ts-expect-error --- mediaObject type is 'any'.
		            mediaObject.ext = mediaObject.ext.filter((extmap) => extmap.uri !==
		                'https://aomediacodec.github.io/av1-rtp-spec/#dependency-descriptor-rtp-header-extension');
		        }
		        // Unified-Plan with closed media section replacement.
		        if (reuseMid) {
		            this._replaceMediaSection(mediaSection, reuseMid);
		        }
		        // Unified-Plan or Plan-B with different media kind.
		        else if (!this._midToIndex.has(mediaSection.mid)) {
		            this._addMediaSection(mediaSection);
		        }
		        // Plan-B with same media kind.
		        else {
		            this._replaceMediaSection(mediaSection);
		        }
		    }
		    receive({ mid, kind, offerRtpParameters, streamId, trackId, }) {
		        const idx = this._midToIndex.get(mid);
		        let mediaSection;
		        if (idx !== undefined) {
		            mediaSection = this._mediaSections[idx];
		        }
		        // Allow both 1 byte and 2 bytes length header extensions since
		        // mediasoup can send both at any time.
		        this.setSessionExtmapAllowMixed();
		        // Unified-Plan or different media kind.
		        if (!mediaSection) {
		            mediaSection = new MediaSection_1.OfferMediaSection({
		                iceParameters: this._iceParameters,
		                iceCandidates: this._iceCandidates,
		                dtlsParameters: this._dtlsParameters,
		                plainRtpParameters: this._plainRtpParameters,
		                planB: this._planB,
		                mid,
		                kind,
		                offerRtpParameters,
		                streamId,
		                trackId,
		            });
		            // Let's try to recycle a closed media section (if any).
		            // NOTE: Yes, we can recycle a closed m=audio section with a new m=video.
		            const oldMediaSection = this._mediaSections.find(m => m.closed);
		            if (oldMediaSection) {
		                this._replaceMediaSection(mediaSection, oldMediaSection.mid);
		            }
		            else {
		                this._addMediaSection(mediaSection);
		            }
		        }
		        // Plan-B.
		        else {
		            mediaSection.planBReceive({ offerRtpParameters, streamId, trackId });
		            this._replaceMediaSection(mediaSection);
		        }
		    }
		    pauseMediaSection(mid) {
		        const mediaSection = this._findMediaSection(mid);
		        mediaSection.pause();
		    }
		    resumeSendingMediaSection(mid) {
		        const mediaSection = this._findMediaSection(mid);
		        mediaSection.resume();
		    }
		    resumeReceivingMediaSection(mid) {
		        const mediaSection = this._findMediaSection(mid);
		        mediaSection.resume();
		    }
		    disableMediaSection(mid) {
		        const mediaSection = this._findMediaSection(mid);
		        mediaSection.disable();
		    }
		    /**
		     * Closes media section. Returns true if the given MID corresponds to a m
		     * section that has been indeed closed. False otherwise.
		     *
		     * NOTE: Closing the first m section is a pain since it invalidates the bundled
		     * transport, so instead closing it we just disable it.
		     */
		    closeMediaSection(mid) {
		        const mediaSection = this._findMediaSection(mid);
		        // NOTE: Closing the first m section is a pain since it invalidates the
		        // bundled transport, so let's avoid it.
		        if (mid === this._firstMid) {
		            logger.debug('closeMediaSection() | cannot close first media section, disabling it instead [mid:%s]', mid);
		            this.disableMediaSection(mid);
		            return false;
		        }
		        mediaSection.close();
		        // Regenerate BUNDLE mids.
		        this._regenerateBundleMids();
		        return true;
		    }
		    muxMediaSectionSimulcast(mid, encodings) {
		        const mediaSection = this._findMediaSection(mid);
		        mediaSection.muxSimulcastStreams(encodings);
		        this._replaceMediaSection(mediaSection);
		    }
		    planBStopReceiving({ mid, offerRtpParameters, }) {
		        const mediaSection = this._findMediaSection(mid);
		        mediaSection.planBStopReceiving({ offerRtpParameters });
		        this._replaceMediaSection(mediaSection);
		    }
		    sendSctpAssociation({ offerMediaObject }) {
		        const mediaSection = new MediaSection_1.AnswerMediaSection({
		            iceParameters: this._iceParameters,
		            iceCandidates: this._iceCandidates,
		            dtlsParameters: this._dtlsParameters,
		            sctpParameters: this._sctpParameters,
		            plainRtpParameters: this._plainRtpParameters,
		            offerMediaObject,
		        });
		        this._addMediaSection(mediaSection);
		    }
		    receiveSctpAssociation({ oldDataChannelSpec = false, } = {}) {
		        const mediaSection = new MediaSection_1.OfferMediaSection({
		            iceParameters: this._iceParameters,
		            iceCandidates: this._iceCandidates,
		            dtlsParameters: this._dtlsParameters,
		            sctpParameters: this._sctpParameters,
		            plainRtpParameters: this._plainRtpParameters,
		            mid: 'datachannel',
		            kind: 'application',
		            oldDataChannelSpec,
		        });
		        this._addMediaSection(mediaSection);
		    }
		    getSdp() {
		        // Increase SDP version.
		        this._sdpObject.origin.sessionVersion++;
		        return sdpTransform.write(this._sdpObject);
		    }
		    _addMediaSection(newMediaSection) {
		        if (!this._firstMid) {
		            this._firstMid = newMediaSection.mid;
		        }
		        // Add to the vector.
		        this._mediaSections.push(newMediaSection);
		        // Add to the map.
		        this._midToIndex.set(newMediaSection.mid, this._mediaSections.length - 1);
		        // Add to the SDP object.
		        this._sdpObject.media.push(newMediaSection.getObject());
		        // Regenerate BUNDLE mids.
		        this._regenerateBundleMids();
		    }
		    _replaceMediaSection(newMediaSection, reuseMid) {
		        // Store it in the map.
		        if (typeof reuseMid === 'string') {
		            const idx = this._midToIndex.get(reuseMid);
		            if (idx === undefined) {
		                throw new Error(`no media section found for reuseMid '${reuseMid}'`);
		            }
		            const oldMediaSection = this._mediaSections[idx];
		            // Replace the index in the vector with the new media section.
		            this._mediaSections[idx] = newMediaSection;
		            // Update the map.
		            this._midToIndex.delete(oldMediaSection.mid);
		            this._midToIndex.set(newMediaSection.mid, idx);
		            // Update the SDP object.
		            this._sdpObject.media[idx] = newMediaSection.getObject();
		            // Regenerate BUNDLE mids.
		            this._regenerateBundleMids();
		        }
		        else {
		            const idx = this._midToIndex.get(newMediaSection.mid);
		            if (idx === undefined) {
		                throw new Error(`no media section found with mid '${newMediaSection.mid}'`);
		            }
		            // Replace the index in the vector with the new media section.
		            this._mediaSections[idx] = newMediaSection;
		            // Update the SDP object.
		            this._sdpObject.media[idx] = newMediaSection.getObject();
		        }
		    }
		    _findMediaSection(mid) {
		        const idx = this._midToIndex.get(mid);
		        if (idx === undefined) {
		            throw new Error(`no media section found with mid '${mid}'`);
		        }
		        return this._mediaSections[idx];
		    }
		    _regenerateBundleMids() {
		        if (!this._dtlsParameters) {
		            return;
		        }
		        this._sdpObject.groups[0].mids = this._mediaSections
		            .filter((mediaSection) => !mediaSection.closed)
		            .map((mediaSection) => mediaSection.mid)
		            .join(' ');
		    }
		};
		RemoteSdp.RemoteSdp = RemoteSdp$1;
		return RemoteSdp;
	}

	var scalabilityModes = {};

	var hasRequiredScalabilityModes;

	function requireScalabilityModes () {
		if (hasRequiredScalabilityModes) return scalabilityModes;
		hasRequiredScalabilityModes = 1;
		Object.defineProperty(scalabilityModes, "__esModule", { value: true });
		scalabilityModes.parse = parse;
		const ScalabilityModeRegex = new RegExp('^[LS]([1-9]\\d{0,1})T([1-9]\\d{0,1})');
		function parse(scalabilityMode) {
		    const match = ScalabilityModeRegex.exec(scalabilityMode ?? '');
		    if (match) {
		        return {
		            spatialLayers: Number(match[1]),
		            temporalLayers: Number(match[2]),
		        };
		    }
		    else {
		        return {
		            spatialLayers: 1,
		            temporalLayers: 1,
		        };
		    }
		}
		return scalabilityModes;
	}

	var hasRequiredChrome111;

	function requireChrome111 () {
		if (hasRequiredChrome111) return Chrome111;
		hasRequiredChrome111 = 1;
		Object.defineProperty(Chrome111, "__esModule", { value: true });
		Chrome111.Chrome111 = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpUnifiedPlanUtils = requireUnifiedPlanUtils();
		const ortcUtils = requireUtils$1();
		const errors_1 = requireErrors$1();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const scalabilityModes_1 = requireScalabilityModes();
		const logger = new Logger_1.Logger('Chrome111');
		const NAME = 'Chrome111';
		const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };
		let Chrome111$1 = class Chrome111 extends HandlerInterface_1.HandlerInterface {
		    // Closed flag.
		    _closed = false;
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // Initial server side DTLS role. If not 'auto', it will force the opposite
		    // value in client side.
		    _forcedLocalDtlsRole;
		    // RTCPeerConnection instance.
		    _pc;
		    // Map of RTCTransceivers indexed by MID.
		    _mapMidTransceiver = new Map();
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new Chrome111();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        if (this._closed) {
		            return;
		        }
		        this._closed = true;
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'unified-plan',
		        });
		        try {
		            pc.addTransceiver('audio');
		            // Create video transceiver with scalability mode in order to retrieve
		            // Dependency Descriptor header extension.
		            pc.addTransceiver('video', {
		                sendEncodings: [{ scalabilityMode: 'L3T3' }],
		            });
		            const offer = await pc.createOffer();
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            // libwebrtc supports NACK for OPUS but doesn't announce it.
		            ortcUtils.addNackSupportForOpus(nativeRtpCapabilities);
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        this.assertNotClosed();
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        if (dtlsParameters.role && dtlsParameters.role !== 'auto') {
		            this._forcedLocalDtlsRole =
		                dtlsParameters.role === 'server' ? 'client' : 'server';
		        }
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'unified-plan',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    async updateIceServers(iceServers) {
		        this.assertNotClosed();
		        logger.debug('updateIceServers()');
		        const configuration = this._pc.getConfiguration();
		        configuration.iceServers = iceServers;
		        this._pc.setConfiguration(configuration);
		    }
		    async restartIce(iceParameters) {
		        this.assertNotClosed();
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        this.assertNotClosed();
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, onRtpSender, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (encodings && encodings.length > 1) {
		            // Set rid and verify scalabilityMode in each encoding.
		            // NOTE: Even if WebRTC allows different scalabilityMode (different number
		            // of temporal layers) per simulcast stream, we need that those are the
		            // same in all them, so let's pick up the highest value.
		            // NOTE: If scalabilityMode is not given, Chrome will use L1T3.
		            let maxTemporalLayers = 1;
		            for (const encoding of encodings) {
		                const temporalLayers = encoding.scalabilityMode
		                    ? (0, scalabilityModes_1.parse)(encoding.scalabilityMode).temporalLayers
		                    : 3;
		                if (temporalLayers > maxTemporalLayers) {
		                    maxTemporalLayers = temporalLayers;
		                }
		            }
		            encodings.forEach((encoding, idx) => {
		                encoding.rid = `r${idx}`;
		                encoding.scalabilityMode = `L1T${maxTemporalLayers}`;
		            });
		        }
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec);
		        const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();
		        const transceiver = this._pc.addTransceiver(track, {
		            direction: 'sendonly',
		            streams: [this._sendStream],
		            sendEncodings: encodings,
		        });
		        if (onRtpSender) {
		            onRtpSender(transceiver.sender);
		        }
		        const offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        // We can now get the transceiver.mid.
		        const localId = transceiver.mid;
		        // Set MID.
		        sendingRtpParameters.mid = localId;
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        const offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings by parsing the SDP offer if no encodings are given.
		        if (!encodings) {
		            sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
		                offerMediaObject,
		            });
		        }
		        // Set RTP encodings by parsing the SDP offer and complete them with given
		        // one if just a single encoding has been given.
		        else if (encodings.length === 1) {
		            const newEncodings = sdpUnifiedPlanUtils.getRtpEncodings({
		                offerMediaObject,
		            });
		            Object.assign(newEncodings[0], encodings[0]);
		            sendingRtpParameters.encodings = newEncodings;
		        }
		        // Otherwise if more than 1 encoding are given use them verbatim.
		        else {
		            sendingRtpParameters.encodings = encodings;
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            reuseMid: mediaSectionIdx.reuseMid,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        // Store in the map.
		        this._mapMidTransceiver.set(localId, transceiver);
		        return {
		            localId,
		            rtpParameters: sendingRtpParameters,
		            rtpSender: transceiver.sender,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        logger.debug('stopSending() [localId:%s]', localId);
		        if (this._closed) {
		            return;
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        void transceiver.sender.replaceTrack(null);
		        this._pc.removeTrack(transceiver.sender);
		        const mediaSectionClosed = this._remoteSdp.closeMediaSection(transceiver.mid);
		        if (mediaSectionClosed) {
		            try {
		                transceiver.stop();
		            }
		            catch (error) { }
		        }
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        this._mapMidTransceiver.delete(localId);
		    }
		    async pauseSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('pauseSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'inactive';
		        this._remoteSdp.pauseMediaSection(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('pauseSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async resumeSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('resumeSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        this._remoteSdp.resumeSendingMediaSection(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'sendonly';
		        const offer = await this._pc.createOffer();
		        logger.debug('resumeSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async replaceTrack(localId, track) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        await transceiver.sender.replaceTrack(track);
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            if (idx <= spatialLayer) {
		                encoding.active = true;
		            }
		            else {
		                encoding.active = false;
		            }
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setMaxSpatialLayer() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setMaxSpatialLayer() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            parameters.encodings[idx] = { ...encoding, ...params };
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setRtpEncodingParameters() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setRtpEncodingParameters() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async getSenderStats(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.sender.getStats();
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const results = [];
		        const mapLocalId = new Map();
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters, streamId } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const localId = rtpParameters.mid ?? String(this._mapMidTransceiver.size);
		            mapLocalId.set(trackId, localId);
		            this._remoteSdp.receive({
		                mid: localId,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId: streamId ?? rtpParameters.rtcp.cname,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        for (const options of optionsList) {
		            const { trackId, onRtpReceiver } = options;
		            if (onRtpReceiver) {
		                const localId = mapLocalId.get(trackId);
		                const transceiver = this._pc
		                    .getTransceivers()
		                    .find((t) => t.mid === localId);
		                if (!transceiver) {
		                    throw new Error('transceiver not found');
		                }
		                onRtpReceiver(transceiver.receiver);
		            }
		        }
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { trackId, rtpParameters } = options;
		            const localId = mapLocalId.get(trackId);
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === localId);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		        }
		        answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { trackId } = options;
		            const localId = mapLocalId.get(trackId);
		            const transceiver = this._pc
		                .getTransceivers()
		                .find((t) => t.mid === localId);
		            if (!transceiver) {
		                throw new Error('new RTCRtpTransceiver not found');
		            }
		            else {
		                // Store in the map.
		                this._mapMidTransceiver.set(localId, transceiver);
		                results.push({
		                    localId,
		                    track: transceiver.receiver.track,
		                    rtpReceiver: transceiver.receiver,
		                });
		            }
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        if (this._closed) {
		            return;
		        }
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            this._remoteSdp.closeMediaSection(transceiver.mid);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const localId of localIds) {
		            this._mapMidTransceiver.delete(localId);
		        }
		    }
		    async pauseReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('pauseReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'inactive';
		            this._remoteSdp.pauseMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('pauseReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async resumeReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('resumeReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'recvonly';
		            this._remoteSdp.resumeReceivingMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('resumeReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async getReceiverStats(localId) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.receiver.getStats();
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits, } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation();
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertNotClosed() {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('method called in a closed handler');
		        }
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		Chrome111.Chrome111 = Chrome111$1;
		return Chrome111;
	}

	var Chrome74 = {};

	var hasRequiredChrome74;

	function requireChrome74 () {
		if (hasRequiredChrome74) return Chrome74;
		hasRequiredChrome74 = 1;
		Object.defineProperty(Chrome74, "__esModule", { value: true });
		Chrome74.Chrome74 = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpUnifiedPlanUtils = requireUnifiedPlanUtils();
		const ortcUtils = requireUtils$1();
		const errors_1 = requireErrors$1();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const scalabilityModes_1 = requireScalabilityModes();
		const logger = new Logger_1.Logger('Chrome74');
		const NAME = 'Chrome74';
		const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };
		let Chrome74$1 = class Chrome74 extends HandlerInterface_1.HandlerInterface {
		    // Closed flag.
		    _closed = false;
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // Initial server side DTLS role. If not 'auto', it will force the opposite
		    // value in client side.
		    _forcedLocalDtlsRole;
		    // RTCPeerConnection instance.
		    _pc;
		    // Map of RTCTransceivers indexed by MID.
		    _mapMidTransceiver = new Map();
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new Chrome74();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        if (this._closed) {
		            return;
		        }
		        this._closed = true;
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'unified-plan',
		        });
		        try {
		            pc.addTransceiver('audio');
		            pc.addTransceiver('video');
		            const offer = await pc.createOffer();
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            // libwebrtc supports NACK for OPUS but doesn't announce it.
		            ortcUtils.addNackSupportForOpus(nativeRtpCapabilities);
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        if (dtlsParameters.role && dtlsParameters.role !== 'auto') {
		            this._forcedLocalDtlsRole =
		                dtlsParameters.role === 'server' ? 'client' : 'server';
		        }
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'unified-plan',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    async updateIceServers(iceServers) {
		        this.assertNotClosed();
		        logger.debug('updateIceServers()');
		        const configuration = this._pc.getConfiguration();
		        configuration.iceServers = iceServers;
		        this._pc.setConfiguration(configuration);
		    }
		    async restartIce(iceParameters) {
		        this.assertNotClosed();
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        this.assertNotClosed();
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (encodings && encodings.length > 1) {
		            encodings.forEach((encoding, idx) => {
		                encoding.rid = `r${idx}`;
		            });
		        }
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec);
		        const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();
		        const transceiver = this._pc.addTransceiver(track, {
		            direction: 'sendonly',
		            streams: [this._sendStream],
		            sendEncodings: encodings,
		        });
		        let offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        let offerMediaObject;
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        // Special case for VP9 with SVC.
		        let hackVp9Svc = false;
		        const layers = (0, scalabilityModes_1.parse)((encodings ?? [{}])[0].scalabilityMode);
		        if (encodings &&
		            encodings.length === 1 &&
		            layers.spatialLayers > 1 &&
		            sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp9') {
		            logger.debug('send() | enabling legacy simulcast for VP9 SVC');
		            hackVp9Svc = true;
		            localSdpObject = sdpTransform.parse(offer.sdp);
		            offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
		            sdpUnifiedPlanUtils.addLegacySimulcast({
		                offerMediaObject,
		                numStreams: layers.spatialLayers,
		            });
		            offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        // We can now get the transceiver.mid.
		        const localId = transceiver.mid;
		        // Set MID.
		        sendingRtpParameters.mid = localId;
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings by parsing the SDP offer if no encodings are given.
		        if (!encodings) {
		            sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
		                offerMediaObject,
		            });
		        }
		        // Set RTP encodings by parsing the SDP offer and complete them with given
		        // one if just a single encoding has been given.
		        else if (encodings.length === 1) {
		            let newEncodings = sdpUnifiedPlanUtils.getRtpEncodings({
		                offerMediaObject,
		            });
		            Object.assign(newEncodings[0], encodings[0]);
		            // Hack for VP9 SVC.
		            if (hackVp9Svc) {
		                newEncodings = [newEncodings[0]];
		            }
		            sendingRtpParameters.encodings = newEncodings;
		        }
		        // Otherwise if more than 1 encoding are given use them verbatim.
		        else {
		            sendingRtpParameters.encodings = encodings;
		        }
		        // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		        // each encoding.
		        if (sendingRtpParameters.encodings.length > 1 &&
		            (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
		                sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
		            for (const encoding of sendingRtpParameters.encodings) {
		                if (encoding.scalabilityMode) {
		                    encoding.scalabilityMode = `L1T${layers.temporalLayers}`;
		                }
		                else {
		                    encoding.scalabilityMode = 'L1T3';
		                }
		            }
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            reuseMid: mediaSectionIdx.reuseMid,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        // Store in the map.
		        this._mapMidTransceiver.set(localId, transceiver);
		        return {
		            localId,
		            rtpParameters: sendingRtpParameters,
		            rtpSender: transceiver.sender,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        logger.debug('stopSending() [localId:%s]', localId);
		        if (this._closed) {
		            return;
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        void transceiver.sender.replaceTrack(null);
		        this._pc.removeTrack(transceiver.sender);
		        const mediaSectionClosed = this._remoteSdp.closeMediaSection(transceiver.mid);
		        if (mediaSectionClosed) {
		            try {
		                transceiver.stop();
		            }
		            catch (error) { }
		        }
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        this._mapMidTransceiver.delete(localId);
		    }
		    async pauseSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('pauseSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'inactive';
		        this._remoteSdp.pauseMediaSection(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('pauseSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async resumeSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('resumeSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        this._remoteSdp.resumeSendingMediaSection(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'sendonly';
		        const offer = await this._pc.createOffer();
		        logger.debug('resumeSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async replaceTrack(localId, track) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        await transceiver.sender.replaceTrack(track);
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            if (idx <= spatialLayer) {
		                encoding.active = true;
		            }
		            else {
		                encoding.active = false;
		            }
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setMaxSpatialLayer() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setMaxSpatialLayer() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            parameters.encodings[idx] = { ...encoding, ...params };
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setRtpEncodingParameters() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setRtpEncodingParameters() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async getSenderStats(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.sender.getStats();
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const results = [];
		        const mapLocalId = new Map();
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters, streamId } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const localId = rtpParameters.mid ?? String(this._mapMidTransceiver.size);
		            mapLocalId.set(trackId, localId);
		            this._remoteSdp.receive({
		                mid: localId,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId: streamId ?? rtpParameters.rtcp.cname,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { trackId, rtpParameters } = options;
		            const localId = mapLocalId.get(trackId);
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === localId);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		        }
		        answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { trackId } = options;
		            const localId = mapLocalId.get(trackId);
		            const transceiver = this._pc
		                .getTransceivers()
		                .find((t) => t.mid === localId);
		            if (!transceiver) {
		                throw new Error('new RTCRtpTransceiver not found');
		            }
		            else {
		                // Store in the map.
		                this._mapMidTransceiver.set(localId, transceiver);
		                results.push({
		                    localId,
		                    track: transceiver.receiver.track,
		                    rtpReceiver: transceiver.receiver,
		                });
		            }
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        if (this._closed) {
		            return;
		        }
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            this._remoteSdp.closeMediaSection(transceiver.mid);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const localId of localIds) {
		            this._mapMidTransceiver.delete(localId);
		        }
		    }
		    async pauseReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('pauseReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'inactive';
		            this._remoteSdp.pauseMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('pauseReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async resumeReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('resumeReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'recvonly';
		            this._remoteSdp.resumeReceivingMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('resumeReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async getReceiverStats(localId) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.receiver.getStats();
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits, } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation();
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertNotClosed() {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('method called in a closed handler');
		        }
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		Chrome74.Chrome74 = Chrome74$1;
		return Chrome74;
	}

	var Chrome70 = {};

	var hasRequiredChrome70;

	function requireChrome70 () {
		if (hasRequiredChrome70) return Chrome70;
		hasRequiredChrome70 = 1;
		Object.defineProperty(Chrome70, "__esModule", { value: true });
		Chrome70.Chrome70 = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpUnifiedPlanUtils = requireUnifiedPlanUtils();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const scalabilityModes_1 = requireScalabilityModes();
		const logger = new Logger_1.Logger('Chrome70');
		const NAME = 'Chrome70';
		const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };
		let Chrome70$1 = class Chrome70 extends HandlerInterface_1.HandlerInterface {
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // Initial server side DTLS role. If not 'auto', it will force the opposite
		    // value in client side.
		    _forcedLocalDtlsRole;
		    // RTCPeerConnection instance.
		    _pc;
		    // Map of RTCTransceivers indexed by MID.
		    _mapMidTransceiver = new Map();
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new Chrome70();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'unified-plan',
		        });
		        try {
		            pc.addTransceiver('audio');
		            pc.addTransceiver('video');
		            const offer = await pc.createOffer();
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        if (dtlsParameters.role && dtlsParameters.role !== 'auto') {
		            this._forcedLocalDtlsRole =
		                dtlsParameters.role === 'server' ? 'client' : 'server';
		        }
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'unified-plan',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    async updateIceServers(iceServers) {
		        logger.debug('updateIceServers()');
		        const configuration = this._pc.getConfiguration();
		        configuration.iceServers = iceServers;
		        this._pc.setConfiguration(configuration);
		    }
		    async restartIce(iceParameters) {
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, }) {
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec);
		        const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();
		        const transceiver = this._pc.addTransceiver(track, {
		            direction: 'sendonly',
		            streams: [this._sendStream],
		        });
		        let offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        let offerMediaObject;
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        if (encodings && encodings.length > 1) {
		            logger.debug('send() | enabling legacy simulcast');
		            localSdpObject = sdpTransform.parse(offer.sdp);
		            offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
		            sdpUnifiedPlanUtils.addLegacySimulcast({
		                offerMediaObject,
		                numStreams: encodings.length,
		            });
		            offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        // Special case for VP9 with SVC.
		        let hackVp9Svc = false;
		        const layers = (0, scalabilityModes_1.parse)((encodings ?? [{}])[0].scalabilityMode);
		        if (encodings &&
		            encodings.length === 1 &&
		            layers.spatialLayers > 1 &&
		            sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp9') {
		            logger.debug('send() | enabling legacy simulcast for VP9 SVC');
		            hackVp9Svc = true;
		            localSdpObject = sdpTransform.parse(offer.sdp);
		            offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
		            sdpUnifiedPlanUtils.addLegacySimulcast({
		                offerMediaObject,
		                numStreams: layers.spatialLayers,
		            });
		            offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        // If encodings are given, apply them now.
		        if (encodings) {
		            logger.debug('send() | applying given encodings');
		            const parameters = transceiver.sender.getParameters();
		            for (let idx = 0; idx < (parameters.encodings ?? []).length; ++idx) {
		                const encoding = parameters.encodings[idx];
		                const desiredEncoding = encodings[idx];
		                // Should not happen but just in case.
		                if (!desiredEncoding) {
		                    break;
		                }
		                parameters.encodings[idx] = Object.assign(encoding, desiredEncoding);
		            }
		            await transceiver.sender.setParameters(parameters);
		        }
		        // We can now get the transceiver.mid.
		        const localId = transceiver.mid;
		        // Set MID.
		        sendingRtpParameters.mid = localId;
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings.
		        sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
		            offerMediaObject,
		        });
		        // Complete encodings with given values.
		        if (encodings) {
		            for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
		                if (encodings[idx]) {
		                    Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
		                }
		            }
		        }
		        // Hack for VP9 SVC.
		        if (hackVp9Svc) {
		            sendingRtpParameters.encodings = [sendingRtpParameters.encodings[0]];
		        }
		        // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		        // each encoding.
		        if (sendingRtpParameters.encodings.length > 1 &&
		            (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
		                sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
		            for (const encoding of sendingRtpParameters.encodings) {
		                encoding.scalabilityMode = 'L1T3';
		            }
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            reuseMid: mediaSectionIdx.reuseMid,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        // Store in the map.
		        this._mapMidTransceiver.set(localId, transceiver);
		        return {
		            localId,
		            rtpParameters: sendingRtpParameters,
		            rtpSender: transceiver.sender,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        logger.debug('stopSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        void transceiver.sender.replaceTrack(null);
		        this._pc.removeTrack(transceiver.sender);
		        const mediaSectionClosed = this._remoteSdp.closeMediaSection(transceiver.mid);
		        if (mediaSectionClosed) {
		            try {
		                transceiver.stop();
		            }
		            catch (error) { }
		        }
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        this._mapMidTransceiver.delete(localId);
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async pauseSending(localId) {
		        // Unimplemented.
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async resumeSending(localId) {
		        // Unimplemented.
		    }
		    async replaceTrack(localId, track) {
		        this.assertSendDirection();
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        await transceiver.sender.replaceTrack(track);
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        this.assertSendDirection();
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            if (idx <= spatialLayer) {
		                encoding.active = true;
		            }
		            else {
		                encoding.active = false;
		            }
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setMaxSpatialLayer() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setMaxSpatialLayer() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        this.assertSendDirection();
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            parameters.encodings[idx] = { ...encoding, ...params };
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setRtpEncodingParameters() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setRtpEncodingParameters() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async getSenderStats(localId) {
		        this.assertSendDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.sender.getStats();
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmitTime: maxPacketLifeTime, // NOTE: Old spec.
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertRecvDirection();
		        const results = [];
		        const mapLocalId = new Map();
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters, streamId } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const localId = rtpParameters.mid ?? String(this._mapMidTransceiver.size);
		            mapLocalId.set(trackId, localId);
		            this._remoteSdp.receive({
		                mid: localId,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId: streamId ?? rtpParameters.rtcp.cname,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { trackId, rtpParameters } = options;
		            const localId = mapLocalId.get(trackId);
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === localId);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		        }
		        answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { trackId } = options;
		            const localId = mapLocalId.get(trackId);
		            const transceiver = this._pc
		                .getTransceivers()
		                .find((t) => t.mid === localId);
		            if (!transceiver) {
		                throw new Error('new RTCRtpTransceiver not found');
		            }
		            // Store in the map.
		            this._mapMidTransceiver.set(localId, transceiver);
		            results.push({
		                localId,
		                track: transceiver.receiver.track,
		                rtpReceiver: transceiver.receiver,
		            });
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            this._remoteSdp.closeMediaSection(transceiver.mid);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const localId of localIds) {
		            this._mapMidTransceiver.delete(localId);
		        }
		    }
		    async pauseReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    async resumeReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    async getReceiverStats(localId) {
		        this.assertRecvDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.receiver.getStats();
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits, } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmitTime: maxPacketLifeTime, // NOTE: Old spec.
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation();
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		Chrome70.Chrome70 = Chrome70$1;
		return Chrome70;
	}

	var Chrome67 = {};

	var planBUtils = {};

	var hasRequiredPlanBUtils;

	function requirePlanBUtils () {
		if (hasRequiredPlanBUtils) return planBUtils;
		hasRequiredPlanBUtils = 1;
		Object.defineProperty(planBUtils, "__esModule", { value: true });
		planBUtils.getRtpEncodings = getRtpEncodings;
		planBUtils.addLegacySimulcast = addLegacySimulcast;
		function getRtpEncodings({ offerMediaObject, track, }) {
		    const ssrcs = new Set();
		    for (const line of offerMediaObject.ssrcs ?? []) {
		        if (line.attribute !== 'msid') {
		            continue;
		        }
		        const trackId = line.value.split(' ')[1];
		        if (trackId === track.id) {
		            const ssrc = line.id;
		            ssrcs.add(ssrc);
		        }
		    }
		    if (ssrcs.size === 0) {
		        throw new Error(`a=ssrc line with msid information not found [track.id:${track.id}]`);
		    }
		    const ssrcToRtxSsrc = new Map();
		    // First assume RTX is used.
		    for (const line of offerMediaObject.ssrcGroups ?? []) {
		        if (line.semantics !== 'FID') {
		            continue;
		        }
		        let [ssrc, rtxSsrc] = line.ssrcs.split(/\s+/);
		        ssrc = Number(ssrc);
		        rtxSsrc = Number(rtxSsrc);
		        if (ssrcs.has(ssrc)) {
		            // Remove both the SSRC and RTX SSRC from the set so later we know that they
		            // are already handled.
		            ssrcs.delete(ssrc);
		            ssrcs.delete(rtxSsrc);
		            // Add to the map.
		            ssrcToRtxSsrc.set(ssrc, rtxSsrc);
		        }
		    }
		    // If the set of SSRCs is not empty it means that RTX is not being used, so take
		    // media SSRCs from there.
		    for (const ssrc of ssrcs) {
		        // Add to the map.
		        ssrcToRtxSsrc.set(ssrc, null);
		    }
		    const encodings = [];
		    for (const [ssrc, rtxSsrc] of ssrcToRtxSsrc) {
		        const encoding = { ssrc };
		        if (rtxSsrc) {
		            encoding.rtx = { ssrc: rtxSsrc };
		        }
		        encodings.push(encoding);
		    }
		    return encodings;
		}
		/**
		 * Adds multi-ssrc based simulcast into the given SDP media section offer.
		 */
		function addLegacySimulcast({ offerMediaObject, track, numStreams, }) {
		    if (numStreams <= 1) {
		        throw new TypeError('numStreams must be greater than 1');
		    }
		    let firstSsrc;
		    let firstRtxSsrc;
		    let streamId;
		    // Get the SSRC.
		    const ssrcMsidLine = (offerMediaObject.ssrcs ?? []).find((line) => {
		        if (line.attribute !== 'msid') {
		            return false;
		        }
		        const trackId = line.value.split(' ')[1];
		        if (trackId === track.id) {
		            firstSsrc = line.id;
		            streamId = line.value.split(' ')[0];
		            return true;
		        }
		        else {
		            return false;
		        }
		    });
		    if (!ssrcMsidLine) {
		        throw new Error(`a=ssrc line with msid information not found [track.id:${track.id}]`);
		    }
		    // Get the SSRC for RTX.
		    (offerMediaObject.ssrcGroups ?? []).some((line) => {
		        if (line.semantics !== 'FID') {
		            return false;
		        }
		        const ssrcs = line.ssrcs.split(/\s+/);
		        if (Number(ssrcs[0]) === firstSsrc) {
		            firstRtxSsrc = Number(ssrcs[1]);
		            return true;
		        }
		        else {
		            return false;
		        }
		    });
		    const ssrcCnameLine = offerMediaObject.ssrcs.find((line) => line.attribute === 'cname' && line.id === firstSsrc);
		    if (!ssrcCnameLine) {
		        throw new Error(`a=ssrc line with cname information not found [track.id:${track.id}]`);
		    }
		    const cname = ssrcCnameLine.value;
		    const ssrcs = [];
		    const rtxSsrcs = [];
		    for (let i = 0; i < numStreams; ++i) {
		        ssrcs.push(firstSsrc + i);
		        if (firstRtxSsrc) {
		            rtxSsrcs.push(firstRtxSsrc + i);
		        }
		    }
		    offerMediaObject.ssrcGroups = offerMediaObject.ssrcGroups ?? [];
		    offerMediaObject.ssrcs = offerMediaObject.ssrcs ?? [];
		    offerMediaObject.ssrcGroups.push({
		        semantics: 'SIM',
		        ssrcs: ssrcs.join(' '),
		    });
		    for (const ssrc of ssrcs) {
		        offerMediaObject.ssrcs.push({
		            id: ssrc,
		            attribute: 'cname',
		            value: cname,
		        });
		        offerMediaObject.ssrcs.push({
		            id: ssrc,
		            attribute: 'msid',
		            value: `${streamId} ${track.id}`,
		        });
		    }
		    for (let i = 0; i < rtxSsrcs.length; ++i) {
		        const ssrc = ssrcs[i];
		        const rtxSsrc = rtxSsrcs[i];
		        offerMediaObject.ssrcs.push({
		            id: rtxSsrc,
		            attribute: 'cname',
		            value: cname,
		        });
		        offerMediaObject.ssrcs.push({
		            id: rtxSsrc,
		            attribute: 'msid',
		            value: `${streamId} ${track.id}`,
		        });
		        offerMediaObject.ssrcGroups.push({
		            semantics: 'FID',
		            ssrcs: `${ssrc} ${rtxSsrc}`,
		        });
		    }
		}
		return planBUtils;
	}

	var hasRequiredChrome67;

	function requireChrome67 () {
		if (hasRequiredChrome67) return Chrome67;
		hasRequiredChrome67 = 1;
		Object.defineProperty(Chrome67, "__esModule", { value: true });
		Chrome67.Chrome67 = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpPlanBUtils = requirePlanBUtils();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const logger = new Logger_1.Logger('Chrome67');
		const NAME = 'Chrome67';
		const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };
		let Chrome67$1 = class Chrome67 extends HandlerInterface_1.HandlerInterface {
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // Initial server side DTLS role. If not 'auto', it will force the opposite
		    // value in client side.
		    _forcedLocalDtlsRole;
		    // RTCPeerConnection instance.
		    _pc;
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Map of RTCRtpSender indexed by localId.
		    _mapSendLocalIdRtpSender = new Map();
		    // Next sending localId.
		    _nextSendLocalId = 0;
		    // Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
		    // Value is an Object with mid, rtpParameters and rtpReceiver.
		    _mapRecvLocalIdInfo = new Map();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new Chrome67();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'plan-b',
		        });
		        try {
		            const offer = await pc.createOffer({
		                offerToReceiveAudio: true,
		                offerToReceiveVideo: true,
		            });
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		            planB: true,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        if (dtlsParameters.role && dtlsParameters.role !== 'auto') {
		            this._forcedLocalDtlsRole =
		                dtlsParameters.role === 'server' ? 'client' : 'server';
		        }
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'plan-b',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    async updateIceServers(iceServers) {
		        logger.debug('updateIceServers()');
		        const configuration = this._pc.getConfiguration();
		        configuration.iceServers = iceServers;
		        this._pc.setConfiguration(configuration);
		    }
		    async restartIce(iceParameters) {
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, }) {
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (codec) {
		            logger.warn('send() | codec selection is not available in %s handler', this.name);
		        }
		        this._sendStream.addTrack(track);
		        this._pc.addTrack(track, this._sendStream);
		        let offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        let offerMediaObject;
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs);
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        if (track.kind === 'video' && encodings && encodings.length > 1) {
		            logger.debug('send() | enabling simulcast');
		            localSdpObject = sdpTransform.parse(offer.sdp);
		            offerMediaObject = localSdpObject.media.find((m) => m.type === 'video');
		            sdpPlanBUtils.addLegacySimulcast({
		                offerMediaObject,
		                track,
		                numStreams: encodings.length,
		            });
		            offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        offerMediaObject = localSdpObject.media.find((m) => m.type === track.kind);
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings.
		        sendingRtpParameters.encodings = sdpPlanBUtils.getRtpEncodings({
		            offerMediaObject,
		            track,
		        });
		        // Complete encodings with given values.
		        if (encodings) {
		            for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
		                if (encodings[idx]) {
		                    Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
		                }
		            }
		        }
		        // If VP8 and there is effective simulcast, add scalabilityMode to each
		        // encoding.
		        if (sendingRtpParameters.encodings.length > 1 &&
		            sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8') {
		            for (const encoding of sendingRtpParameters.encodings) {
		                encoding.scalabilityMode = 'L1T3';
		            }
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        const localId = String(this._nextSendLocalId);
		        this._nextSendLocalId++;
		        const rtpSender = this._pc
		            .getSenders()
		            .find((s) => s.track === track);
		        // Insert into the map.
		        this._mapSendLocalIdRtpSender.set(localId, rtpSender);
		        return {
		            localId: localId,
		            rtpParameters: sendingRtpParameters,
		            rtpSender,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        logger.debug('stopSending() [localId:%s]', localId);
		        const rtpSender = this._mapSendLocalIdRtpSender.get(localId);
		        if (!rtpSender) {
		            throw new Error('associated RTCRtpSender not found');
		        }
		        this._pc.removeTrack(rtpSender);
		        if (rtpSender.track) {
		            this._sendStream.removeTrack(rtpSender.track);
		        }
		        this._mapSendLocalIdRtpSender.delete(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        try {
		            await this._pc.setLocalDescription(offer);
		        }
		        catch (error) {
		            // NOTE: If there are no sending tracks, setLocalDescription() will fail with
		            // "Failed to create channels". If so, ignore it.
		            if (this._sendStream.getTracks().length === 0) {
		                logger.warn('stopSending() | ignoring expected error due no sending tracks: %s', error.toString());
		                return;
		            }
		            throw error;
		        }
		        if (this._pc.signalingState === 'stable') {
		            return;
		        }
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async pauseSending(localId) {
		        // Unimplemented.
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async resumeSending(localId) {
		        // Unimplemented.
		    }
		    async replaceTrack(localId, track) {
		        this.assertSendDirection();
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        const rtpSender = this._mapSendLocalIdRtpSender.get(localId);
		        if (!rtpSender) {
		            throw new Error('associated RTCRtpSender not found');
		        }
		        const oldTrack = rtpSender.track;
		        await rtpSender.replaceTrack(track);
		        // Remove the old track from the local stream.
		        if (oldTrack) {
		            this._sendStream.removeTrack(oldTrack);
		        }
		        // Add the new track to the local stream.
		        if (track) {
		            this._sendStream.addTrack(track);
		        }
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        this.assertSendDirection();
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		        const rtpSender = this._mapSendLocalIdRtpSender.get(localId);
		        if (!rtpSender) {
		            throw new Error('associated RTCRtpSender not found');
		        }
		        const parameters = rtpSender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            if (idx <= spatialLayer) {
		                encoding.active = true;
		            }
		            else {
		                encoding.active = false;
		            }
		        });
		        await rtpSender.setParameters(parameters);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        this.assertSendDirection();
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		        const rtpSender = this._mapSendLocalIdRtpSender.get(localId);
		        if (!rtpSender) {
		            throw new Error('associated RTCRtpSender not found');
		        }
		        const parameters = rtpSender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            parameters.encodings[idx] = { ...encoding, ...params };
		        });
		        await rtpSender.setParameters(parameters);
		    }
		    async getSenderStats(localId) {
		        this.assertSendDirection();
		        const rtpSender = this._mapSendLocalIdRtpSender.get(localId);
		        if (!rtpSender) {
		            throw new Error('associated RTCRtpSender not found');
		        }
		        return rtpSender.getStats();
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmitTime: maxPacketLifeTime, // NOTE: Old spec.
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertRecvDirection();
		        const results = [];
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters, streamId } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const mid = kind;
		            this._remoteSdp.receive({
		                mid,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId: streamId ?? rtpParameters.rtcp.cname,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { kind, rtpParameters } = options;
		            const mid = kind;
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === mid);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		        }
		        answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { kind, trackId, rtpParameters } = options;
		            const localId = trackId;
		            const mid = kind;
		            const rtpReceiver = this._pc
		                .getReceivers()
		                .find((r) => r.track && r.track.id === localId);
		            if (!rtpReceiver) {
		                throw new Error('new RTCRtpReceiver not');
		            }
		            // Insert into the map.
		            this._mapRecvLocalIdInfo.set(localId, {
		                mid,
		                rtpParameters,
		                rtpReceiver,
		            });
		            results.push({
		                localId,
		                track: rtpReceiver.track,
		                rtpReceiver,
		            });
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const { mid, rtpParameters } = this._mapRecvLocalIdInfo.get(localId) ?? {};
		            // Remove from the map.
		            this._mapRecvLocalIdInfo.delete(localId);
		            this._remoteSdp.planBStopReceiving({
		                mid: mid,
		                offerRtpParameters: rtpParameters,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async pauseReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    async resumeReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    async getReceiverStats(localId) {
		        this.assertRecvDirection();
		        const { rtpReceiver } = this._mapRecvLocalIdInfo.get(localId) ?? {};
		        if (!rtpReceiver) {
		            throw new Error('associated RTCRtpReceiver not found');
		        }
		        return rtpReceiver.getStats();
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmitTime: maxPacketLifeTime, // NOTE: Old spec.
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: true });
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		Chrome67.Chrome67 = Chrome67$1;
		return Chrome67;
	}

	var Chrome55 = {};

	var hasRequiredChrome55;

	function requireChrome55 () {
		if (hasRequiredChrome55) return Chrome55;
		hasRequiredChrome55 = 1;
		Object.defineProperty(Chrome55, "__esModule", { value: true });
		Chrome55.Chrome55 = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const errors_1 = requireErrors$1();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpPlanBUtils = requirePlanBUtils();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const logger = new Logger_1.Logger('Chrome55');
		const NAME = 'Chrome55';
		const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };
		let Chrome55$1 = class Chrome55 extends HandlerInterface_1.HandlerInterface {
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // Initial server side DTLS role. If not 'auto', it will force the opposite
		    // value in client side.
		    _forcedLocalDtlsRole;
		    // RTCPeerConnection instance.
		    _pc;
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Map of sending MediaStreamTracks indexed by localId.
		    _mapSendLocalIdTrack = new Map();
		    // Next sending localId.
		    _nextSendLocalId = 0;
		    // Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
		    // Value is an Object with mid, rtpParameters and rtpReceiver.
		    _mapRecvLocalIdInfo = new Map();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new Chrome55();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'plan-b',
		        });
		        try {
		            const offer = await pc.createOffer({
		                offerToReceiveAudio: true,
		                offerToReceiveVideo: true,
		            });
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		            planB: true,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        if (dtlsParameters.role && dtlsParameters.role !== 'auto') {
		            this._forcedLocalDtlsRole =
		                dtlsParameters.role === 'server' ? 'client' : 'server';
		        }
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'plan-b',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    async updateIceServers(iceServers) {
		        logger.debug('updateIceServers()');
		        const configuration = this._pc.getConfiguration();
		        configuration.iceServers = iceServers;
		        this._pc.setConfiguration(configuration);
		    }
		    async restartIce(iceParameters) {
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, }) {
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (codec) {
		            logger.warn('send() | codec selection is not available in %s handler', this.name);
		        }
		        this._sendStream.addTrack(track);
		        this._pc.addStream(this._sendStream);
		        let offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        let offerMediaObject;
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs);
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        if (track.kind === 'video' && encodings && encodings.length > 1) {
		            logger.debug('send() | enabling simulcast');
		            localSdpObject = sdpTransform.parse(offer.sdp);
		            offerMediaObject = localSdpObject.media.find((m) => m.type === 'video');
		            sdpPlanBUtils.addLegacySimulcast({
		                offerMediaObject,
		                track,
		                numStreams: encodings.length,
		            });
		            offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        offerMediaObject = localSdpObject.media.find((m) => m.type === track.kind);
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings.
		        sendingRtpParameters.encodings = sdpPlanBUtils.getRtpEncodings({
		            offerMediaObject,
		            track,
		        });
		        // Complete encodings with given values.
		        if (encodings) {
		            for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
		                if (encodings[idx]) {
		                    Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
		                }
		            }
		        }
		        // If VP8 and there is effective simulcast, add scalabilityMode to each
		        // encoding.
		        if (sendingRtpParameters.encodings.length > 1 &&
		            sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8') {
		            for (const encoding of sendingRtpParameters.encodings) {
		                encoding.scalabilityMode = 'L1T3';
		            }
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        const localId = String(this._nextSendLocalId);
		        this._nextSendLocalId++;
		        // Insert into the map.
		        this._mapSendLocalIdTrack.set(localId, track);
		        return {
		            localId: localId,
		            rtpParameters: sendingRtpParameters,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        logger.debug('stopSending() [localId:%s]', localId);
		        const track = this._mapSendLocalIdTrack.get(localId);
		        if (!track) {
		            throw new Error('track not found');
		        }
		        this._mapSendLocalIdTrack.delete(localId);
		        this._sendStream.removeTrack(track);
		        this._pc.addStream(this._sendStream);
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        try {
		            await this._pc.setLocalDescription(offer);
		        }
		        catch (error) {
		            // NOTE: If there are no sending tracks, setLocalDescription() will fail with
		            // "Failed to create channels". If so, ignore it.
		            if (this._sendStream.getTracks().length === 0) {
		                logger.warn('stopSending() | ignoring expected error due no sending tracks: %s', error.toString());
		                return;
		            }
		            throw error;
		        }
		        if (this._pc.signalingState === 'stable') {
		            return;
		        }
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async pauseSending(localId) {
		        // Unimplemented.
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async resumeSending(localId) {
		        // Unimplemented.
		    }
		    async replaceTrack(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localId, 
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    track) {
		        throw new errors_1.UnsupportedError('not implemented');
		    }
		    async setMaxSpatialLayer(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localId, 
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    spatialLayer) {
		        throw new errors_1.UnsupportedError(' not implemented');
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async setRtpEncodingParameters(localId, params) {
		        throw new errors_1.UnsupportedError('not supported');
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async getSenderStats(localId) {
		        throw new errors_1.UnsupportedError('not implemented');
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmitTime: maxPacketLifeTime, // NOTE: Old spec.
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertRecvDirection();
		        const results = [];
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters, streamId } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const mid = kind;
		            this._remoteSdp.receive({
		                mid,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId: streamId ?? rtpParameters.rtcp.cname,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { kind, rtpParameters } = options;
		            const mid = kind;
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === mid);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		        }
		        answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { kind, trackId, rtpParameters } = options;
		            const mid = kind;
		            const localId = trackId;
		            const streamId = options.streamId ?? rtpParameters.rtcp.cname;
		            const stream = this._pc
		                .getRemoteStreams()
		                .find((s) => s.id === streamId);
		            const track = stream.getTrackById(localId);
		            if (!track) {
		                throw new Error('remote track not found');
		            }
		            // Insert into the map.
		            this._mapRecvLocalIdInfo.set(localId, { mid, rtpParameters });
		            results.push({ localId, track });
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const { mid, rtpParameters } = this._mapRecvLocalIdInfo.get(localId) ?? {};
		            // Remove from the map.
		            this._mapRecvLocalIdInfo.delete(localId);
		            this._remoteSdp.planBStopReceiving({
		                mid: mid,
		                offerRtpParameters: rtpParameters,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async pauseReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    async resumeReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async getReceiverStats(localId) {
		        throw new errors_1.UnsupportedError('not implemented');
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmitTime: maxPacketLifeTime, // NOTE: Old spec.
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: true });
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		Chrome55.Chrome55 = Chrome55$1;
		return Chrome55;
	}

	var Firefox120 = {};

	var hasRequiredFirefox120;

	function requireFirefox120 () {
		if (hasRequiredFirefox120) return Firefox120;
		hasRequiredFirefox120 = 1;
		Object.defineProperty(Firefox120, "__esModule", { value: true });
		Firefox120.Firefox120 = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const errors_1 = requireErrors$1();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpUnifiedPlanUtils = requireUnifiedPlanUtils();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const scalabilityModes_1 = requireScalabilityModes();
		const logger = new Logger_1.Logger('Firefox120');
		const NAME = 'Firefox120';
		const SCTP_NUM_STREAMS = { OS: 16, MIS: 2048 };
		let Firefox120$1 = class Firefox120 extends HandlerInterface_1.HandlerInterface {
		    // Closed flag.
		    _closed = false;
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // RTCPeerConnection instance.
		    _pc;
		    // Map of RTCTransceivers indexed by MID.
		    _mapMidTransceiver = new Map();
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new Firefox120();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        if (this._closed) {
		            return;
		        }
		        this._closed = true;
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		        });
		        // NOTE: We need to add a real video track to get the RID extension mapping,
		        // otherwiser Firefox doesn't include it in the SDP.
		        const canvas = document.createElement('canvas');
		        // NOTE: Otherwise Firefox fails in next line.
		        canvas.getContext('2d');
		        const fakeStream = canvas.captureStream();
		        const fakeVideoTrack = fakeStream.getVideoTracks()[0];
		        try {
		            pc.addTransceiver('audio', { direction: 'sendrecv' });
		            pc.addTransceiver(fakeVideoTrack, {
		                direction: 'sendrecv',
		                sendEncodings: [
		                    { rid: 'r0', maxBitrate: 100000 },
		                    { rid: 'r1', maxBitrate: 500000 },
		                ],
		            });
		            const offer = await pc.createOffer();
		            try {
		                canvas.remove();
		            }
		            catch (error) { }
		            try {
		                fakeVideoTrack.stop();
		            }
		            catch (error) { }
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                canvas.remove();
		            }
		            catch (error2) { }
		            try {
		                fakeVideoTrack.stop();
		            }
		            catch (error2) { }
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        this.assertNotClosed();
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async updateIceServers(iceServers) {
		        this.assertNotClosed();
		        // NOTE: Firefox does not implement pc.setConfiguration().
		        throw new errors_1.UnsupportedError('not supported');
		    }
		    async restartIce(iceParameters) {
		        this.assertNotClosed();
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        this.assertNotClosed();
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, onRtpSender, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (encodings && encodings.length > 1) {
		            encodings.forEach((encoding, idx) => {
		                encoding.rid = `r${idx}`;
		            });
		        }
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec);
		        // NOTE: Firefox fails sometimes to properly anticipate the closed media
		        // section that it should use, so don't reuse closed media sections.
		        //   https://github.com/versatica/mediasoup-client/issues/104
		        //
		        // const mediaSectionIdx = this._remoteSdp!.getNextMediaSectionIdx();
		        const transceiver = this._pc.addTransceiver(track, {
		            direction: 'sendonly',
		            streams: [this._sendStream],
		            sendEncodings: encodings,
		        });
		        if (onRtpSender) {
		            onRtpSender(transceiver.sender);
		        }
		        const offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        // In Firefox use DTLS role client even if we are the "offerer" since
		        // Firefox does not respect ICE-Lite.
		        if (!this._transportReady) {
		            await this.setupTransport({ localDtlsRole: 'client', localSdpObject });
		        }
		        const layers = (0, scalabilityModes_1.parse)((encodings ?? [{}])[0].scalabilityMode);
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        // We can now get the transceiver.mid.
		        const localId = transceiver.mid;
		        // Set MID.
		        sendingRtpParameters.mid = localId;
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        const offerMediaObject = localSdpObject.media[localSdpObject.media.length - 1];
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings by parsing the SDP offer if no encodings are given.
		        if (!encodings) {
		            sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
		                offerMediaObject,
		            });
		        }
		        // Set RTP encodings by parsing the SDP offer and complete them with given
		        // one if just a single encoding has been given.
		        else if (encodings.length === 1) {
		            const newEncodings = sdpUnifiedPlanUtils.getRtpEncodings({
		                offerMediaObject,
		            });
		            Object.assign(newEncodings[0], encodings[0]);
		            sendingRtpParameters.encodings = newEncodings;
		        }
		        // Otherwise if more than 1 encoding are given use them verbatim.
		        else {
		            sendingRtpParameters.encodings = encodings;
		        }
		        // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		        // each encoding.
		        if (sendingRtpParameters.encodings.length > 1 &&
		            (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
		                sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
		            for (const encoding of sendingRtpParameters.encodings) {
		                if (encoding.scalabilityMode) {
		                    encoding.scalabilityMode = `L1T${layers.temporalLayers}`;
		                }
		                else {
		                    encoding.scalabilityMode = 'L1T3';
		                }
		            }
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        // Store in the map.
		        this._mapMidTransceiver.set(localId, transceiver);
		        return {
		            localId,
		            rtpParameters: sendingRtpParameters,
		            rtpSender: transceiver.sender,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        logger.debug('stopSending() [localId:%s]', localId);
		        if (this._closed) {
		            return;
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated transceiver not found');
		        }
		        void transceiver.sender.replaceTrack(null);
		        // NOTE: Cannot use stop() the transceiver due to the the note above in
		        // send() method.
		        // try
		        // {
		        // 	transceiver.stop();
		        // }
		        // catch (error)
		        // {}
		        this._pc.removeTrack(transceiver.sender);
		        // NOTE: Cannot use closeMediaSection() due to the the note above in send()
		        // method.
		        // this._remoteSdp!.closeMediaSection(transceiver.mid);
		        this._remoteSdp.disableMediaSection(transceiver.mid);
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        this._mapMidTransceiver.delete(localId);
		    }
		    async pauseSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('pauseSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'inactive';
		        this._remoteSdp.pauseMediaSection(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('pauseSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async resumeSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('resumeSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'sendonly';
		        this._remoteSdp.resumeSendingMediaSection(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('resumeSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async replaceTrack(localId, track) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        await transceiver.sender.replaceTrack(track);
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated transceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            if (idx <= spatialLayer) {
		                encoding.active = true;
		            }
		            else {
		                encoding.active = false;
		            }
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setMaxSpatialLayer() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setMaxSpatialLayer() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            parameters.encodings[idx] = { ...encoding, ...params };
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setRtpEncodingParameters() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setRtpEncodingParameters() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async getSenderStats(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.sender.getStats();
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({ localDtlsRole: 'client', localSdpObject });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const results = [];
		        const mapLocalId = new Map();
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters, streamId } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const localId = rtpParameters.mid ?? String(this._mapMidTransceiver.size);
		            mapLocalId.set(trackId, localId);
		            this._remoteSdp.receive({
		                mid: localId,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId: streamId ?? rtpParameters.rtcp.cname,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        for (const options of optionsList) {
		            const { trackId, onRtpReceiver } = options;
		            if (onRtpReceiver) {
		                const localId = mapLocalId.get(trackId);
		                const transceiver = this._pc
		                    .getTransceivers()
		                    .find((t) => t.mid === localId);
		                if (!transceiver) {
		                    throw new Error('transceiver not found');
		                }
		                onRtpReceiver(transceiver.receiver);
		            }
		        }
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { trackId, rtpParameters } = options;
		            const localId = mapLocalId.get(trackId);
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === localId);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		            answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        if (!this._transportReady) {
		            await this.setupTransport({ localDtlsRole: 'client', localSdpObject });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { trackId } = options;
		            const localId = mapLocalId.get(trackId);
		            const transceiver = this._pc
		                .getTransceivers()
		                .find((t) => t.mid === localId);
		            if (!transceiver) {
		                throw new Error('new RTCRtpTransceiver not found');
		            }
		            // Store in the map.
		            this._mapMidTransceiver.set(localId, transceiver);
		            results.push({
		                localId,
		                track: transceiver.receiver.track,
		                rtpReceiver: transceiver.receiver,
		            });
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        if (this._closed) {
		            return;
		        }
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            this._remoteSdp.closeMediaSection(transceiver.mid);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const localId of localIds) {
		            this._mapMidTransceiver.delete(localId);
		        }
		    }
		    async pauseReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('pauseReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'inactive';
		            this._remoteSdp.pauseMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('pauseReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async resumeReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('resumeReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'recvonly';
		            this._remoteSdp.resumeReceivingMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('resumeReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async getReceiverStats(localId) {
		        this.assertRecvDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.receiver.getStats();
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits, } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation();
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({ localDtlsRole: 'client', localSdpObject });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertNotClosed() {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('method called in a closed handler');
		        }
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		Firefox120.Firefox120 = Firefox120$1;
		return Firefox120;
	}

	var Firefox60 = {};

	var hasRequiredFirefox60;

	function requireFirefox60 () {
		if (hasRequiredFirefox60) return Firefox60;
		hasRequiredFirefox60 = 1;
		Object.defineProperty(Firefox60, "__esModule", { value: true });
		Firefox60.Firefox60 = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const errors_1 = requireErrors$1();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpUnifiedPlanUtils = requireUnifiedPlanUtils();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const scalabilityModes_1 = requireScalabilityModes();
		const logger = new Logger_1.Logger('Firefox60');
		const NAME = 'Firefox60';
		const SCTP_NUM_STREAMS = { OS: 16, MIS: 2048 };
		let Firefox60$1 = class Firefox60 extends HandlerInterface_1.HandlerInterface {
		    // Closed flag.
		    _closed = false;
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // RTCPeerConnection instance.
		    _pc;
		    // Map of RTCTransceivers indexed by MID.
		    _mapMidTransceiver = new Map();
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new Firefox60();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        if (this._closed) {
		            return;
		        }
		        this._closed = true;
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		        });
		        // NOTE: We need to add a real video track to get the RID extension mapping.
		        const canvas = document.createElement('canvas');
		        // NOTE: Otherwise Firefox fails in next line.
		        canvas.getContext('2d');
		        const fakeStream = canvas.captureStream();
		        const fakeVideoTrack = fakeStream.getVideoTracks()[0];
		        try {
		            pc.addTransceiver('audio', { direction: 'sendrecv' });
		            const videoTransceiver = pc.addTransceiver(fakeVideoTrack, {
		                direction: 'sendrecv',
		            });
		            const parameters = videoTransceiver.sender.getParameters();
		            const encodings = [
		                { rid: 'r0', maxBitrate: 100000 },
		                { rid: 'r1', maxBitrate: 500000 },
		            ];
		            parameters.encodings = encodings;
		            await videoTransceiver.sender.setParameters(parameters);
		            const offer = await pc.createOffer();
		            try {
		                canvas.remove();
		            }
		            catch (error) { }
		            try {
		                fakeVideoTrack.stop();
		            }
		            catch (error) { }
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                canvas.remove();
		            }
		            catch (error2) { }
		            try {
		                fakeVideoTrack.stop();
		            }
		            catch (error2) { }
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        this.assertNotClosed();
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async updateIceServers(iceServers) {
		        this.assertNotClosed();
		        // NOTE: Firefox does not implement pc.setConfiguration().
		        throw new errors_1.UnsupportedError('not supported');
		    }
		    async restartIce(iceParameters) {
		        this.assertNotClosed();
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        this.assertNotClosed();
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (encodings) {
		            encodings = utils.clone(encodings);
		            encodings.forEach((encoding, idx) => {
		                encoding.rid = `r${idx}`;
		            });
		            // Clone the encodings and reverse them because Firefox likes them
		            // from high to low.
		            encodings.reverse();
		        }
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec);
		        // NOTE: Firefox fails sometimes to properly anticipate the closed media
		        // section that it should use, so don't reuse closed media sections.
		        //   https://github.com/versatica/mediasoup-client/issues/104
		        //
		        // const mediaSectionIdx = this._remoteSdp!.getNextMediaSectionIdx();
		        const transceiver = this._pc.addTransceiver(track, {
		            direction: 'sendonly',
		            streams: [this._sendStream],
		        });
		        // NOTE: This is not spec compliants. Encodings should be given in addTransceiver
		        // second argument, but Firefox does not support it.
		        if (encodings) {
		            const parameters = transceiver.sender.getParameters();
		            parameters.encodings = encodings;
		            await transceiver.sender.setParameters(parameters);
		        }
		        const offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        // In Firefox use DTLS role client even if we are the "offerer" since
		        // Firefox does not respect ICE-Lite.
		        if (!this._transportReady) {
		            await this.setupTransport({ localDtlsRole: 'client', localSdpObject });
		        }
		        const layers = (0, scalabilityModes_1.parse)((encodings ?? [{}])[0].scalabilityMode);
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        // We can now get the transceiver.mid.
		        const localId = transceiver.mid;
		        // Set MID.
		        sendingRtpParameters.mid = localId;
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        const offerMediaObject = localSdpObject.media[localSdpObject.media.length - 1];
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings by parsing the SDP offer if no encodings are given.
		        if (!encodings) {
		            sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
		                offerMediaObject,
		            });
		        }
		        // Set RTP encodings by parsing the SDP offer and complete them with given
		        // one if just a single encoding has been given.
		        else if (encodings.length === 1) {
		            const newEncodings = sdpUnifiedPlanUtils.getRtpEncodings({
		                offerMediaObject,
		            });
		            Object.assign(newEncodings[0], encodings[0]);
		            sendingRtpParameters.encodings = newEncodings;
		        }
		        // Otherwise if more than 1 encoding are given use them verbatim (but
		        // reverse them back since we reversed them above to satisfy Firefox).
		        else {
		            sendingRtpParameters.encodings = encodings.reverse();
		        }
		        // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		        // each encoding.
		        if (sendingRtpParameters.encodings.length > 1 &&
		            (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
		                sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
		            for (const encoding of sendingRtpParameters.encodings) {
		                if (encoding.scalabilityMode) {
		                    encoding.scalabilityMode = `L1T${layers.temporalLayers}`;
		                }
		                else {
		                    encoding.scalabilityMode = 'L1T3';
		                }
		            }
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        // Store in the map.
		        this._mapMidTransceiver.set(localId, transceiver);
		        return {
		            localId,
		            rtpParameters: sendingRtpParameters,
		            rtpSender: transceiver.sender,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        logger.debug('stopSending() [localId:%s]', localId);
		        if (this._closed) {
		            return;
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated transceiver not found');
		        }
		        void transceiver.sender.replaceTrack(null);
		        // NOTE: Cannot use stop() the transceiver due to the the note above in
		        // send() method.
		        // try
		        // {
		        // 	transceiver.stop();
		        // }
		        // catch (error)
		        // {}
		        this._pc.removeTrack(transceiver.sender);
		        // NOTE: Cannot use closeMediaSection() due to the the note above in send()
		        // method.
		        // this._remoteSdp!.closeMediaSection(transceiver.mid);
		        this._remoteSdp.disableMediaSection(transceiver.mid);
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        this._mapMidTransceiver.delete(localId);
		    }
		    async pauseSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('pauseSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'inactive';
		        this._remoteSdp.pauseMediaSection(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('pauseSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async resumeSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('resumeSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'sendonly';
		        this._remoteSdp.resumeSendingMediaSection(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('resumeSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async replaceTrack(localId, track) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        await transceiver.sender.replaceTrack(track);
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated transceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        // NOTE: We require encodings given from low to high, however Firefox
		        // requires them in reverse order, so do magic here.
		        spatialLayer = parameters.encodings.length - 1 - spatialLayer;
		        parameters.encodings.forEach((encoding, idx) => {
		            if (idx >= spatialLayer) {
		                encoding.active = true;
		            }
		            else {
		                encoding.active = false;
		            }
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setMaxSpatialLayer() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setMaxSpatialLayer() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            parameters.encodings[idx] = { ...encoding, ...params };
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setRtpEncodingParameters() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setRtpEncodingParameters() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async getSenderStats(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.sender.getStats();
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({ localDtlsRole: 'client', localSdpObject });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const results = [];
		        const mapLocalId = new Map();
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters, streamId } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const localId = rtpParameters.mid ?? String(this._mapMidTransceiver.size);
		            mapLocalId.set(trackId, localId);
		            this._remoteSdp.receive({
		                mid: localId,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId: streamId ?? rtpParameters.rtcp.cname,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { trackId, rtpParameters } = options;
		            const localId = mapLocalId.get(trackId);
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === localId);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		            answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        if (!this._transportReady) {
		            await this.setupTransport({ localDtlsRole: 'client', localSdpObject });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { trackId } = options;
		            const localId = mapLocalId.get(trackId);
		            const transceiver = this._pc
		                .getTransceivers()
		                .find((t) => t.mid === localId);
		            if (!transceiver) {
		                throw new Error('new RTCRtpTransceiver not found');
		            }
		            // Store in the map.
		            this._mapMidTransceiver.set(localId, transceiver);
		            results.push({
		                localId,
		                track: transceiver.receiver.track,
		                rtpReceiver: transceiver.receiver,
		            });
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        if (this._closed) {
		            return;
		        }
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            this._remoteSdp.closeMediaSection(transceiver.mid);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const localId of localIds) {
		            this._mapMidTransceiver.delete(localId);
		        }
		    }
		    async pauseReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('pauseReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'inactive';
		            this._remoteSdp.pauseMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('pauseReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async resumeReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('resumeReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'recvonly';
		            this._remoteSdp.resumeReceivingMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('resumeReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async getReceiverStats(localId) {
		        this.assertRecvDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.receiver.getStats();
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits, } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation();
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({ localDtlsRole: 'client', localSdpObject });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertNotClosed() {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('method called in a closed handler');
		        }
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		Firefox60.Firefox60 = Firefox60$1;
		return Firefox60;
	}

	var Safari12 = {};

	var hasRequiredSafari12;

	function requireSafari12 () {
		if (hasRequiredSafari12) return Safari12;
		hasRequiredSafari12 = 1;
		Object.defineProperty(Safari12, "__esModule", { value: true });
		Safari12.Safari12 = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpUnifiedPlanUtils = requireUnifiedPlanUtils();
		const ortcUtils = requireUtils$1();
		const errors_1 = requireErrors$1();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const scalabilityModes_1 = requireScalabilityModes();
		const logger = new Logger_1.Logger('Safari12');
		const NAME = 'Safari12';
		const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };
		let Safari12$1 = class Safari12 extends HandlerInterface_1.HandlerInterface {
		    // Closed flag.
		    _closed = false;
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // Initial server side DTLS role. If not 'auto', it will force the opposite
		    // value in client side.
		    _forcedLocalDtlsRole;
		    // RTCPeerConnection instance.
		    _pc;
		    // Map of RTCTransceivers indexed by MID.
		    _mapMidTransceiver = new Map();
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new Safari12();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        if (this._closed) {
		            return;
		        }
		        this._closed = true;
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		        });
		        try {
		            pc.addTransceiver('audio');
		            pc.addTransceiver('video');
		            const offer = await pc.createOffer();
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            // libwebrtc supports NACK for OPUS but doesn't announce it.
		            ortcUtils.addNackSupportForOpus(nativeRtpCapabilities);
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        this.assertNotClosed();
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        if (dtlsParameters.role && dtlsParameters.role !== 'auto') {
		            this._forcedLocalDtlsRole =
		                dtlsParameters.role === 'server' ? 'client' : 'server';
		        }
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    async updateIceServers(iceServers) {
		        this.assertNotClosed();
		        logger.debug('updateIceServers()');
		        const configuration = this._pc.getConfiguration();
		        configuration.iceServers = iceServers;
		        this._pc.setConfiguration(configuration);
		    }
		    async restartIce(iceParameters) {
		        this.assertNotClosed();
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        this.assertNotClosed();
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, onRtpSender, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec);
		        const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();
		        const transceiver = this._pc.addTransceiver(track, {
		            direction: 'sendonly',
		            streams: [this._sendStream],
		        });
		        if (onRtpSender) {
		            onRtpSender(transceiver.sender);
		        }
		        let offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        let offerMediaObject;
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        const layers = (0, scalabilityModes_1.parse)((encodings ?? [{}])[0].scalabilityMode);
		        if (encodings && encodings.length > 1) {
		            logger.debug('send() | enabling legacy simulcast');
		            localSdpObject = sdpTransform.parse(offer.sdp);
		            offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
		            sdpUnifiedPlanUtils.addLegacySimulcast({
		                offerMediaObject,
		                numStreams: encodings.length,
		            });
		            offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        // We can now get the transceiver.mid.
		        const localId = transceiver.mid;
		        // Set MID.
		        sendingRtpParameters.mid = localId;
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings.
		        sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
		            offerMediaObject,
		        });
		        // Complete encodings with given values.
		        if (encodings) {
		            for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
		                if (encodings[idx]) {
		                    Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
		                }
		            }
		        }
		        // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		        // each encoding.
		        if (sendingRtpParameters.encodings.length > 1 &&
		            (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
		                sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
		            for (const encoding of sendingRtpParameters.encodings) {
		                if (encoding.scalabilityMode) {
		                    encoding.scalabilityMode = `L1T${layers.temporalLayers}`;
		                }
		                else {
		                    encoding.scalabilityMode = 'L1T3';
		                }
		            }
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            reuseMid: mediaSectionIdx.reuseMid,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        // Store in the map.
		        this._mapMidTransceiver.set(localId, transceiver);
		        return {
		            localId,
		            rtpParameters: sendingRtpParameters,
		            rtpSender: transceiver.sender,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        if (this._closed) {
		            return;
		        }
		        logger.debug('stopSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        void transceiver.sender.replaceTrack(null);
		        this._pc.removeTrack(transceiver.sender);
		        const mediaSectionClosed = this._remoteSdp.closeMediaSection(transceiver.mid);
		        if (mediaSectionClosed) {
		            try {
		                transceiver.stop();
		            }
		            catch (error) { }
		        }
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        this._mapMidTransceiver.delete(localId);
		    }
		    async pauseSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('pauseSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'inactive';
		        this._remoteSdp.pauseMediaSection(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('pauseSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async resumeSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('resumeSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'sendonly';
		        this._remoteSdp.resumeSendingMediaSection(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('resumeSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async replaceTrack(localId, track) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        await transceiver.sender.replaceTrack(track);
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            if (idx <= spatialLayer) {
		                encoding.active = true;
		            }
		            else {
		                encoding.active = false;
		            }
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setMaxSpatialLayer() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setMaxSpatialLayer() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            parameters.encodings[idx] = { ...encoding, ...params };
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setRtpEncodingParameters() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setRtpEncodingParameters() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async getSenderStats(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.sender.getStats();
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const results = [];
		        const mapLocalId = new Map();
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters, streamId } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const localId = rtpParameters.mid ?? String(this._mapMidTransceiver.size);
		            mapLocalId.set(trackId, localId);
		            this._remoteSdp.receive({
		                mid: localId,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId: streamId ?? rtpParameters.rtcp.cname,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        for (const options of optionsList) {
		            const { trackId, onRtpReceiver } = options;
		            if (onRtpReceiver) {
		                const localId = mapLocalId.get(trackId);
		                const transceiver = this._pc
		                    .getTransceivers()
		                    .find((t) => t.mid === localId);
		                if (!transceiver) {
		                    throw new Error('transceiver not found');
		                }
		                onRtpReceiver(transceiver.receiver);
		            }
		        }
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { trackId, rtpParameters } = options;
		            const localId = mapLocalId.get(trackId);
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === localId);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		        }
		        answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { trackId } = options;
		            const localId = mapLocalId.get(trackId);
		            const transceiver = this._pc
		                .getTransceivers()
		                .find((t) => t.mid === localId);
		            if (!transceiver) {
		                throw new Error('new RTCRtpTransceiver not found');
		            }
		            // Store in the map.
		            this._mapMidTransceiver.set(localId, transceiver);
		            results.push({
		                localId,
		                track: transceiver.receiver.track,
		                rtpReceiver: transceiver.receiver,
		            });
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        if (this._closed) {
		            return;
		        }
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            this._remoteSdp.closeMediaSection(transceiver.mid);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const localId of localIds) {
		            this._mapMidTransceiver.delete(localId);
		        }
		    }
		    async pauseReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('pauseReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'inactive';
		            this._remoteSdp.pauseMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('pauseReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async resumeReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('resumeReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'recvonly';
		            this._remoteSdp.resumeReceivingMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('resumeReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async getReceiverStats(localId) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.receiver.getStats();
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits, } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation();
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertNotClosed() {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('method called in a closed handler');
		        }
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		Safari12.Safari12 = Safari12$1;
		return Safari12;
	}

	var Safari11 = {};

	var hasRequiredSafari11;

	function requireSafari11 () {
		if (hasRequiredSafari11) return Safari11;
		hasRequiredSafari11 = 1;
		Object.defineProperty(Safari11, "__esModule", { value: true });
		Safari11.Safari11 = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpPlanBUtils = requirePlanBUtils();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const logger = new Logger_1.Logger('Safari11');
		const NAME = 'Safari11';
		const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };
		let Safari11$1 = class Safari11 extends HandlerInterface_1.HandlerInterface {
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // Initial server side DTLS role. If not 'auto', it will force the opposite
		    // value in client side.
		    _forcedLocalDtlsRole;
		    // RTCPeerConnection instance.
		    _pc;
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Map of RTCRtpSender indexed by localId.
		    _mapSendLocalIdRtpSender = new Map();
		    // Next sending localId.
		    _nextSendLocalId = 0;
		    // Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
		    // Value is an Object with mid, rtpParameters and rtpReceiver.
		    _mapRecvLocalIdInfo = new Map();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new Safari11();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'plan-b',
		        });
		        try {
		            const offer = await pc.createOffer({
		                offerToReceiveAudio: true,
		                offerToReceiveVideo: true,
		            });
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		            planB: true,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        if (dtlsParameters.role && dtlsParameters.role !== 'auto') {
		            this._forcedLocalDtlsRole =
		                dtlsParameters.role === 'server' ? 'client' : 'server';
		        }
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    async updateIceServers(iceServers) {
		        logger.debug('updateIceServers()');
		        const configuration = this._pc.getConfiguration();
		        configuration.iceServers = iceServers;
		        this._pc.setConfiguration(configuration);
		    }
		    async restartIce(iceParameters) {
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, }) {
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (codec) {
		            logger.warn('send() | codec selection is not available in %s handler', this.name);
		        }
		        this._sendStream.addTrack(track);
		        this._pc.addTrack(track, this._sendStream);
		        let offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        let offerMediaObject;
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs);
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        if (track.kind === 'video' && encodings && encodings.length > 1) {
		            logger.debug('send() | enabling simulcast');
		            localSdpObject = sdpTransform.parse(offer.sdp);
		            offerMediaObject = localSdpObject.media.find((m) => m.type === 'video');
		            sdpPlanBUtils.addLegacySimulcast({
		                offerMediaObject,
		                track,
		                numStreams: encodings.length,
		            });
		            offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        offerMediaObject = localSdpObject.media.find((m) => m.type === track.kind);
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings.
		        sendingRtpParameters.encodings = sdpPlanBUtils.getRtpEncodings({
		            offerMediaObject,
		            track,
		        });
		        // Complete encodings with given values.
		        if (encodings) {
		            for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
		                if (encodings[idx]) {
		                    Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
		                }
		            }
		        }
		        // If VP8 and there is effective simulcast, add scalabilityMode to each
		        // encoding.
		        if (sendingRtpParameters.encodings.length > 1 &&
		            sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8') {
		            for (const encoding of sendingRtpParameters.encodings) {
		                encoding.scalabilityMode = 'L1T3';
		            }
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        const localId = String(this._nextSendLocalId);
		        this._nextSendLocalId++;
		        const rtpSender = this._pc
		            .getSenders()
		            .find((s) => s.track === track);
		        // Insert into the map.
		        this._mapSendLocalIdRtpSender.set(localId, rtpSender);
		        return {
		            localId: localId,
		            rtpParameters: sendingRtpParameters,
		            rtpSender,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        const rtpSender = this._mapSendLocalIdRtpSender.get(localId);
		        if (!rtpSender) {
		            throw new Error('associated RTCRtpSender not found');
		        }
		        if (rtpSender.track) {
		            this._sendStream.removeTrack(rtpSender.track);
		        }
		        this._mapSendLocalIdRtpSender.delete(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        try {
		            await this._pc.setLocalDescription(offer);
		        }
		        catch (error) {
		            // NOTE: If there are no sending tracks, setLocalDescription() will fail with
		            // "Failed to create channels". If so, ignore it.
		            if (this._sendStream.getTracks().length === 0) {
		                logger.warn('stopSending() | ignoring expected error due no sending tracks: %s', error.toString());
		                return;
		            }
		            throw error;
		        }
		        if (this._pc.signalingState === 'stable') {
		            return;
		        }
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async pauseSending(localId) {
		        // Unimplemented.
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async resumeSending(localId) {
		        // Unimplemented.
		    }
		    async replaceTrack(localId, track) {
		        this.assertSendDirection();
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        const rtpSender = this._mapSendLocalIdRtpSender.get(localId);
		        if (!rtpSender) {
		            throw new Error('associated RTCRtpSender not found');
		        }
		        const oldTrack = rtpSender.track;
		        await rtpSender.replaceTrack(track);
		        // Remove the old track from the local stream.
		        if (oldTrack) {
		            this._sendStream.removeTrack(oldTrack);
		        }
		        // Add the new track to the local stream.
		        if (track) {
		            this._sendStream.addTrack(track);
		        }
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        this.assertSendDirection();
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		        const rtpSender = this._mapSendLocalIdRtpSender.get(localId);
		        if (!rtpSender) {
		            throw new Error('associated RTCRtpSender not found');
		        }
		        const parameters = rtpSender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            if (idx <= spatialLayer) {
		                encoding.active = true;
		            }
		            else {
		                encoding.active = false;
		            }
		        });
		        await rtpSender.setParameters(parameters);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        this.assertSendDirection();
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		        const rtpSender = this._mapSendLocalIdRtpSender.get(localId);
		        if (!rtpSender) {
		            throw new Error('associated RTCRtpSender not found');
		        }
		        const parameters = rtpSender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            parameters.encodings[idx] = { ...encoding, ...params };
		        });
		        await rtpSender.setParameters(parameters);
		    }
		    async getSenderStats(localId) {
		        this.assertSendDirection();
		        const rtpSender = this._mapSendLocalIdRtpSender.get(localId);
		        if (!rtpSender) {
		            throw new Error('associated RTCRtpSender not found');
		        }
		        return rtpSender.getStats();
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertRecvDirection();
		        const results = [];
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters, streamId } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const mid = kind;
		            this._remoteSdp.receive({
		                mid,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId: streamId ?? rtpParameters.rtcp.cname,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { kind, rtpParameters } = options;
		            const mid = kind;
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === mid);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		        }
		        answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { kind, trackId, rtpParameters } = options;
		            const mid = kind;
		            const localId = trackId;
		            const rtpReceiver = this._pc
		                .getReceivers()
		                .find((r) => r.track && r.track.id === localId);
		            if (!rtpReceiver) {
		                throw new Error('new RTCRtpReceiver not');
		            }
		            // Insert into the map.
		            this._mapRecvLocalIdInfo.set(localId, {
		                mid,
		                rtpParameters,
		                rtpReceiver,
		            });
		            results.push({
		                localId,
		                track: rtpReceiver.track,
		                rtpReceiver,
		            });
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const { mid, rtpParameters } = this._mapRecvLocalIdInfo.get(localId) ?? {};
		            // Remove from the map.
		            this._mapRecvLocalIdInfo.delete(localId);
		            this._remoteSdp.planBStopReceiving({
		                mid: mid,
		                offerRtpParameters: rtpParameters,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async getReceiverStats(localId) {
		        this.assertRecvDirection();
		        const { rtpReceiver } = this._mapRecvLocalIdInfo.get(localId) ?? {};
		        if (!rtpReceiver) {
		            throw new Error('associated RTCRtpReceiver not found');
		        }
		        return rtpReceiver.getStats();
		    }
		    async pauseReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    async resumeReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: true });
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		Safari11.Safari11 = Safari11$1;
		return Safari11;
	}

	var Edge11 = {};

	var edgeUtils = {};

	var hasRequiredEdgeUtils;

	function requireEdgeUtils () {
		if (hasRequiredEdgeUtils) return edgeUtils;
		hasRequiredEdgeUtils = 1;
		Object.defineProperty(edgeUtils, "__esModule", { value: true });
		edgeUtils.getCapabilities = getCapabilities;
		edgeUtils.mangleRtpParameters = mangleRtpParameters;
		const utils = requireUtils$2();
		/**
		 * Normalize ORTC based Edge's RTCRtpReceiver.getCapabilities() to produce a full
		 * compliant ORTC RTCRtpCapabilities.
		 */
		function getCapabilities() {
		    const nativeCaps = RTCRtpReceiver.getCapabilities();
		    const caps = utils.clone(nativeCaps);
		    for (const codec of caps.codecs ?? []) {
		        // Rename numChannels to channels.
		        // @ts-expect-error --- On purpose.
		        codec.channels = codec.numChannels;
		        // @ts-expect-error --- On purpose.
		        delete codec.numChannels;
		        // Add mimeType.
		        // @ts-expect-error --- On purpose (due to codec.name).
		        codec.mimeType = codec.mimeType ?? `${codec.kind}/${codec.name}`;
		        // NOTE: Edge sets some numeric parameters as string rather than number. Fix them.
		        if (codec.parameters) {
		            const parameters = codec.parameters;
		            if (parameters.apt) {
		                parameters.apt = Number(parameters.apt);
		            }
		            if (parameters['packetization-mode']) {
		                parameters['packetization-mode'] = Number(parameters['packetization-mode']);
		            }
		        }
		        // Delete emty parameter String in rtcpFeedback.
		        for (const feedback of codec.rtcpFeedback ?? []) {
		            if (!feedback.parameter) {
		                feedback.parameter = '';
		            }
		        }
		    }
		    return caps;
		}
		/**
		 * Generate RTCRtpParameters as ORTC based Edge likes.
		 */
		function mangleRtpParameters(rtpParameters) {
		    const params = utils.clone(rtpParameters);
		    // Rename mid to muxId.
		    if (params.mid) {
		        // @ts-expect-error --- On purpose (due to muxId).
		        params.muxId = params.mid;
		        delete params.mid;
		    }
		    for (const codec of params.codecs) {
		        // Rename channels to numChannels.
		        if (codec.channels) {
		            // @ts-expect-error --- On purpose.
		            codec.numChannels = codec.channels;
		            delete codec.channels;
		        }
		        // Add codec.name (requried by Edge).
		        // @ts-expect-error --- On purpose (due to name).
		        if (codec.mimeType && !codec.name) {
		            // @ts-expect-error --- On purpose (due to name).
		            codec.name = codec.mimeType.split('/')[1];
		        }
		        // Remove mimeType.
		        // @ts-expect-error --- Removing mandatory field.
		        delete codec.mimeType;
		    }
		    return params;
		}
		return edgeUtils;
	}

	var hasRequiredEdge11;

	function requireEdge11 () {
		if (hasRequiredEdge11) return Edge11;
		hasRequiredEdge11 = 1;
		Object.defineProperty(Edge11, "__esModule", { value: true });
		Edge11.Edge11 = void 0;
		const Logger_1 = requireLogger$2();
		const errors_1 = requireErrors$1();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const edgeUtils = requireEdgeUtils();
		const HandlerInterface_1 = requireHandlerInterface();
		const logger = new Logger_1.Logger('Edge11');
		const NAME = 'Edge11';
		let Edge11$1 = class Edge11 extends HandlerInterface_1.HandlerInterface {
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Transport remote ICE parameters.
		    _remoteIceParameters;
		    // Transport remote ICE candidates.
		    _remoteIceCandidates;
		    // Transport remote DTLS parameters.
		    _remoteDtlsParameters;
		    // ICE gatherer.
		    _iceGatherer;
		    // ICE transport.
		    _iceTransport;
		    // DTLS transport.
		    _dtlsTransport;
		    // Map of RTCRtpSenders indexed by id.
		    _rtpSenders = new Map();
		    // Map of RTCRtpReceivers indexed by id.
		    _rtpReceivers = new Map();
		    // Next localId for sending tracks.
		    _nextSendLocalId = 0;
		    // Local RTCP CNAME.
		    _cname;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new Edge11();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        // Close the ICE gatherer.
		        // NOTE: Not yet implemented by Edge.
		        try {
		            this._iceGatherer.close();
		        }
		        catch (error) { }
		        // Close the ICE transport.
		        try {
		            this._iceTransport.stop();
		        }
		        catch (error) { }
		        // Close the DTLS transport.
		        try {
		            this._dtlsTransport.stop();
		        }
		        catch (error) { }
		        // Close RTCRtpSenders.
		        for (const rtpSender of this._rtpSenders.values()) {
		            try {
		                rtpSender.stop();
		            }
		            catch (error) { }
		        }
		        // Close RTCRtpReceivers.
		        for (const rtpReceiver of this._rtpReceivers.values()) {
		            try {
		                rtpReceiver.stop();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        return edgeUtils.getCapabilities();
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: { OS: 0, MIS: 0 },
		        };
		    }
		    run({ direction, // eslint-disable-line @typescript-eslint/no-unused-vars
		    iceParameters, iceCandidates, dtlsParameters, sctpParameters, // eslint-disable-line @typescript-eslint/no-unused-vars
		    iceServers, iceTransportPolicy, additionalSettings, // eslint-disable-line @typescript-eslint/no-unused-vars
		    proprietaryConstraints, // eslint-disable-line @typescript-eslint/no-unused-vars
		    extendedRtpCapabilities, }) {
		        logger.debug('run()');
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._remoteIceParameters = iceParameters;
		        this._remoteIceCandidates = iceCandidates;
		        this._remoteDtlsParameters = dtlsParameters;
		        this._cname = `CNAME-${utils.generateRandomNumber()}`;
		        this.setIceGatherer({ iceServers, iceTransportPolicy });
		        this.setIceTransport();
		        this.setDtlsTransport();
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async updateIceServers(iceServers) {
		        // NOTE: Edge 11 does not implement iceGatherer.gater().
		        throw new errors_1.UnsupportedError('not supported');
		    }
		    async restartIce(iceParameters) {
		        logger.debug('restartIce()');
		        this._remoteIceParameters = iceParameters;
		        if (!this._transportReady) {
		            return;
		        }
		        logger.debug('restartIce() | calling iceTransport.start()');
		        this._iceTransport.start(this._iceGatherer, iceParameters, 'controlling');
		        for (const candidate of this._remoteIceCandidates) {
		            this._iceTransport.addRemoteCandidate(candidate);
		        }
		        this._iceTransport.addRemoteCandidate({});
		    }
		    async getTransportStats() {
		        return this._iceTransport.getStats();
		    }
		    async send(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    { track, encodings, codecOptions, codec }) {
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (!this._transportReady) {
		            await this.setupTransport({ localDtlsRole: 'server' });
		        }
		        logger.debug('send() | calling new RTCRtpSender()');
		        const rtpSender = new RTCRtpSender(track, this._dtlsTransport);
		        const rtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        rtpParameters.codecs = ortc.reduceCodecs(rtpParameters.codecs, codec);
		        const useRtx = rtpParameters.codecs.some((_codec) => /.+\/rtx$/i.test(_codec.mimeType));
		        if (!encodings) {
		            encodings = [{}];
		        }
		        for (const encoding of encodings) {
		            encoding.ssrc = utils.generateRandomNumber();
		            if (useRtx) {
		                encoding.rtx = { ssrc: utils.generateRandomNumber() };
		            }
		        }
		        rtpParameters.encodings = encodings;
		        // Fill RTCRtpParameters.rtcp.
		        rtpParameters.rtcp = {
		            cname: this._cname,
		            reducedSize: true,
		            mux: true,
		        };
		        // NOTE: Convert our standard RTCRtpParameters into those that Edge
		        // expects.
		        const edgeRtpParameters = edgeUtils.mangleRtpParameters(rtpParameters);
		        logger.debug('send() | calling rtpSender.send() [params:%o]', edgeRtpParameters);
		        await rtpSender.send(edgeRtpParameters);
		        const localId = String(this._nextSendLocalId);
		        this._nextSendLocalId++;
		        // Store it.
		        this._rtpSenders.set(localId, rtpSender);
		        return { localId, rtpParameters, rtpSender };
		    }
		    async stopSending(localId) {
		        logger.debug('stopSending() [localId:%s]', localId);
		        const rtpSender = this._rtpSenders.get(localId);
		        if (!rtpSender) {
		            throw new Error('RTCRtpSender not found');
		        }
		        this._rtpSenders.delete(localId);
		        try {
		            logger.debug('stopSending() | calling rtpSender.stop()');
		            rtpSender.stop();
		        }
		        catch (error) {
		            logger.warn('stopSending() | rtpSender.stop() failed:%o', error);
		            throw error;
		        }
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async pauseSending(localId) {
		        // Unimplemented.
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async resumeSending(localId) {
		        // Unimplemented.
		    }
		    async replaceTrack(localId, track) {
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        const rtpSender = this._rtpSenders.get(localId);
		        if (!rtpSender) {
		            throw new Error('RTCRtpSender not found');
		        }
		        rtpSender.setTrack(track);
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		        const rtpSender = this._rtpSenders.get(localId);
		        if (!rtpSender) {
		            throw new Error('RTCRtpSender not found');
		        }
		        const parameters = rtpSender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            if (idx <= spatialLayer) {
		                encoding.active = true;
		            }
		            else {
		                encoding.active = false;
		            }
		        });
		        await rtpSender.setParameters(parameters);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		        const rtpSender = this._rtpSenders.get(localId);
		        if (!rtpSender) {
		            throw new Error('RTCRtpSender not found');
		        }
		        const parameters = rtpSender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            parameters.encodings[idx] = { ...encoding, ...params };
		        });
		        await rtpSender.setParameters(parameters);
		    }
		    async getSenderStats(localId) {
		        const rtpSender = this._rtpSenders.get(localId);
		        if (!rtpSender) {
		            throw new Error('RTCRtpSender not found');
		        }
		        return rtpSender.getStats();
		    }
		    async sendDataChannel(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    options) {
		        throw new errors_1.UnsupportedError('not implemented');
		    }
		    async receive(optionsList) {
		        const results = [];
		        for (const options of optionsList) {
		            const { trackId, kind } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		        }
		        if (!this._transportReady) {
		            await this.setupTransport({ localDtlsRole: 'server' });
		        }
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters } = options;
		            logger.debug('receive() | calling new RTCRtpReceiver()');
		            const rtpReceiver = new RTCRtpReceiver(this._dtlsTransport, kind);
		            rtpReceiver.addEventListener('error', (event) => {
		                logger.error('rtpReceiver "error" event [event:%o]', event);
		            });
		            // NOTE: Convert our standard RTCRtpParameters into those that Edge
		            // expects.
		            const edgeRtpParameters = edgeUtils.mangleRtpParameters(rtpParameters);
		            logger.debug('receive() | calling rtpReceiver.receive() [params:%o]', edgeRtpParameters);
		            await rtpReceiver.receive(edgeRtpParameters);
		            const localId = trackId;
		            // Store it.
		            this._rtpReceivers.set(localId, rtpReceiver);
		            results.push({
		                localId,
		                track: rtpReceiver.track,
		                rtpReceiver,
		            });
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const rtpReceiver = this._rtpReceivers.get(localId);
		            if (!rtpReceiver) {
		                throw new Error('RTCRtpReceiver not found');
		            }
		            this._rtpReceivers.delete(localId);
		            try {
		                logger.debug('stopReceiving() | calling rtpReceiver.stop()');
		                rtpReceiver.stop();
		            }
		            catch (error) {
		                logger.warn('stopReceiving() | rtpReceiver.stop() failed:%o', error);
		            }
		        }
		    }
		    async pauseReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    async resumeReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    async getReceiverStats(localId) {
		        const rtpReceiver = this._rtpReceivers.get(localId);
		        if (!rtpReceiver) {
		            throw new Error('RTCRtpReceiver not found');
		        }
		        return rtpReceiver.getStats();
		    }
		    async receiveDataChannel(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    options) {
		        throw new errors_1.UnsupportedError('not implemented');
		    }
		    setIceGatherer({ iceServers, iceTransportPolicy, }) {
		        // @ts-expect-error --- On purpose
		        const iceGatherer = new RTCIceGatherer({
		            iceServers: iceServers ?? [],
		            gatherPolicy: iceTransportPolicy ?? 'all',
		        });
		        iceGatherer.addEventListener('error', (event) => {
		            logger.error('iceGatherer "error" event [event:%o]', event);
		        });
		        // NOTE: Not yet implemented by Edge, which starts gathering automatically.
		        try {
		            iceGatherer.gather();
		        }
		        catch (error) {
		            logger.debug('setIceGatherer() | iceGatherer.gather() failed: %s', error.toString());
		        }
		        this._iceGatherer = iceGatherer;
		    }
		    setIceTransport() {
		        const iceTransport = new RTCIceTransport(this._iceGatherer);
		        // NOTE: Not yet implemented by Edge.
		        iceTransport.addEventListener('statechange', () => {
		            switch (iceTransport.state) {
		                case 'checking': {
		                    this.emit('@connectionstatechange', 'connecting');
		                    break;
		                }
		                case 'connected':
		                case 'completed': {
		                    this.emit('@connectionstatechange', 'connected');
		                    break;
		                }
		                case 'failed': {
		                    this.emit('@connectionstatechange', 'failed');
		                    break;
		                }
		                case 'disconnected': {
		                    this.emit('@connectionstatechange', 'disconnected');
		                    break;
		                }
		                case 'closed': {
		                    this.emit('@connectionstatechange', 'closed');
		                    break;
		                }
		            }
		        });
		        // NOTE: Not standard, but implemented by Edge.
		        iceTransport.addEventListener('icestatechange', () => {
		            switch (iceTransport.state) {
		                case 'checking': {
		                    this.emit('@connectionstatechange', 'connecting');
		                    break;
		                }
		                case 'connected':
		                case 'completed': {
		                    this.emit('@connectionstatechange', 'connected');
		                    break;
		                }
		                case 'failed': {
		                    this.emit('@connectionstatechange', 'failed');
		                    break;
		                }
		                case 'disconnected': {
		                    this.emit('@connectionstatechange', 'disconnected');
		                    break;
		                }
		                case 'closed': {
		                    this.emit('@connectionstatechange', 'closed');
		                    break;
		                }
		            }
		        });
		        iceTransport.addEventListener('candidatepairchange', (event) => {
		            logger.debug('iceTransport "candidatepairchange" event [pair:%o]', event.pair);
		        });
		        this._iceTransport = iceTransport;
		    }
		    setDtlsTransport() {
		        const dtlsTransport = new RTCDtlsTransport(this._iceTransport);
		        // NOTE: Not yet implemented by Edge.
		        dtlsTransport.addEventListener('statechange', () => {
		            logger.debug('dtlsTransport "statechange" event [state:%s]', dtlsTransport.state);
		        });
		        // NOTE: Not standard, but implemented by Edge.
		        dtlsTransport.addEventListener('dtlsstatechange', () => {
		            logger.debug('dtlsTransport "dtlsstatechange" event [state:%s]', dtlsTransport.state);
		            if (dtlsTransport.state === 'closed') {
		                this.emit('@connectionstatechange', 'closed');
		            }
		        });
		        dtlsTransport.addEventListener('error', (event) => {
		            logger.error('dtlsTransport "error" event [event:%o]', event);
		        });
		        this._dtlsTransport = dtlsTransport;
		    }
		    async setupTransport({ localDtlsRole, }) {
		        logger.debug('setupTransport()');
		        // Get our local DTLS parameters.
		        const dtlsParameters = this._dtlsTransport.getLocalParameters();
		        dtlsParameters.role = localDtlsRole;
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        // Start the RTCIceTransport.
		        this._iceTransport.start(this._iceGatherer, this._remoteIceParameters, 'controlling');
		        // Add remote ICE candidates.
		        for (const candidate of this._remoteIceCandidates) {
		            this._iceTransport.addRemoteCandidate(candidate);
		        }
		        // Also signal a 'complete' candidate as per spec.
		        // NOTE: It should be {complete: true} but Edge prefers {}.
		        // NOTE: If we don't signal end of candidates, the Edge RTCIceTransport
		        // won't enter the 'completed' state.
		        this._iceTransport.addRemoteCandidate({});
		        // NOTE: Edge does not like SHA less than 256.
		        this._remoteDtlsParameters.fingerprints =
		            this._remoteDtlsParameters.fingerprints.filter((fingerprint) => {
		                return (fingerprint.algorithm === 'sha-256' ||
		                    fingerprint.algorithm === 'sha-384' ||
		                    fingerprint.algorithm === 'sha-512');
		            });
		        // Start the RTCDtlsTransport.
		        this._dtlsTransport.start(this._remoteDtlsParameters);
		        this._transportReady = true;
		    }
		};
		Edge11.Edge11 = Edge11$1;
		return Edge11;
	}

	var ReactNativeUnifiedPlan = {};

	var hasRequiredReactNativeUnifiedPlan;

	function requireReactNativeUnifiedPlan () {
		if (hasRequiredReactNativeUnifiedPlan) return ReactNativeUnifiedPlan;
		hasRequiredReactNativeUnifiedPlan = 1;
		Object.defineProperty(ReactNativeUnifiedPlan, "__esModule", { value: true });
		ReactNativeUnifiedPlan.ReactNativeUnifiedPlan = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpUnifiedPlanUtils = requireUnifiedPlanUtils();
		const ortcUtils = requireUtils$1();
		const errors_1 = requireErrors$1();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const scalabilityModes_1 = requireScalabilityModes();
		const logger = new Logger_1.Logger('ReactNativeUnifiedPlan');
		const NAME = 'ReactNativeUnifiedPlan';
		const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };
		let ReactNativeUnifiedPlan$1 = class ReactNativeUnifiedPlan extends HandlerInterface_1.HandlerInterface {
		    // Closed flag.
		    _closed = false;
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // Initial server side DTLS role. If not 'auto', it will force the opposite
		    // value in client side.
		    _forcedLocalDtlsRole;
		    // RTCPeerConnection instance.
		    _pc;
		    // Map of RTCTransceivers indexed by MID.
		    _mapMidTransceiver = new Map();
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new ReactNativeUnifiedPlan();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        if (this._closed) {
		            return;
		        }
		        this._closed = true;
		        // Free/dispose native MediaStream but DO NOT free/dispose native
		        // MediaStreamTracks (that is parent's business).
		        // @ts-expect-error --- Proprietary API in react-native-webrtc.
		        this._sendStream.release(/* releaseTracks */ false);
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'unified-plan',
		        });
		        try {
		            pc.addTransceiver('audio');
		            pc.addTransceiver('video');
		            const offer = await pc.createOffer();
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            // libwebrtc supports NACK for OPUS but doesn't announce it.
		            ortcUtils.addNackSupportForOpus(nativeRtpCapabilities);
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        this.assertNotClosed();
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        if (dtlsParameters.role && dtlsParameters.role !== 'auto') {
		            this._forcedLocalDtlsRole =
		                dtlsParameters.role === 'server' ? 'client' : 'server';
		        }
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'unified-plan',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    async updateIceServers(iceServers) {
		        this.assertNotClosed();
		        logger.debug('updateIceServers()');
		        const configuration = this._pc.getConfiguration();
		        configuration.iceServers = iceServers;
		        this._pc.setConfiguration(configuration);
		    }
		    async restartIce(iceParameters) {
		        this.assertNotClosed();
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        this.assertNotClosed();
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, onRtpSender, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (encodings && encodings.length > 1) {
		            encodings.forEach((encoding, idx) => {
		                encoding.rid = `r${idx}`;
		            });
		        }
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs, codec);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        // This may throw.
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs, codec);
		        const mediaSectionIdx = this._remoteSdp.getNextMediaSectionIdx();
		        const transceiver = this._pc.addTransceiver(track, {
		            direction: 'sendonly',
		            streams: [this._sendStream],
		            sendEncodings: encodings,
		        });
		        if (onRtpSender) {
		            onRtpSender(transceiver.sender);
		        }
		        let offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        let offerMediaObject;
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        // Special case for VP9 with SVC.
		        let hackVp9Svc = false;
		        const layers = (0, scalabilityModes_1.parse)((encodings ?? [{}])[0].scalabilityMode);
		        if (encodings &&
		            encodings.length === 1 &&
		            layers.spatialLayers > 1 &&
		            sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp9') {
		            logger.debug('send() | enabling legacy simulcast for VP9 SVC');
		            hackVp9Svc = true;
		            localSdpObject = sdpTransform.parse(offer.sdp);
		            offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
		            sdpUnifiedPlanUtils.addLegacySimulcast({
		                offerMediaObject,
		                numStreams: layers.spatialLayers,
		            });
		            offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        // We can now get the transceiver.mid.
		        // NOTE: We cannot read generated MID on iOS react-native-webrtc 111.0.0
		        // because transceiver.mid is not available until setRemoteDescription()
		        // is called, so this is best effort.
		        // Issue: https://github.com/react-native-webrtc/react-native-webrtc/issues/1404
		        // NOTE: So let's fill MID in sendingRtpParameters later.
		        // NOTE: This is fixed in react-native-webrtc 111.0.3.
		        let localId = transceiver.mid ?? undefined;
		        if (!localId) {
		            logger.warn('send() | missing transceiver.mid (bug in react-native-webrtc, using a workaround');
		        }
		        // Set MID.
		        // NOTE: As per above, it could be unset yet.
		        sendingRtpParameters.mid = localId;
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        offerMediaObject = localSdpObject.media[mediaSectionIdx.idx];
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings by parsing the SDP offer if no encodings are given.
		        if (!encodings) {
		            sendingRtpParameters.encodings = sdpUnifiedPlanUtils.getRtpEncodings({
		                offerMediaObject,
		            });
		        }
		        // Set RTP encodings by parsing the SDP offer and complete them with given
		        // one if just a single encoding has been given.
		        else if (encodings.length === 1) {
		            let newEncodings = sdpUnifiedPlanUtils.getRtpEncodings({
		                offerMediaObject,
		            });
		            Object.assign(newEncodings[0], encodings[0]);
		            // Hack for VP9 SVC.
		            if (hackVp9Svc) {
		                newEncodings = [newEncodings[0]];
		            }
		            sendingRtpParameters.encodings = newEncodings;
		        }
		        // Otherwise if more than 1 encoding are given use them verbatim.
		        else {
		            sendingRtpParameters.encodings = encodings;
		        }
		        // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		        // each encoding.
		        if (sendingRtpParameters.encodings.length > 1 &&
		            (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
		                sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
		            for (const encoding of sendingRtpParameters.encodings) {
		                if (encoding.scalabilityMode) {
		                    encoding.scalabilityMode = `L1T${layers.temporalLayers}`;
		                }
		                else {
		                    encoding.scalabilityMode = 'L1T3';
		                }
		            }
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            reuseMid: mediaSectionIdx.reuseMid,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        // Follow up of iOS react-native-webrtc 111.0.0 issue told above. Now yes,
		        // we can read generated MID (if not done above) and fill sendingRtpParameters.
		        // NOTE: This is fixed in react-native-webrtc 111.0.3 so this block isn't
		        // needed starting from that version.
		        if (!localId) {
		            localId = transceiver.mid;
		            sendingRtpParameters.mid = localId;
		        }
		        // Store in the map.
		        this._mapMidTransceiver.set(localId, transceiver);
		        return {
		            localId,
		            rtpParameters: sendingRtpParameters,
		            rtpSender: transceiver.sender,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        if (this._closed) {
		            return;
		        }
		        logger.debug('stopSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        void transceiver.sender.replaceTrack(null);
		        this._pc.removeTrack(transceiver.sender);
		        const mediaSectionClosed = this._remoteSdp.closeMediaSection(transceiver.mid);
		        if (mediaSectionClosed) {
		            try {
		                transceiver.stop();
		            }
		            catch (error) { }
		        }
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        this._mapMidTransceiver.delete(localId);
		    }
		    async pauseSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('pauseSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'inactive';
		        this._remoteSdp.pauseMediaSection(localId);
		        const offer = await this._pc.createOffer();
		        logger.debug('pauseSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async resumeSending(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('resumeSending() [localId:%s]', localId);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        this._remoteSdp.resumeSendingMediaSection(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        transceiver.direction = 'sendonly';
		        const offer = await this._pc.createOffer();
		        logger.debug('resumeSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async replaceTrack(localId, track) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        await transceiver.sender.replaceTrack(track);
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            if (idx <= spatialLayer) {
		                encoding.active = true;
		            }
		            else {
		                encoding.active = false;
		            }
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setMaxSpatialLayer() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setMaxSpatialLayer() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        const parameters = transceiver.sender.getParameters();
		        parameters.encodings.forEach((encoding, idx) => {
		            parameters.encodings[idx] = { ...encoding, ...params };
		        });
		        await transceiver.sender.setParameters(parameters);
		        this._remoteSdp.muxMediaSectionSimulcast(localId, parameters.encodings);
		        const offer = await this._pc.createOffer();
		        logger.debug('setRtpEncodingParameters() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('setRtpEncodingParameters() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    async getSenderStats(localId) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.sender.getStats();
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const results = [];
		        const mapLocalId = new Map();
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters, streamId } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const localId = rtpParameters.mid ?? String(this._mapMidTransceiver.size);
		            mapLocalId.set(trackId, localId);
		            this._remoteSdp.receive({
		                mid: localId,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId: streamId ?? rtpParameters.rtcp.cname,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        for (const options of optionsList) {
		            const { trackId, onRtpReceiver } = options;
		            if (onRtpReceiver) {
		                const localId = mapLocalId.get(trackId);
		                const transceiver = this._pc
		                    .getTransceivers()
		                    .find((t) => t.mid === localId);
		                if (!transceiver) {
		                    throw new Error('transceiver not found');
		                }
		                onRtpReceiver(transceiver.receiver);
		            }
		        }
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { trackId, rtpParameters } = options;
		            const localId = mapLocalId.get(trackId);
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === localId);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		        }
		        answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { trackId } = options;
		            const localId = mapLocalId.get(trackId);
		            const transceiver = this._pc
		                .getTransceivers()
		                .find((t) => t.mid === localId);
		            if (!transceiver) {
		                throw new Error('new RTCRtpTransceiver not found');
		            }
		            else {
		                // Store in the map.
		                this._mapMidTransceiver.set(localId, transceiver);
		                results.push({
		                    localId,
		                    track: transceiver.receiver.track,
		                    rtpReceiver: transceiver.receiver,
		                });
		            }
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        if (this._closed) {
		            return;
		        }
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            this._remoteSdp.closeMediaSection(transceiver.mid);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const localId of localIds) {
		            this._mapMidTransceiver.delete(localId);
		        }
		    }
		    async pauseReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('pauseReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'inactive';
		            this._remoteSdp.pauseMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('pauseReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('pauseReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async resumeReceiving(localIds) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('resumeReceiving() [localId:%s]', localId);
		            const transceiver = this._mapMidTransceiver.get(localId);
		            if (!transceiver) {
		                throw new Error('associated RTCRtpTransceiver not found');
		            }
		            transceiver.direction = 'recvonly';
		            this._remoteSdp.resumeReceivingMediaSection(localId);
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('resumeReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('resumeReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async getReceiverStats(localId) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const transceiver = this._mapMidTransceiver.get(localId);
		        if (!transceiver) {
		            throw new Error('associated RTCRtpTransceiver not found');
		        }
		        return transceiver.receiver.getStats();
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertNotClosed();
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits, } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation();
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertNotClosed() {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('method called in a closed handler');
		        }
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		ReactNativeUnifiedPlan.ReactNativeUnifiedPlan = ReactNativeUnifiedPlan$1;
		return ReactNativeUnifiedPlan;
	}

	var ReactNative = {};

	var hasRequiredReactNative;

	function requireReactNative () {
		if (hasRequiredReactNative) return ReactNative;
		hasRequiredReactNative = 1;
		Object.defineProperty(ReactNative, "__esModule", { value: true });
		ReactNative.ReactNative = void 0;
		const sdpTransform = requireLib$2();
		const Logger_1 = requireLogger$2();
		const errors_1 = requireErrors$1();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const sdpCommonUtils = requireCommonUtils();
		const sdpPlanBUtils = requirePlanBUtils();
		const HandlerInterface_1 = requireHandlerInterface();
		const RemoteSdp_1 = requireRemoteSdp();
		const logger = new Logger_1.Logger('ReactNative');
		const NAME = 'ReactNative';
		const SCTP_NUM_STREAMS = { OS: 1024, MIS: 1024 };
		let ReactNative$1 = class ReactNative extends HandlerInterface_1.HandlerInterface {
		    // Handler direction.
		    _direction;
		    // Remote SDP handler.
		    _remoteSdp;
		    // Generic sending RTP parameters for audio and video.
		    _sendingRtpParametersByKind;
		    // Generic sending RTP parameters for audio and video suitable for the SDP
		    // remote answer.
		    _sendingRemoteRtpParametersByKind;
		    // Initial server side DTLS role. If not 'auto', it will force the opposite
		    // value in client side.
		    _forcedLocalDtlsRole;
		    // RTCPeerConnection instance.
		    _pc;
		    // Local stream for sending.
		    _sendStream = new MediaStream();
		    // Map of sending MediaStreamTracks indexed by localId.
		    _mapSendLocalIdTrack = new Map();
		    // Next sending localId.
		    _nextSendLocalId = 0;
		    // Map of MID, RTP parameters and RTCRtpReceiver indexed by local id.
		    // Value is an Object with mid, rtpParameters and rtpReceiver.
		    _mapRecvLocalIdInfo = new Map();
		    // Whether a DataChannel m=application section has been created.
		    _hasDataChannelMediaSection = false;
		    // Sending DataChannel id value counter. Incremented for each new DataChannel.
		    _nextSendSctpStreamId = 0;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory() {
		        return () => new ReactNative();
		    }
		    constructor() {
		        super();
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        // Free/dispose native MediaStream but DO NOT free/dispose native
		        // MediaStreamTracks (that is parent's business).
		        // @ts-expect-error --- Proprietary API in react-native-webrtc.
		        this._sendStream.release(/* releaseTracks */ false);
		        // Close RTCPeerConnection.
		        if (this._pc) {
		            try {
		                this._pc.close();
		            }
		            catch (error) { }
		        }
		        this.emit('@close');
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        const pc = new RTCPeerConnection({
		            iceServers: [],
		            iceTransportPolicy: 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'plan-b',
		        });
		        try {
		            const offer = await pc.createOffer({
		                offerToReceiveAudio: true,
		                offerToReceiveVideo: true,
		            });
		            try {
		                pc.close();
		            }
		            catch (error) { }
		            const sdpObject = sdpTransform.parse(offer.sdp);
		            const nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities({
		                sdpObject,
		            });
		            return nativeRtpCapabilities;
		        }
		        catch (error) {
		            try {
		                pc.close();
		            }
		            catch (error2) { }
		            throw error;
		        }
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return {
		            numStreams: SCTP_NUM_STREAMS,
		        };
		    }
		    run({ direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, extendedRtpCapabilities, }) {
		        logger.debug('run()');
		        this._direction = direction;
		        this._remoteSdp = new RemoteSdp_1.RemoteSdp({
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		            planB: true,
		        });
		        this._sendingRtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		        this._sendingRemoteRtpParametersByKind = {
		            audio: ortc.getSendingRemoteRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRemoteRtpParameters('video', extendedRtpCapabilities),
		        };
		        if (dtlsParameters.role && dtlsParameters.role !== 'auto') {
		            this._forcedLocalDtlsRole =
		                dtlsParameters.role === 'server' ? 'client' : 'server';
		        }
		        this._pc = new RTCPeerConnection({
		            iceServers: iceServers ?? [],
		            iceTransportPolicy: iceTransportPolicy ?? 'all',
		            bundlePolicy: 'max-bundle',
		            rtcpMuxPolicy: 'require',
		            sdpSemantics: 'plan-b',
		            ...additionalSettings,
		        }, proprietaryConstraints);
		        this._pc.addEventListener('icegatheringstatechange', () => {
		            this.emit('@icegatheringstatechange', this._pc.iceGatheringState);
		        });
		        this._pc.addEventListener('icecandidateerror', (event) => {
		            this.emit('@icecandidateerror', event);
		        });
		        if (this._pc.connectionState) {
		            this._pc.addEventListener('connectionstatechange', () => {
		                this.emit('@connectionstatechange', this._pc.connectionState);
		            });
		        }
		        else {
		            this._pc.addEventListener('iceconnectionstatechange', () => {
		                logger.warn('run() | pc.connectionState not supported, using pc.iceConnectionState');
		                switch (this._pc.iceConnectionState) {
		                    case 'checking': {
		                        this.emit('@connectionstatechange', 'connecting');
		                        break;
		                    }
		                    case 'connected':
		                    case 'completed': {
		                        this.emit('@connectionstatechange', 'connected');
		                        break;
		                    }
		                    case 'failed': {
		                        this.emit('@connectionstatechange', 'failed');
		                        break;
		                    }
		                    case 'disconnected': {
		                        this.emit('@connectionstatechange', 'disconnected');
		                        break;
		                    }
		                    case 'closed': {
		                        this.emit('@connectionstatechange', 'closed');
		                        break;
		                    }
		                }
		            });
		        }
		    }
		    async updateIceServers(iceServers) {
		        logger.debug('updateIceServers()');
		        const configuration = this._pc.getConfiguration();
		        configuration.iceServers = iceServers;
		        this._pc.setConfiguration(configuration);
		    }
		    async restartIce(iceParameters) {
		        logger.debug('restartIce()');
		        // Provide the remote SDP handler with new remote ICE parameters.
		        this._remoteSdp.updateIceParameters(iceParameters);
		        if (!this._transportReady) {
		            return;
		        }
		        if (this._direction === 'send') {
		            const offer = await this._pc.createOffer({ iceRestart: true });
		            logger.debug('restartIce() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		        }
		        else {
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('restartIce() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            logger.debug('restartIce() | calling pc.setLocalDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		        }
		    }
		    async getTransportStats() {
		        return this._pc.getStats();
		    }
		    async send({ track, encodings, codecOptions, codec, }) {
		        this.assertSendDirection();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (codec) {
		            logger.warn('send() | codec selection is not available in %s handler', this.name);
		        }
		        this._sendStream.addTrack(track);
		        this._pc.addStream(this._sendStream);
		        let offer = await this._pc.createOffer();
		        let localSdpObject = sdpTransform.parse(offer.sdp);
		        // @ts-expect-error --- sdpTransform.SessionDescription type doesn't
		        // define extmapAllowMixed field.
		        if (localSdpObject.extmapAllowMixed) {
		            this._remoteSdp.setSessionExtmapAllowMixed();
		        }
		        let offerMediaObject;
		        const sendingRtpParameters = utils.clone(this._sendingRtpParametersByKind[track.kind]);
		        sendingRtpParameters.codecs = ortc.reduceCodecs(sendingRtpParameters.codecs);
		        const sendingRemoteRtpParameters = utils.clone(this._sendingRemoteRtpParametersByKind[track.kind]);
		        sendingRemoteRtpParameters.codecs = ortc.reduceCodecs(sendingRemoteRtpParameters.codecs);
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        if (track.kind === 'video' && encodings && encodings.length > 1) {
		            logger.debug('send() | enabling simulcast');
		            localSdpObject = sdpTransform.parse(offer.sdp);
		            offerMediaObject = localSdpObject.media.find((m) => m.type === 'video');
		            sdpPlanBUtils.addLegacySimulcast({
		                offerMediaObject,
		                track,
		                numStreams: encodings.length,
		            });
		            offer = { type: 'offer', sdp: sdpTransform.write(localSdpObject) };
		        }
		        logger.debug('send() | calling pc.setLocalDescription() [offer:%o]', offer);
		        await this._pc.setLocalDescription(offer);
		        localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        offerMediaObject = localSdpObject.media.find((m) => m.type === track.kind);
		        // Set RTCP CNAME.
		        sendingRtpParameters.rtcp.cname = sdpCommonUtils.getCname({
		            offerMediaObject,
		        });
		        // Set RTP encodings.
		        sendingRtpParameters.encodings = sdpPlanBUtils.getRtpEncodings({
		            offerMediaObject,
		            track,
		        });
		        // Complete encodings with given values.
		        if (encodings) {
		            for (let idx = 0; idx < sendingRtpParameters.encodings.length; ++idx) {
		                if (encodings[idx]) {
		                    Object.assign(sendingRtpParameters.encodings[idx], encodings[idx]);
		                }
		            }
		        }
		        // If VP8 or H264 and there is effective simulcast, add scalabilityMode to
		        // each encoding.
		        if (sendingRtpParameters.encodings.length > 1 &&
		            (sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/vp8' ||
		                sendingRtpParameters.codecs[0].mimeType.toLowerCase() === 'video/h264')) {
		            for (const encoding of sendingRtpParameters.encodings) {
		                encoding.scalabilityMode = 'L1T3';
		            }
		        }
		        this._remoteSdp.send({
		            offerMediaObject,
		            offerRtpParameters: sendingRtpParameters,
		            answerRtpParameters: sendingRemoteRtpParameters,
		            codecOptions,
		        });
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('send() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		        const localId = String(this._nextSendLocalId);
		        this._nextSendLocalId++;
		        // Insert into the map.
		        this._mapSendLocalIdTrack.set(localId, track);
		        return {
		            localId: localId,
		            rtpParameters: sendingRtpParameters,
		        };
		    }
		    async stopSending(localId) {
		        this.assertSendDirection();
		        logger.debug('stopSending() [localId:%s]', localId);
		        const track = this._mapSendLocalIdTrack.get(localId);
		        if (!track) {
		            throw new Error('track not found');
		        }
		        this._mapSendLocalIdTrack.delete(localId);
		        this._sendStream.removeTrack(track);
		        this._pc.addStream(this._sendStream);
		        const offer = await this._pc.createOffer();
		        logger.debug('stopSending() | calling pc.setLocalDescription() [offer:%o]', offer);
		        try {
		            await this._pc.setLocalDescription(offer);
		        }
		        catch (error) {
		            // NOTE: If there are no sending tracks, setLocalDescription() will fail with
		            // "Failed to create channels". If so, ignore it.
		            if (this._sendStream.getTracks().length === 0) {
		                logger.warn('stopSending() | ignoring expected error due no sending tracks: %s', error.toString());
		                return;
		            }
		            throw error;
		        }
		        if (this._pc.signalingState === 'stable') {
		            return;
		        }
		        const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopSending() | calling pc.setRemoteDescription() [answer:%o]', answer);
		        await this._pc.setRemoteDescription(answer);
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async pauseSending(localId) {
		        // Unimplemented.
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async resumeSending(localId) {
		        // Unimplemented.
		    }
		    async replaceTrack(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localId, 
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    track) {
		        throw new errors_1.UnsupportedError('not implemented');
		    }
		    async setMaxSpatialLayer(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localId, 
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    spatialLayer) {
		        throw new errors_1.UnsupportedError('not implemented');
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async setRtpEncodingParameters(localId, params) {
		        throw new errors_1.UnsupportedError('not implemented');
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async getSenderStats(localId) {
		        throw new errors_1.UnsupportedError('not implemented');
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertSendDirection();
		        const options = {
		            negotiated: true,
		            id: this._nextSendSctpStreamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmitTime: maxPacketLifeTime, // NOTE: Old spec.
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('sendDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // Increase next id.
		        this._nextSendSctpStreamId =
		            ++this._nextSendSctpStreamId % SCTP_NUM_STREAMS.MIS;
		        // If this is the first DataChannel we need to create the SDP answer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            const offer = await this._pc.createOffer();
		            const localSdpObject = sdpTransform.parse(offer.sdp);
		            const offerMediaObject = localSdpObject.media.find((m) => m.type === 'application');
		            if (!this._transportReady) {
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('sendDataChannel() | calling pc.setLocalDescription() [offer:%o]', offer);
		            await this._pc.setLocalDescription(offer);
		            this._remoteSdp.sendSctpAssociation({ offerMediaObject });
		            const answer = { type: 'answer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('sendDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setRemoteDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        const sctpStreamParameters = {
		            streamId: options.id,
		            ordered: options.ordered,
		            maxPacketLifeTime: options.maxPacketLifeTime,
		            maxRetransmits: options.maxRetransmits,
		        };
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertRecvDirection();
		        const results = [];
		        const mapStreamId = new Map();
		        for (const options of optionsList) {
		            const { trackId, kind, rtpParameters } = options;
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const mid = kind;
		            let streamId = options.streamId ?? rtpParameters.rtcp.cname;
		            // NOTE: In React-Native we cannot reuse the same remote MediaStream for new
		            // remote tracks. This is because react-native-webrtc does not react on new
		            // tracks generated within already existing streams, so force the streamId
		            // to be different. See:
		            // https://github.com/react-native-webrtc/react-native-webrtc/issues/401
		            logger.debug('receive() | forcing a random remote streamId to avoid well known bug in react-native-webrtc');
		            streamId += `-hack-${utils.generateRandomNumber()}`;
		            mapStreamId.set(trackId, streamId);
		            this._remoteSdp.receive({
		                mid,
		                kind,
		                offerRtpParameters: rtpParameters,
		                streamId,
		                trackId,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('receive() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        let answer = await this._pc.createAnswer();
		        const localSdpObject = sdpTransform.parse(answer.sdp);
		        for (const options of optionsList) {
		            const { kind, rtpParameters } = options;
		            const mid = kind;
		            const answerMediaObject = localSdpObject.media.find((m) => String(m.mid) === mid);
		            // May need to modify codec parameters in the answer based on codec
		            // parameters in the offer.
		            sdpCommonUtils.applyCodecParameters({
		                offerRtpParameters: rtpParameters,
		                answerMediaObject,
		            });
		        }
		        answer = { type: 'answer', sdp: sdpTransform.write(localSdpObject) };
		        if (!this._transportReady) {
		            await this.setupTransport({
		                localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                localSdpObject,
		            });
		        }
		        logger.debug('receive() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		        for (const options of optionsList) {
		            const { kind, trackId, rtpParameters } = options;
		            const localId = trackId;
		            const mid = kind;
		            const streamId = mapStreamId.get(trackId);
		            const stream = this._pc
		                .getRemoteStreams()
		                .find((s) => s.id === streamId);
		            const track = stream.getTrackById(localId);
		            if (!track) {
		                throw new Error('remote track not found');
		            }
		            // Insert into the map.
		            this._mapRecvLocalIdInfo.set(localId, { mid, rtpParameters });
		            results.push({ localId, track });
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        this.assertRecvDirection();
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            const { mid, rtpParameters } = this._mapRecvLocalIdInfo.get(localId) ?? {};
		            // Remove from the map.
		            this._mapRecvLocalIdInfo.delete(localId);
		            this._remoteSdp.planBStopReceiving({
		                mid: mid,
		                offerRtpParameters: rtpParameters,
		            });
		        }
		        const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		        logger.debug('stopReceiving() | calling pc.setRemoteDescription() [offer:%o]', offer);
		        await this._pc.setRemoteDescription(offer);
		        const answer = await this._pc.createAnswer();
		        logger.debug('stopReceiving() | calling pc.setLocalDescription() [answer:%o]', answer);
		        await this._pc.setLocalDescription(answer);
		    }
		    async pauseReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    async resumeReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        // Unimplemented.
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async getReceiverStats(localId) {
		        throw new errors_1.UnsupportedError('not implemented');
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertRecvDirection();
		        const { streamId, ordered, maxPacketLifeTime, maxRetransmits } = sctpStreamParameters;
		        const options = {
		            negotiated: true,
		            id: streamId,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmitTime: maxPacketLifeTime, // NOTE: Old spec.
		            maxRetransmits,
		            protocol,
		        };
		        logger.debug('receiveDataChannel() [options:%o]', options);
		        const dataChannel = this._pc.createDataChannel(label, options);
		        // If this is the first DataChannel we need to create the SDP offer with
		        // m=application section.
		        if (!this._hasDataChannelMediaSection) {
		            this._remoteSdp.receiveSctpAssociation({ oldDataChannelSpec: true });
		            const offer = { type: 'offer', sdp: this._remoteSdp.getSdp() };
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [offer:%o]', offer);
		            await this._pc.setRemoteDescription(offer);
		            const answer = await this._pc.createAnswer();
		            if (!this._transportReady) {
		                const localSdpObject = sdpTransform.parse(answer.sdp);
		                await this.setupTransport({
		                    localDtlsRole: this._forcedLocalDtlsRole ?? 'client',
		                    localSdpObject,
		                });
		            }
		            logger.debug('receiveDataChannel() | calling pc.setRemoteDescription() [answer:%o]', answer);
		            await this._pc.setLocalDescription(answer);
		            this._hasDataChannelMediaSection = true;
		        }
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, localSdpObject, }) {
		        if (!localSdpObject) {
		            localSdpObject = sdpTransform.parse(this._pc.localDescription.sdp);
		        }
		        // Get our local DTLS parameters.
		        const dtlsParameters = sdpCommonUtils.extractDtlsParameters({
		            sdpObject: localSdpObject,
		        });
		        // Set our DTLS role.
		        dtlsParameters.role = localDtlsRole;
		        // Update the remote DTLS role in the SDP.
		        this._remoteSdp.updateDtlsRole(localDtlsRole === 'client' ? 'server' : 'client');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => {
		            this.safeEmit('@connect', { dtlsParameters }, resolve, reject);
		        });
		        this._transportReady = true;
		    }
		    assertSendDirection() {
		        if (this._direction !== 'send') {
		            throw new Error('method can just be called for handlers with "send" direction');
		        }
		    }
		    assertRecvDirection() {
		        if (this._direction !== 'recv') {
		            throw new Error('method can just be called for handlers with "recv" direction');
		        }
		    }
		};
		ReactNative.ReactNative = ReactNative$1;
		return ReactNative;
	}

	var hasRequiredDevice;

	function requireDevice () {
		if (hasRequiredDevice) return Device;
		hasRequiredDevice = 1;
		Object.defineProperty(Device, "__esModule", { value: true });
		Device.Device = void 0;
		Device.detectDeviceAsync = detectDeviceAsync;
		Device.detectDevice = detectDevice;
		const ua_parser_js_1 = requireUaParser();
		const Logger_1 = requireLogger$2();
		const enhancedEvents_1 = requireEnhancedEvents();
		const errors_1 = requireErrors$1();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const Transport_1 = requireTransport();
		const Chrome111_1 = requireChrome111();
		const Chrome74_1 = requireChrome74();
		const Chrome70_1 = requireChrome70();
		const Chrome67_1 = requireChrome67();
		const Chrome55_1 = requireChrome55();
		const Firefox120_1 = requireFirefox120();
		const Firefox60_1 = requireFirefox60();
		const Safari12_1 = requireSafari12();
		const Safari11_1 = requireSafari11();
		const Edge11_1 = requireEdge11();
		const ReactNativeUnifiedPlan_1 = requireReactNativeUnifiedPlan();
		const ReactNative_1 = requireReactNative();
		const logger = new Logger_1.Logger('Device');
		/**
		 * Async mediasoup-client Handler detection. More powerful than
		 * `detectDevice()`.
		 */
		async function detectDeviceAsync(userAgent) {
		    logger.debug('detectDeviceAsync() [userAgent:%s]', userAgent);
		    if (!userAgent && typeof navigator === 'object') {
		        userAgent = navigator.userAgent;
		    }
		    const uaParserResult = await (0, ua_parser_js_1.UAParser)(userAgent).withFeatureCheck();
		    return detectDeviceImpl(uaParserResult);
		}
		/**
		 * Sync mediasoup-client Handler detection.
		 *
		 * @deprecated It only relies on navigator.userAgent. Use `detectDeviceAsync()`
		 * instead.
		 */
		function detectDevice(userAgent) {
		    logger.debug('detectDevice() [userAgent:%s]', userAgent);
		    if (!userAgent && typeof navigator === 'object') {
		        userAgent = navigator.userAgent;
		    }
		    const uaParserResult = (0, ua_parser_js_1.UAParser)(userAgent);
		    return detectDeviceImpl(uaParserResult);
		}
		let Device$1 = class Device {
		    // RTC handler factory.
		    _handlerFactory;
		    // Handler name.
		    _handlerName;
		    // Loaded flag.
		    _loaded = false;
		    // Extended RTP capabilities.
		    _extendedRtpCapabilities;
		    // Local RTP capabilities for receiving media.
		    _recvRtpCapabilities;
		    // Whether we can produce audio/video based on computed extended RTP
		    // capabilities.
		    _canProduceByKind;
		    // Local SCTP capabilities.
		    _sctpCapabilities;
		    // Observer instance.
		    _observer = new enhancedEvents_1.EnhancedEventEmitter();
		    /**
		     * Create a new Device to connect to mediasoup server. It uses a more advanced
		     * device detection.
		     *
		     * @throws {UnsupportedError} if device is not supported.
		     */
		    static async factory({ handlerName, handlerFactory, } = {}) {
		        logger.debug('factory()');
		        if (handlerName && handlerFactory) {
		            throw new TypeError('just one of handlerName or handlerInterface can be given');
		        }
		        if (!handlerName && !handlerFactory) {
		            handlerName = await detectDeviceAsync();
		            if (!handlerName) {
		                throw new errors_1.UnsupportedError('device not supported');
		            }
		        }
		        return new Device({ handlerName, handlerFactory });
		    }
		    /**
		     * Create a new Device to connect to mediasoup server.
		     *
		     * @throws {UnsupportedError} if device is not supported.
		     */
		    constructor({ handlerName, handlerFactory } = {}) {
		        logger.debug('constructor()');
		        if (handlerName && handlerFactory) {
		            throw new TypeError('just one of handlerName or handlerInterface can be given');
		        }
		        if (handlerFactory) {
		            this._handlerFactory = handlerFactory;
		        }
		        else {
		            if (handlerName) {
		                logger.debug('constructor() | handler given: %s', handlerName);
		            }
		            else {
		                handlerName = detectDevice();
		                if (handlerName) {
		                    logger.debug('constructor() | detected handler: %s', handlerName);
		                }
		                else {
		                    throw new errors_1.UnsupportedError('device not supported');
		                }
		            }
		            switch (handlerName) {
		                case 'Chrome111': {
		                    this._handlerFactory = Chrome111_1.Chrome111.createFactory();
		                    break;
		                }
		                case 'Chrome74': {
		                    this._handlerFactory = Chrome74_1.Chrome74.createFactory();
		                    break;
		                }
		                case 'Chrome70': {
		                    this._handlerFactory = Chrome70_1.Chrome70.createFactory();
		                    break;
		                }
		                case 'Chrome67': {
		                    this._handlerFactory = Chrome67_1.Chrome67.createFactory();
		                    break;
		                }
		                case 'Chrome55': {
		                    this._handlerFactory = Chrome55_1.Chrome55.createFactory();
		                    break;
		                }
		                case 'Firefox120': {
		                    this._handlerFactory = Firefox120_1.Firefox120.createFactory();
		                    break;
		                }
		                case 'Firefox60': {
		                    this._handlerFactory = Firefox60_1.Firefox60.createFactory();
		                    break;
		                }
		                case 'Safari12': {
		                    this._handlerFactory = Safari12_1.Safari12.createFactory();
		                    break;
		                }
		                case 'Safari11': {
		                    this._handlerFactory = Safari11_1.Safari11.createFactory();
		                    break;
		                }
		                case 'Edge11': {
		                    this._handlerFactory = Edge11_1.Edge11.createFactory();
		                    break;
		                }
		                case 'ReactNativeUnifiedPlan': {
		                    this._handlerFactory = ReactNativeUnifiedPlan_1.ReactNativeUnifiedPlan.createFactory();
		                    break;
		                }
		                case 'ReactNative': {
		                    this._handlerFactory = ReactNative_1.ReactNative.createFactory();
		                    break;
		                }
		                default: {
		                    throw new TypeError(`unknown handlerName "${handlerName}"`);
		                }
		            }
		        }
		        // Create a temporal handler to get its name.
		        const handler = this._handlerFactory();
		        this._handlerName = handler.name;
		        handler.close();
		        this._extendedRtpCapabilities = undefined;
		        this._recvRtpCapabilities = undefined;
		        this._canProduceByKind = {
		            audio: false,
		            video: false,
		        };
		        this._sctpCapabilities = undefined;
		    }
		    /**
		     * The RTC handler name.
		     */
		    get handlerName() {
		        return this._handlerName;
		    }
		    /**
		     * Whether the Device is loaded.
		     */
		    get loaded() {
		        return this._loaded;
		    }
		    /**
		     * RTP capabilities of the Device for receiving media.
		     *
		     * @throws {InvalidStateError} if not loaded.
		     */
		    get rtpCapabilities() {
		        if (!this._loaded) {
		            throw new errors_1.InvalidStateError('not loaded');
		        }
		        return this._recvRtpCapabilities;
		    }
		    /**
		     * SCTP capabilities of the Device.
		     *
		     * @throws {InvalidStateError} if not loaded.
		     */
		    get sctpCapabilities() {
		        if (!this._loaded) {
		            throw new errors_1.InvalidStateError('not loaded');
		        }
		        return this._sctpCapabilities;
		    }
		    get observer() {
		        return this._observer;
		    }
		    /**
		     * Initialize the Device.
		     */
		    async load({ routerRtpCapabilities, preferLocalCodecsOrder = false, }) {
		        logger.debug('load() [routerRtpCapabilities:%o]', routerRtpCapabilities);
		        // Temporal handler to get its capabilities.
		        let handler;
		        try {
		            if (this._loaded) {
		                throw new errors_1.InvalidStateError('already loaded');
		            }
		            // Clone given router RTP capabilities to not modify input data.
		            const clonedRouterRtpCapabilities = utils.clone(routerRtpCapabilities);
		            // This may throw.
		            ortc.validateRtpCapabilities(clonedRouterRtpCapabilities);
		            handler = this._handlerFactory();
		            const nativeRtpCapabilities = await handler.getNativeRtpCapabilities();
		            logger.debug('load() | got native RTP capabilities:%o', nativeRtpCapabilities);
		            // Clone obtained native RTP capabilities to not modify input data.
		            const clonedNativeRtpCapabilities = utils.clone(nativeRtpCapabilities);
		            // This may throw.
		            ortc.validateRtpCapabilities(clonedNativeRtpCapabilities);
		            // Get extended RTP capabilities.
		            this._extendedRtpCapabilities = ortc.getExtendedRtpCapabilities(clonedNativeRtpCapabilities, clonedRouterRtpCapabilities, preferLocalCodecsOrder);
		            logger.debug('load() | got extended RTP capabilities:%o', this._extendedRtpCapabilities);
		            // Check whether we can produce audio/video.
		            this._canProduceByKind.audio = ortc.canSend('audio', this._extendedRtpCapabilities);
		            this._canProduceByKind.video = ortc.canSend('video', this._extendedRtpCapabilities);
		            // Generate our receiving RTP capabilities for receiving media.
		            this._recvRtpCapabilities = ortc.getRecvRtpCapabilities(this._extendedRtpCapabilities);
		            // This may throw.
		            ortc.validateRtpCapabilities(this._recvRtpCapabilities);
		            logger.debug('load() | got receiving RTP capabilities:%o', this._recvRtpCapabilities);
		            // Generate our SCTP capabilities.
		            this._sctpCapabilities = await handler.getNativeSctpCapabilities();
		            logger.debug('load() | got native SCTP capabilities:%o', this._sctpCapabilities);
		            // This may throw.
		            ortc.validateSctpCapabilities(this._sctpCapabilities);
		            logger.debug('load() succeeded');
		            this._loaded = true;
		            handler.close();
		        }
		        catch (error) {
		            if (handler) {
		                handler.close();
		            }
		            throw error;
		        }
		    }
		    /**
		     * Whether we can produce audio/video.
		     *
		     * @throws {InvalidStateError} if not loaded.
		     * @throws {TypeError} if wrong arguments.
		     */
		    canProduce(kind) {
		        if (!this._loaded) {
		            throw new errors_1.InvalidStateError('not loaded');
		        }
		        else if (kind !== 'audio' && kind !== 'video') {
		            throw new TypeError(`invalid kind "${kind}"`);
		        }
		        return this._canProduceByKind[kind];
		    }
		    /**
		     * Creates a Transport for sending media.
		     *
		     * @throws {InvalidStateError} if not loaded.
		     * @throws {TypeError} if wrong arguments.
		     */
		    createSendTransport({ id, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, appData, }) {
		        logger.debug('createSendTransport()');
		        return this.createTransport({
		            direction: 'send',
		            id: id,
		            iceParameters: iceParameters,
		            iceCandidates: iceCandidates,
		            dtlsParameters: dtlsParameters,
		            sctpParameters: sctpParameters,
		            iceServers: iceServers,
		            iceTransportPolicy: iceTransportPolicy,
		            additionalSettings: additionalSettings,
		            proprietaryConstraints: proprietaryConstraints,
		            appData: appData,
		        });
		    }
		    /**
		     * Creates a Transport for receiving media.
		     *
		     * @throws {InvalidStateError} if not loaded.
		     * @throws {TypeError} if wrong arguments.
		     */
		    createRecvTransport({ id, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, appData, }) {
		        logger.debug('createRecvTransport()');
		        return this.createTransport({
		            direction: 'recv',
		            id: id,
		            iceParameters: iceParameters,
		            iceCandidates: iceCandidates,
		            dtlsParameters: dtlsParameters,
		            sctpParameters: sctpParameters,
		            iceServers: iceServers,
		            iceTransportPolicy: iceTransportPolicy,
		            additionalSettings: additionalSettings,
		            proprietaryConstraints: proprietaryConstraints,
		            appData: appData,
		        });
		    }
		    createTransport({ direction, id, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, additionalSettings, proprietaryConstraints, appData, }) {
		        if (!this._loaded) {
		            throw new errors_1.InvalidStateError('not loaded');
		        }
		        else if (typeof id !== 'string') {
		            throw new TypeError('missing id');
		        }
		        else if (typeof iceParameters !== 'object') {
		            throw new TypeError('missing iceParameters');
		        }
		        else if (!Array.isArray(iceCandidates)) {
		            throw new TypeError('missing iceCandidates');
		        }
		        else if (typeof dtlsParameters !== 'object') {
		            throw new TypeError('missing dtlsParameters');
		        }
		        else if (sctpParameters && typeof sctpParameters !== 'object') {
		            throw new TypeError('wrong sctpParameters');
		        }
		        else if (appData && typeof appData !== 'object') {
		            throw new TypeError('if given, appData must be an object');
		        }
		        // Create a new Transport.
		        const transport = new Transport_1.Transport({
		            direction,
		            id,
		            iceParameters,
		            iceCandidates,
		            dtlsParameters,
		            sctpParameters,
		            iceServers,
		            iceTransportPolicy,
		            additionalSettings,
		            proprietaryConstraints,
		            appData,
		            handlerFactory: this._handlerFactory,
		            extendedRtpCapabilities: this._extendedRtpCapabilities,
		            canProduceByKind: this._canProduceByKind,
		        });
		        // Emit observer event.
		        this._observer.safeEmit('newtransport', transport);
		        return transport;
		    }
		};
		Device.Device = Device$1;
		function detectDeviceImpl(uaParserResult) {
		    // React-Native.
		    // NOTE: react-native-webrtc >= 1.75.0 is required.
		    // NOTE: For Unified-Plan support, react-native-webrtc version >= 106.0.0 is
		    // required.
		    if (typeof navigator === 'object' && navigator.product === 'ReactNative') {
		        logger.debug('detectDeviceImpl() | React-Native detected');
		        if (typeof RTCPeerConnection === 'undefined') {
		            logger.warn('detectDeviceImpl() | unsupported react-native-webrtc without RTCPeerConnection, forgot to call registerGlobals()?');
		            return undefined;
		        }
		        if (typeof RTCRtpTransceiver !== 'undefined') {
		            logger.debug('detectDeviceImpl() | ReactNative UnifiedPlan handler chosen');
		            return 'ReactNativeUnifiedPlan';
		        }
		        else {
		            logger.debug('detectDeviceImpl() | ReactNative PlanB handler chosen');
		            return 'ReactNative';
		        }
		    }
		    // Browser.
		    else {
		        logger.debug('detectDeviceImpl() | browser detected [userAgent:%s, parsed:%o]', uaParserResult.ua, uaParserResult);
		        const browser = uaParserResult.browser;
		        const browserName = browser.name?.toLowerCase();
		        const browserVersion = parseInt(browser.major ?? '0');
		        const engine = uaParserResult.engine;
		        const engineName = engine.name?.toLowerCase();
		        const os = uaParserResult.os;
		        const osName = os.name?.toLowerCase();
		        const osVersion = parseFloat(os.version ?? '0');
		        const device = uaParserResult.device;
		        const deviceModel = device.model?.toLowerCase();
		        const isIOS = osName === 'ios' || deviceModel === 'ipad';
		        const isChrome = browserName &&
		            [
		                'chrome',
		                'chromium',
		                'mobile chrome',
		                'chrome webview',
		                'chrome headless',
		            ].includes(browserName);
		        const isFirefox = browserName &&
		            ['firefox', 'mobile firefox', 'mobile focus'].includes(browserName);
		        const isSafari = browserName && ['safari', 'mobile safari'].includes(browserName);
		        const isEdge = browserName && ['edge'].includes(browserName);
		        // Chrome, Chromium, and Edge.
		        if ((isChrome || isEdge) && !isIOS && browserVersion >= 111) {
		            return 'Chrome111';
		        }
		        else if ((isChrome && !isIOS && browserVersion >= 74) ||
		            (isEdge && !isIOS && browserVersion >= 88)) {
		            return 'Chrome74';
		        }
		        else if (isChrome && !isIOS && browserVersion >= 70) {
		            return 'Chrome70';
		        }
		        else if (isChrome && !isIOS && browserVersion >= 67) {
		            return 'Chrome67';
		        }
		        else if (isChrome && !isIOS && browserVersion >= 55) {
		            return 'Chrome55';
		        }
		        // Firefox.
		        else if (isFirefox && !isIOS && browserVersion >= 120) {
		            return 'Firefox120';
		        }
		        else if (isFirefox && !isIOS && browserVersion >= 60) {
		            return 'Firefox60';
		        }
		        // Firefox on iOS (so Safari).
		        else if (isFirefox && isIOS && osVersion >= 14.3) {
		            return 'Safari12';
		        }
		        // Safari with Unified-Plan support enabled.
		        else if (isSafari &&
		            browserVersion >= 12 &&
		            typeof RTCRtpTransceiver !== 'undefined' &&
		            RTCRtpTransceiver.prototype.hasOwnProperty('currentDirection')) {
		            return 'Safari12';
		        }
		        // Safari with Plab-B support.
		        else if (isSafari && browserVersion >= 11) {
		            return 'Safari11';
		        }
		        // Old Edge with ORTC support.
		        else if (isEdge && !isIOS && browserVersion >= 11 && browserVersion <= 18) {
		            return 'Edge11';
		        }
		        // Best effort for WebKit based browsers in iOS.
		        else if (engineName === 'webkit' &&
		            isIOS &&
		            typeof RTCRtpTransceiver !== 'undefined' &&
		            RTCRtpTransceiver.prototype.hasOwnProperty('currentDirection')) {
		            return 'Safari12';
		        }
		        // Best effort for Chromium based browsers.
		        else if (engineName === 'blink') {
		            // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
		            const match = uaParserResult.ua.match(/(?:(?:Chrome|Chromium))[ /](\w+)/i);
		            if (match) {
		                const version = Number(match[1]);
		                if (version >= 111) {
		                    return 'Chrome111';
		                }
		                else if (version >= 74) {
		                    return 'Chrome74';
		                }
		                else if (version >= 70) {
		                    return 'Chrome70';
		                }
		                else if (version >= 67) {
		                    return 'Chrome67';
		                }
		                else {
		                    return 'Chrome55';
		                }
		            }
		            else {
		                return 'Chrome111';
		            }
		        }
		        // Unsupported browser.
		        else {
		            logger.warn('detectDeviceImpl() | browser not supported [name:%s, version:%s]', browserName, browserVersion);
		            return undefined;
		        }
		    }
		}
		return Device;
	}

	var RtpParameters = {};

	var hasRequiredRtpParameters;

	function requireRtpParameters () {
		if (hasRequiredRtpParameters) return RtpParameters;
		hasRequiredRtpParameters = 1;
		/**
		 * The RTP capabilities define what mediasoup or an endpoint can receive at
		 * media level.
		 */
		Object.defineProperty(RtpParameters, "__esModule", { value: true });
		return RtpParameters;
	}

	var SctpParameters = {};

	var hasRequiredSctpParameters;

	function requireSctpParameters () {
		if (hasRequiredSctpParameters) return SctpParameters;
		hasRequiredSctpParameters = 1;
		Object.defineProperty(SctpParameters, "__esModule", { value: true });
		return SctpParameters;
	}

	var hasRequiredTypes;

	function requireTypes () {
		if (hasRequiredTypes) return types;
		hasRequiredTypes = 1;
		(function (exports) {
			var __createBinding = (types && types.__createBinding) || (Object.create ? (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    var desc = Object.getOwnPropertyDescriptor(m, k);
			    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
			      desc = { enumerable: true, get: function() { return m[k]; } };
			    }
			    Object.defineProperty(o, k2, desc);
			}) : (function(o, m, k, k2) {
			    if (k2 === undefined) k2 = k;
			    o[k2] = m[k];
			}));
			var __exportStar = (types && types.__exportStar) || function(m, exports) {
			    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
			};
			Object.defineProperty(exports, "__esModule", { value: true });
			__exportStar(requireDevice(), exports);
			__exportStar(requireTransport(), exports);
			__exportStar(requireProducer(), exports);
			__exportStar(requireConsumer(), exports);
			__exportStar(requireDataProducer(), exports);
			__exportStar(requireDataConsumer(), exports);
			__exportStar(requireRtpParameters(), exports);
			__exportStar(requireSctpParameters(), exports);
			__exportStar(requireHandlerInterface(), exports);
			__exportStar(requireErrors$1(), exports); 
		} (types));
		return types;
	}

	var FakeHandler = {};

	var lib = {};

	var max = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

	var nil = '00000000-0000-0000-0000-000000000000';

	var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

	function validate(uuid) {
	    return typeof uuid === 'string' && REGEX.test(uuid);
	}

	function parse(uuid) {
	    if (!validate(uuid)) {
	        throw TypeError('Invalid UUID');
	    }
	    let v;
	    return Uint8Array.of((v = parseInt(uuid.slice(0, 8), 16)) >>> 24, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff, (v = parseInt(uuid.slice(9, 13), 16)) >>> 8, v & 0xff, (v = parseInt(uuid.slice(14, 18), 16)) >>> 8, v & 0xff, (v = parseInt(uuid.slice(19, 23), 16)) >>> 8, v & 0xff, ((v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000) & 0xff, (v / 0x100000000) & 0xff, (v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff);
	}

	const byteToHex = [];
	for (let i = 0; i < 256; ++i) {
	    byteToHex.push((i + 0x100).toString(16).slice(1));
	}
	function unsafeStringify(arr, offset = 0) {
	    return (byteToHex[arr[offset + 0]] +
	        byteToHex[arr[offset + 1]] +
	        byteToHex[arr[offset + 2]] +
	        byteToHex[arr[offset + 3]] +
	        '-' +
	        byteToHex[arr[offset + 4]] +
	        byteToHex[arr[offset + 5]] +
	        '-' +
	        byteToHex[arr[offset + 6]] +
	        byteToHex[arr[offset + 7]] +
	        '-' +
	        byteToHex[arr[offset + 8]] +
	        byteToHex[arr[offset + 9]] +
	        '-' +
	        byteToHex[arr[offset + 10]] +
	        byteToHex[arr[offset + 11]] +
	        byteToHex[arr[offset + 12]] +
	        byteToHex[arr[offset + 13]] +
	        byteToHex[arr[offset + 14]] +
	        byteToHex[arr[offset + 15]]).toLowerCase();
	}
	function stringify(arr, offset = 0) {
	    const uuid = unsafeStringify(arr, offset);
	    if (!validate(uuid)) {
	        throw TypeError('Stringified UUID is invalid');
	    }
	    return uuid;
	}

	let getRandomValues;
	const rnds8 = new Uint8Array(16);
	function rng() {
	    if (!getRandomValues) {
	        if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
	            throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
	        }
	        getRandomValues = crypto.getRandomValues.bind(crypto);
	    }
	    return getRandomValues(rnds8);
	}

	const _state$1 = {};
	function v1(options, buf, offset) {
	    let bytes;
	    const isV6 = options?._v6 ?? false;
	    if (options) {
	        const optionsKeys = Object.keys(options);
	        if (optionsKeys.length === 1 && optionsKeys[0] === '_v6') {
	            options = undefined;
	        }
	    }
	    if (options) {
	        bytes = v1Bytes(options.random ?? options.rng?.() ?? rng(), options.msecs, options.nsecs, options.clockseq, options.node, buf, offset);
	    }
	    else {
	        const now = Date.now();
	        const rnds = rng();
	        updateV1State(_state$1, now, rnds);
	        bytes = v1Bytes(rnds, _state$1.msecs, _state$1.nsecs, isV6 ? undefined : _state$1.clockseq, isV6 ? undefined : _state$1.node, buf, offset);
	    }
	    return buf ?? unsafeStringify(bytes);
	}
	function updateV1State(state, now, rnds) {
	    state.msecs ??= -Infinity;
	    state.nsecs ??= 0;
	    if (now === state.msecs) {
	        state.nsecs++;
	        if (state.nsecs >= 10000) {
	            state.node = undefined;
	            state.nsecs = 0;
	        }
	    }
	    else if (now > state.msecs) {
	        state.nsecs = 0;
	    }
	    else if (now < state.msecs) {
	        state.node = undefined;
	    }
	    if (!state.node) {
	        state.node = rnds.slice(10, 16);
	        state.node[0] |= 0x01;
	        state.clockseq = ((rnds[8] << 8) | rnds[9]) & 0x3fff;
	    }
	    state.msecs = now;
	    return state;
	}
	function v1Bytes(rnds, msecs, nsecs, clockseq, node, buf, offset = 0) {
	    if (rnds.length < 16) {
	        throw new Error('Random bytes length must be >= 16');
	    }
	    if (!buf) {
	        buf = new Uint8Array(16);
	        offset = 0;
	    }
	    else {
	        if (offset < 0 || offset + 16 > buf.length) {
	            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
	        }
	    }
	    msecs ??= Date.now();
	    nsecs ??= 0;
	    clockseq ??= ((rnds[8] << 8) | rnds[9]) & 0x3fff;
	    node ??= rnds.slice(10, 16);
	    msecs += 12219292800000;
	    const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	    buf[offset++] = (tl >>> 24) & 0xff;
	    buf[offset++] = (tl >>> 16) & 0xff;
	    buf[offset++] = (tl >>> 8) & 0xff;
	    buf[offset++] = tl & 0xff;
	    const tmh = ((msecs / 0x100000000) * 10000) & 0xfffffff;
	    buf[offset++] = (tmh >>> 8) & 0xff;
	    buf[offset++] = tmh & 0xff;
	    buf[offset++] = ((tmh >>> 24) & 0xf) | 0x10;
	    buf[offset++] = (tmh >>> 16) & 0xff;
	    buf[offset++] = (clockseq >>> 8) | 0x80;
	    buf[offset++] = clockseq & 0xff;
	    for (let n = 0; n < 6; ++n) {
	        buf[offset++] = node[n];
	    }
	    return buf;
	}

	function v1ToV6(uuid) {
	    const v1Bytes = typeof uuid === 'string' ? parse(uuid) : uuid;
	    const v6Bytes = _v1ToV6(v1Bytes);
	    return typeof uuid === 'string' ? unsafeStringify(v6Bytes) : v6Bytes;
	}
	function _v1ToV6(v1Bytes) {
	    return Uint8Array.of(((v1Bytes[6] & 0x0f) << 4) | ((v1Bytes[7] >> 4) & 0x0f), ((v1Bytes[7] & 0x0f) << 4) | ((v1Bytes[4] & 0xf0) >> 4), ((v1Bytes[4] & 0x0f) << 4) | ((v1Bytes[5] & 0xf0) >> 4), ((v1Bytes[5] & 0x0f) << 4) | ((v1Bytes[0] & 0xf0) >> 4), ((v1Bytes[0] & 0x0f) << 4) | ((v1Bytes[1] & 0xf0) >> 4), ((v1Bytes[1] & 0x0f) << 4) | ((v1Bytes[2] & 0xf0) >> 4), 0x60 | (v1Bytes[2] & 0x0f), v1Bytes[3], v1Bytes[8], v1Bytes[9], v1Bytes[10], v1Bytes[11], v1Bytes[12], v1Bytes[13], v1Bytes[14], v1Bytes[15]);
	}

	function md5(bytes) {
	    const words = uint8ToUint32(bytes);
	    const md5Bytes = wordsToMd5(words, bytes.length * 8);
	    return uint32ToUint8(md5Bytes);
	}
	function uint32ToUint8(input) {
	    const bytes = new Uint8Array(input.length * 4);
	    for (let i = 0; i < input.length * 4; i++) {
	        bytes[i] = (input[i >> 2] >>> ((i % 4) * 8)) & 0xff;
	    }
	    return bytes;
	}
	function getOutputLength(inputLength8) {
	    return (((inputLength8 + 64) >>> 9) << 4) + 14 + 1;
	}
	function wordsToMd5(x, len) {
	    const xpad = new Uint32Array(getOutputLength(len)).fill(0);
	    xpad.set(x);
	    xpad[len >> 5] |= 0x80 << len % 32;
	    xpad[xpad.length - 1] = len;
	    x = xpad;
	    let a = 1732584193;
	    let b = -271733879;
	    let c = -1732584194;
	    let d = 271733878;
	    for (let i = 0; i < x.length; i += 16) {
	        const olda = a;
	        const oldb = b;
	        const oldc = c;
	        const oldd = d;
	        a = md5ff(a, b, c, d, x[i], 7, -680876936);
	        d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
	        c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
	        b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
	        a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
	        d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
	        c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
	        b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
	        a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
	        d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
	        c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
	        b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
	        a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
	        d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
	        c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
	        b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
	        a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
	        d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
	        c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
	        b = md5gg(b, c, d, a, x[i], 20, -373897302);
	        a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
	        d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
	        c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
	        b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
	        a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
	        d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
	        c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
	        b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
	        a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
	        d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
	        c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
	        b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
	        a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
	        d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
	        c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
	        b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
	        a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
	        d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
	        c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
	        b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
	        a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
	        d = md5hh(d, a, b, c, x[i], 11, -358537222);
	        c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
	        b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
	        a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
	        d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
	        c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
	        b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
	        a = md5ii(a, b, c, d, x[i], 6, -198630844);
	        d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
	        c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
	        b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
	        a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
	        d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
	        c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
	        b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
	        a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
	        d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
	        c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
	        b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
	        a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
	        d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
	        c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
	        b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
	        a = safeAdd(a, olda);
	        b = safeAdd(b, oldb);
	        c = safeAdd(c, oldc);
	        d = safeAdd(d, oldd);
	    }
	    return Uint32Array.of(a, b, c, d);
	}
	function uint8ToUint32(input) {
	    if (input.length === 0) {
	        return new Uint32Array();
	    }
	    const output = new Uint32Array(getOutputLength(input.length * 8)).fill(0);
	    for (let i = 0; i < input.length; i++) {
	        output[i >> 2] |= (input[i] & 0xff) << ((i % 4) * 8);
	    }
	    return output;
	}
	function safeAdd(x, y) {
	    const lsw = (x & 0xffff) + (y & 0xffff);
	    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	    return (msw << 16) | (lsw & 0xffff);
	}
	function bitRotateLeft(num, cnt) {
	    return (num << cnt) | (num >>> (32 - cnt));
	}
	function md5cmn(q, a, b, x, s, t) {
	    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
	}
	function md5ff(a, b, c, d, x, s, t) {
	    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
	}
	function md5gg(a, b, c, d, x, s, t) {
	    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
	}
	function md5hh(a, b, c, d, x, s, t) {
	    return md5cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5ii(a, b, c, d, x, s, t) {
	    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
	}

	function stringToBytes(str) {
	    str = unescape(encodeURIComponent(str));
	    const bytes = new Uint8Array(str.length);
	    for (let i = 0; i < str.length; ++i) {
	        bytes[i] = str.charCodeAt(i);
	    }
	    return bytes;
	}
	const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
	const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
	function v35(version, hash, value, namespace, buf, offset) {
	    const valueBytes = typeof value === 'string' ? stringToBytes(value) : value;
	    const namespaceBytes = typeof namespace === 'string' ? parse(namespace) : namespace;
	    if (typeof namespace === 'string') {
	        namespace = parse(namespace);
	    }
	    if (namespace?.length !== 16) {
	        throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
	    }
	    let bytes = new Uint8Array(16 + valueBytes.length);
	    bytes.set(namespaceBytes);
	    bytes.set(valueBytes, namespaceBytes.length);
	    bytes = hash(bytes);
	    bytes[6] = (bytes[6] & 0x0f) | version;
	    bytes[8] = (bytes[8] & 0x3f) | 0x80;
	    if (buf) {
	        offset = offset || 0;
	        for (let i = 0; i < 16; ++i) {
	            buf[offset + i] = bytes[i];
	        }
	        return buf;
	    }
	    return unsafeStringify(bytes);
	}

	function v3(value, namespace, buf, offset) {
	    return v35(0x30, md5, value, namespace, buf, offset);
	}
	v3.DNS = DNS;
	v3.URL = URL;

	const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
	var native = { randomUUID };

	function v4(options, buf, offset) {
	    if (native.randomUUID && !buf && !options) {
	        return native.randomUUID();
	    }
	    options = options || {};
	    const rnds = options.random ?? options.rng?.() ?? rng();
	    if (rnds.length < 16) {
	        throw new Error('Random bytes length must be >= 16');
	    }
	    rnds[6] = (rnds[6] & 0x0f) | 0x40;
	    rnds[8] = (rnds[8] & 0x3f) | 0x80;
	    if (buf) {
	        offset = offset || 0;
	        if (offset < 0 || offset + 16 > buf.length) {
	            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
	        }
	        for (let i = 0; i < 16; ++i) {
	            buf[offset + i] = rnds[i];
	        }
	        return buf;
	    }
	    return unsafeStringify(rnds);
	}

	function f(s, x, y, z) {
	    switch (s) {
	        case 0:
	            return (x & y) ^ (~x & z);
	        case 1:
	            return x ^ y ^ z;
	        case 2:
	            return (x & y) ^ (x & z) ^ (y & z);
	        case 3:
	            return x ^ y ^ z;
	    }
	}
	function ROTL(x, n) {
	    return (x << n) | (x >>> (32 - n));
	}
	function sha1(bytes) {
	    const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];
	    const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
	    const newBytes = new Uint8Array(bytes.length + 1);
	    newBytes.set(bytes);
	    newBytes[bytes.length] = 0x80;
	    bytes = newBytes;
	    const l = bytes.length / 4 + 2;
	    const N = Math.ceil(l / 16);
	    const M = new Array(N);
	    for (let i = 0; i < N; ++i) {
	        const arr = new Uint32Array(16);
	        for (let j = 0; j < 16; ++j) {
	            arr[j] =
	                (bytes[i * 64 + j * 4] << 24) |
	                    (bytes[i * 64 + j * 4 + 1] << 16) |
	                    (bytes[i * 64 + j * 4 + 2] << 8) |
	                    bytes[i * 64 + j * 4 + 3];
	        }
	        M[i] = arr;
	    }
	    M[N - 1][14] = ((bytes.length - 1) * 8) / Math.pow(2, 32);
	    M[N - 1][14] = Math.floor(M[N - 1][14]);
	    M[N - 1][15] = ((bytes.length - 1) * 8) & 0xffffffff;
	    for (let i = 0; i < N; ++i) {
	        const W = new Uint32Array(80);
	        for (let t = 0; t < 16; ++t) {
	            W[t] = M[i][t];
	        }
	        for (let t = 16; t < 80; ++t) {
	            W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
	        }
	        let a = H[0];
	        let b = H[1];
	        let c = H[2];
	        let d = H[3];
	        let e = H[4];
	        for (let t = 0; t < 80; ++t) {
	            const s = Math.floor(t / 20);
	            const T = (ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t]) >>> 0;
	            e = d;
	            d = c;
	            c = ROTL(b, 30) >>> 0;
	            b = a;
	            a = T;
	        }
	        H[0] = (H[0] + a) >>> 0;
	        H[1] = (H[1] + b) >>> 0;
	        H[2] = (H[2] + c) >>> 0;
	        H[3] = (H[3] + d) >>> 0;
	        H[4] = (H[4] + e) >>> 0;
	    }
	    return Uint8Array.of(H[0] >> 24, H[0] >> 16, H[0] >> 8, H[0], H[1] >> 24, H[1] >> 16, H[1] >> 8, H[1], H[2] >> 24, H[2] >> 16, H[2] >> 8, H[2], H[3] >> 24, H[3] >> 16, H[3] >> 8, H[3], H[4] >> 24, H[4] >> 16, H[4] >> 8, H[4]);
	}

	function v5(value, namespace, buf, offset) {
	    return v35(0x50, sha1, value, namespace, buf, offset);
	}
	v5.DNS = DNS;
	v5.URL = URL;

	function v6(options, buf, offset) {
	    options ??= {};
	    offset ??= 0;
	    let bytes = v1({ ...options, _v6: true }, new Uint8Array(16));
	    bytes = v1ToV6(bytes);
	    if (buf) {
	        for (let i = 0; i < 16; i++) {
	            buf[offset + i] = bytes[i];
	        }
	        return buf;
	    }
	    return unsafeStringify(bytes);
	}

	function v6ToV1(uuid) {
	    const v6Bytes = typeof uuid === 'string' ? parse(uuid) : uuid;
	    const v1Bytes = _v6ToV1(v6Bytes);
	    return typeof uuid === 'string' ? unsafeStringify(v1Bytes) : v1Bytes;
	}
	function _v6ToV1(v6Bytes) {
	    return Uint8Array.of(((v6Bytes[3] & 0x0f) << 4) | ((v6Bytes[4] >> 4) & 0x0f), ((v6Bytes[4] & 0x0f) << 4) | ((v6Bytes[5] & 0xf0) >> 4), ((v6Bytes[5] & 0x0f) << 4) | (v6Bytes[6] & 0x0f), v6Bytes[7], ((v6Bytes[1] & 0x0f) << 4) | ((v6Bytes[2] & 0xf0) >> 4), ((v6Bytes[2] & 0x0f) << 4) | ((v6Bytes[3] & 0xf0) >> 4), 0x10 | ((v6Bytes[0] & 0xf0) >> 4), ((v6Bytes[0] & 0x0f) << 4) | ((v6Bytes[1] & 0xf0) >> 4), v6Bytes[8], v6Bytes[9], v6Bytes[10], v6Bytes[11], v6Bytes[12], v6Bytes[13], v6Bytes[14], v6Bytes[15]);
	}

	const _state = {};
	function v7(options, buf, offset) {
	    let bytes;
	    if (options) {
	        bytes = v7Bytes(options.random ?? options.rng?.() ?? rng(), options.msecs, options.seq, buf, offset);
	    }
	    else {
	        const now = Date.now();
	        const rnds = rng();
	        updateV7State(_state, now, rnds);
	        bytes = v7Bytes(rnds, _state.msecs, _state.seq, buf, offset);
	    }
	    return buf ?? unsafeStringify(bytes);
	}
	function updateV7State(state, now, rnds) {
	    state.msecs ??= -Infinity;
	    state.seq ??= 0;
	    if (now > state.msecs) {
	        state.seq = (rnds[6] << 23) | (rnds[7] << 16) | (rnds[8] << 8) | rnds[9];
	        state.msecs = now;
	    }
	    else {
	        state.seq = (state.seq + 1) | 0;
	        if (state.seq === 0) {
	            state.msecs++;
	        }
	    }
	    return state;
	}
	function v7Bytes(rnds, msecs, seq, buf, offset = 0) {
	    if (rnds.length < 16) {
	        throw new Error('Random bytes length must be >= 16');
	    }
	    if (!buf) {
	        buf = new Uint8Array(16);
	        offset = 0;
	    }
	    else {
	        if (offset < 0 || offset + 16 > buf.length) {
	            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
	        }
	    }
	    msecs ??= Date.now();
	    seq ??= ((rnds[6] * 0x7f) << 24) | (rnds[7] << 16) | (rnds[8] << 8) | rnds[9];
	    buf[offset++] = (msecs / 0x10000000000) & 0xff;
	    buf[offset++] = (msecs / 0x100000000) & 0xff;
	    buf[offset++] = (msecs / 0x1000000) & 0xff;
	    buf[offset++] = (msecs / 0x10000) & 0xff;
	    buf[offset++] = (msecs / 0x100) & 0xff;
	    buf[offset++] = msecs & 0xff;
	    buf[offset++] = 0x70 | ((seq >>> 28) & 0x0f);
	    buf[offset++] = (seq >>> 20) & 0xff;
	    buf[offset++] = 0x80 | ((seq >>> 14) & 0x3f);
	    buf[offset++] = (seq >>> 6) & 0xff;
	    buf[offset++] = ((seq << 2) & 0xff) | (rnds[10] & 0x03);
	    buf[offset++] = rnds[11];
	    buf[offset++] = rnds[12];
	    buf[offset++] = rnds[13];
	    buf[offset++] = rnds[14];
	    buf[offset++] = rnds[15];
	    return buf;
	}

	function version(uuid) {
	    if (!validate(uuid)) {
	        throw TypeError('Invalid UUID');
	    }
	    return parseInt(uuid.slice(14, 15), 16);
	}

	var esmBrowser = /*#__PURE__*/Object.freeze({
		__proto__: null,
		MAX: max,
		NIL: nil,
		parse: parse,
		stringify: stringify,
		v1: v1,
		v1ToV6: v1ToV6,
		v3: v3,
		v4: v4,
		v5: v5,
		v6: v6,
		v6ToV1: v6ToV1,
		v7: v7,
		validate: validate,
		version: version
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(esmBrowser);

	var FakeEventTarget = {};

	var hasRequiredFakeEventTarget;

	function requireFakeEventTarget () {
		if (hasRequiredFakeEventTarget) return FakeEventTarget;
		hasRequiredFakeEventTarget = 1;
		Object.defineProperty(FakeEventTarget, "__esModule", { value: true });
		FakeEventTarget.FakeEventTarget = void 0;
		let FakeEventTarget$1 = class FakeEventTarget {
		    listeners = {};
		    addEventListener(type, callback, options = {}) {
		        if (!callback) {
		            return;
		        }
		        this.listeners[type] ??= [];
		        this.listeners[type].push({
		            callback,
		            once: options.once === true,
		        });
		    }
		    removeEventListener(type, callback) {
		        if (!this.listeners[type]) {
		            return;
		        }
		        this.listeners[type] = this.listeners[type].filter(listener => listener.callback !== callback);
		    }
		    dispatchEvent(event) {
		        if (!event || typeof event.type !== 'string') {
		            throw new Error('invalid event object');
		        }
		        const entries = this.listeners[event.type];
		        if (!entries) {
		            return true;
		        }
		        for (const listener of [...entries]) {
		            try {
		                listener.callback.call(this, event);
		            }
		            catch (error) {
		                // Avoid that the error breaks the iteration.
		                setTimeout(() => {
		                    throw error;
		                }, 0);
		            }
		            if (listener.once) {
		                this.removeEventListener(event.type, listener.callback);
		            }
		        }
		        return !event.defaultPrevented;
		    }
		};
		FakeEventTarget.FakeEventTarget = FakeEventTarget$1;
		return FakeEventTarget;
	}

	var utils = {};

	var hasRequiredUtils;

	function requireUtils () {
		if (hasRequiredUtils) return utils;
		hasRequiredUtils = 1;
		Object.defineProperty(utils, "__esModule", { value: true });
		utils.clone = clone;
		/**
		 * Clones the given value.
		 */
		function clone(value) {
		    if (value === undefined) {
		        return undefined;
		    }
		    else if (Number.isNaN(value)) {
		        return NaN;
		    }
		    else if (typeof structuredClone === 'function') {
		        // Available in Node >= 18.
		        return structuredClone(value);
		    }
		    else {
		        return JSON.parse(JSON.stringify(value));
		    }
		}
		return utils;
	}

	var hasRequiredLib$1;

	function requireLib$1 () {
		if (hasRequiredLib$1) return lib;
		hasRequiredLib$1 = 1;
		Object.defineProperty(lib, "__esModule", { value: true });
		lib.FakeMediaStreamTrack = void 0;
		const uuid_1 = require$$0;
		const FakeEventTarget_1 = requireFakeEventTarget();
		const utils_1 = requireUtils();
		class FakeMediaStreamTrack extends FakeEventTarget_1.FakeEventTarget {
		    #id;
		    #kind;
		    #label;
		    #readyState;
		    #enabled;
		    #muted;
		    #contentHint;
		    #capabilities;
		    #constraints;
		    #settings;
		    #data;
		    // Events.
		    #onmute = null;
		    #onunmute = null;
		    #onended = null;
		    // Custom events.
		    #onenabledchange = null;
		    #onstopped = null;
		    constructor({ kind, id, label, contentHint, enabled, muted, readyState, capabilities, constraints, settings, data, }) {
		        super();
		        this.#id = id ?? (0, uuid_1.v4)();
		        this.#kind = kind;
		        this.#label = label ?? '';
		        this.#contentHint = contentHint ?? '';
		        this.#enabled = enabled ?? true;
		        this.#muted = muted ?? false;
		        this.#readyState = readyState ?? 'live';
		        this.#capabilities = capabilities ?? {};
		        this.#constraints = constraints ?? {};
		        this.#settings = settings ?? {};
		        this.#data = data ?? {};
		    }
		    get id() {
		        return this.#id;
		    }
		    get kind() {
		        return this.#kind;
		    }
		    get label() {
		        return this.#label;
		    }
		    get contentHint() {
		        return this.#contentHint;
		    }
		    set contentHint(contentHint) {
		        this.#contentHint = contentHint;
		    }
		    get enabled() {
		        return this.#enabled;
		    }
		    /**
		     * Changes `enabled` member value and fires a custom "enabledchange" event.
		     */
		    set enabled(enabled) {
		        const changed = this.#enabled !== enabled;
		        this.#enabled = enabled;
		        if (changed) {
		            this.dispatchEvent(new Event('enabledchange'));
		        }
		    }
		    get muted() {
		        return this.#muted;
		    }
		    get readyState() {
		        return this.#readyState;
		    }
		    /**
		     * Application custom data getter.
		     */
		    get data() {
		        return this.#data;
		    }
		    /**
		     * Application custom data setter.
		     */
		    set data(data) {
		        this.#data = data;
		    }
		    get onmute() {
		        return this.#onmute;
		    }
		    set onmute(handler) {
		        if (this.#onmute) {
		            this.removeEventListener('mute', this.#onmute);
		        }
		        this.#onmute = handler;
		        if (handler) {
		            this.addEventListener('mute', handler);
		        }
		    }
		    get onunmute() {
		        return this.#onunmute;
		    }
		    set onunmute(handler) {
		        if (this.#onunmute) {
		            this.removeEventListener('unmute', this.#onunmute);
		        }
		        this.#onunmute = handler;
		        if (handler) {
		            this.addEventListener('unmute', handler);
		        }
		    }
		    get onended() {
		        return this.#onended;
		    }
		    set onended(handler) {
		        if (this.#onended) {
		            this.removeEventListener('ended', this.#onended);
		        }
		        this.#onended = handler;
		        if (handler) {
		            this.addEventListener('ended', handler);
		        }
		    }
		    get onenabledchange() {
		        return this.#onenabledchange;
		    }
		    set onenabledchange(handler) {
		        if (this.#onenabledchange) {
		            this.removeEventListener('enabledchange', this.#onenabledchange);
		        }
		        this.#onenabledchange = handler;
		        if (handler) {
		            this.addEventListener('enabledchange', handler);
		        }
		    }
		    get onstopped() {
		        return this.#onstopped;
		    }
		    set onstopped(handler) {
		        if (this.#onstopped) {
		            this.removeEventListener('stopped', this.#onstopped);
		        }
		        this.#onstopped = handler;
		        if (handler) {
		            this.addEventListener('stopped', handler);
		        }
		    }
		    addEventListener(type, listener, options) {
		        super.addEventListener(type, listener, options);
		    }
		    removeEventListener(type, listener) {
		        super.removeEventListener(type, listener);
		    }
		    /**
		     * Changes `readyState` member to "ended" and fires a custom "stopped" event
		     * (if not already stopped).
		     */
		    stop() {
		        if (this.#readyState === 'ended') {
		            return;
		        }
		        this.#readyState = 'ended';
		        this.dispatchEvent(new Event('stopped'));
		    }
		    /**
		     * Clones current track into another FakeMediaStreamTrack. `id` and `data`
		     * can be optionally given.
		     */
		    clone({ id, data, } = {}) {
		        return new FakeMediaStreamTrack({
		            id: id ?? (0, uuid_1.v4)(),
		            kind: this.#kind,
		            label: this.#label,
		            contentHint: this.#contentHint,
		            enabled: this.#enabled,
		            muted: this.#muted,
		            readyState: this.#readyState,
		            capabilities: (0, utils_1.clone)(this.#capabilities),
		            constraints: (0, utils_1.clone)(this.#constraints),
		            settings: (0, utils_1.clone)(this.#settings),
		            data: data ?? (0, utils_1.clone)(this.#data),
		        });
		    }
		    getCapabilities() {
		        return this.#capabilities;
		    }
		    getConstraints() {
		        return this.#constraints;
		    }
		    async applyConstraints(constraints = {}) {
		        this.#constraints = constraints;
		        // To make it be "more" async so ESLint doesn't complain.
		        return Promise.resolve();
		    }
		    getSettings() {
		        return this.#settings;
		    }
		    /**
		     * Simulates a remotely triggered stop. It fires a custom "stopped" event and
		     * the standard "ended" event (if the track was not already stopped).
		     */
		    remoteStop() {
		        if (this.#readyState === 'ended') {
		            return;
		        }
		        this.#readyState = 'ended';
		        this.dispatchEvent(new Event('stopped'));
		        this.dispatchEvent(new Event('ended'));
		    }
		    /**
		     * Simulates a remotely triggered mute. It fires a "mute" event (if the track
		     * was not already muted).
		     */
		    remoteMute() {
		        if (this.#muted) {
		            return;
		        }
		        this.#muted = true;
		        this.dispatchEvent(new Event('mute'));
		    }
		    /**
		     * Simulates a remotely triggered unmute. It fires an "unmute" event (if the
		     * track was muted).
		     */
		    remoteUnmute() {
		        if (!this.#muted) {
		            return;
		        }
		        this.#muted = false;
		        this.dispatchEvent(new Event('unmute'));
		    }
		}
		lib.FakeMediaStreamTrack = FakeMediaStreamTrack;
		return lib;
	}

	var hasRequiredFakeHandler;

	function requireFakeHandler () {
		if (hasRequiredFakeHandler) return FakeHandler;
		hasRequiredFakeHandler = 1;
		Object.defineProperty(FakeHandler, "__esModule", { value: true });
		FakeHandler.FakeHandler = void 0;
		const fake_mediastreamtrack_1 = requireLib$1();
		const enhancedEvents_1 = requireEnhancedEvents();
		const Logger_1 = requireLogger$2();
		const utils = requireUtils$2();
		const ortc = requireOrtc();
		const errors_1 = requireErrors$1();
		const HandlerInterface_1 = requireHandlerInterface();
		const logger = new Logger_1.Logger('FakeHandler');
		const NAME = 'FakeHandler';
		class FakeDataChannel extends enhancedEvents_1.EnhancedEventEmitter {
		    id;
		    ordered;
		    maxPacketLifeTime;
		    maxRetransmits;
		    label;
		    protocol;
		    constructor({ id, ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        super();
		        this.id = id;
		        this.ordered = ordered;
		        this.maxPacketLifeTime = maxPacketLifeTime;
		        this.maxRetransmits = maxRetransmits;
		        this.label = label;
		        this.protocol = protocol;
		    }
		    close() {
		        this.safeEmit('close');
		        this.emit('@close');
		    }
		    send(data) {
		        this.safeEmit('message', data);
		    }
		    addEventListener(event, fn) {
		        this.on(event, fn);
		    }
		}
		let FakeHandler$1 = class FakeHandler extends HandlerInterface_1.HandlerInterface {
		    // Closed flag.
		    _closed = false;
		    // Fake parameters source of RTP and SCTP parameters and capabilities.
		    fakeParameters;
		    // Generic sending RTP parameters for audio and video.
		    _rtpParametersByKind;
		    // Local RTCP CNAME.
		    _cname = `CNAME-${utils.generateRandomNumber()}`;
		    // Got transport local and remote parameters.
		    _transportReady = false;
		    // Next localId.
		    _nextLocalId = 1;
		    // Sending and receiving tracks indexed by localId.
		    _tracks = new Map();
		    // DataChannel id value counter. It must be incremented for each new DataChannel.
		    _nextSctpStreamId = 0;
		    /**
		     * Creates a factory function.
		     */
		    static createFactory(fakeParameters) {
		        return () => new FakeHandler(fakeParameters);
		    }
		    constructor(fakeParameters) {
		        super();
		        this.fakeParameters = fakeParameters;
		    }
		    get name() {
		        return NAME;
		    }
		    close() {
		        logger.debug('close()');
		        if (this._closed) {
		            return;
		        }
		        this._closed = true;
		    }
		    // NOTE: Custom method for simulation purposes.
		    setIceGatheringState(iceGatheringState) {
		        this.emit('@icegatheringstatechange', iceGatheringState);
		    }
		    // NOTE: Custom method for simulation purposes.
		    setConnectionState(connectionState) {
		        this.emit('@connectionstatechange', connectionState);
		    }
		    async getNativeRtpCapabilities() {
		        logger.debug('getNativeRtpCapabilities()');
		        return this.fakeParameters.generateNativeRtpCapabilities();
		    }
		    async getNativeSctpCapabilities() {
		        logger.debug('getNativeSctpCapabilities()');
		        return this.fakeParameters.generateNativeSctpCapabilities();
		    }
		    run({ 
		    /* eslint-disable @typescript-eslint/no-unused-vars */
		    direction, iceParameters, iceCandidates, dtlsParameters, sctpParameters, iceServers, iceTransportPolicy, proprietaryConstraints, extendedRtpCapabilities,
		    /* eslint-enable @typescript-eslint/no-unused-vars */
		     }) {
		        this.assertNotClosed();
		        logger.debug('run()');
		        // Generic sending RTP parameters for audio and video.
		        // @type {Object}
		        this._rtpParametersByKind = {
		            audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
		            video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities),
		        };
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async updateIceServers(iceServers) {
		        this.assertNotClosed();
		        logger.debug('updateIceServers()');
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async restartIce(iceParameters) {
		        this.assertNotClosed();
		        logger.debug('restartIce()');
		    }
		    async getTransportStats() {
		        this.assertNotClosed();
		        return new Map(); // NOTE: Whatever.
		    }
		    async send(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    { track, encodings, codecOptions, codec }) {
		        this.assertNotClosed();
		        logger.debug('send() [kind:%s, track.id:%s]', track.kind, track.id);
		        if (!this._transportReady) {
		            await this.setupTransport({ localDtlsRole: 'server' });
		        }
		        const rtpParameters = utils.clone(this._rtpParametersByKind[track.kind]);
		        const useRtx = rtpParameters.codecs.some((_codec) => /.+\/rtx$/i.test(_codec.mimeType));
		        rtpParameters.mid = `mid-${utils.generateRandomNumber()}`;
		        if (!encodings) {
		            encodings = [{}];
		        }
		        for (const encoding of encodings) {
		            encoding.ssrc = utils.generateRandomNumber();
		            if (useRtx) {
		                encoding.rtx = { ssrc: utils.generateRandomNumber() };
		            }
		        }
		        rtpParameters.encodings = encodings;
		        // Fill RTCRtpParameters.rtcp.
		        rtpParameters.rtcp = {
		            cname: this._cname,
		            reducedSize: true,
		            mux: true,
		        };
		        const localId = this._nextLocalId++;
		        this._tracks.set(localId, track);
		        return { localId: String(localId), rtpParameters };
		    }
		    async stopSending(localId) {
		        logger.debug('stopSending() [localId:%s]', localId);
		        if (this._closed) {
		            return;
		        }
		        if (!this._tracks.has(Number(localId))) {
		            throw new Error('local track not found');
		        }
		        this._tracks.delete(Number(localId));
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async pauseSending(localId) {
		        this.assertNotClosed();
		        // Unimplemented.
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async resumeSending(localId) {
		        this.assertNotClosed();
		        // Unimplemented.
		    }
		    async replaceTrack(localId, track) {
		        this.assertNotClosed();
		        if (track) {
		            logger.debug('replaceTrack() [localId:%s, track.id:%s]', localId, track.id);
		        }
		        else {
		            logger.debug('replaceTrack() [localId:%s, no track]', localId);
		        }
		        this._tracks.delete(Number(localId));
		        this._tracks.set(Number(localId), track);
		    }
		    async setMaxSpatialLayer(localId, spatialLayer) {
		        this.assertNotClosed();
		        logger.debug('setMaxSpatialLayer() [localId:%s, spatialLayer:%s]', localId, spatialLayer);
		    }
		    async setRtpEncodingParameters(localId, params) {
		        this.assertNotClosed();
		        logger.debug('setRtpEncodingParameters() [localId:%s, params:%o]', localId, params);
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async getSenderStats(localId) {
		        this.assertNotClosed();
		        return new Map(); // NOTE: Whatever.
		    }
		    async sendDataChannel({ ordered, maxPacketLifeTime, maxRetransmits, label, protocol, }) {
		        this.assertNotClosed();
		        if (!this._transportReady) {
		            await this.setupTransport({ localDtlsRole: 'server' });
		        }
		        logger.debug('sendDataChannel()');
		        const dataChannel = new FakeDataChannel({
		            id: this._nextSctpStreamId++,
		            ordered,
		            maxPacketLifeTime,
		            maxRetransmits,
		            label,
		            protocol,
		        });
		        const sctpStreamParameters = {
		            streamId: this._nextSctpStreamId,
		            ordered: ordered,
		            maxPacketLifeTime: maxPacketLifeTime,
		            maxRetransmits: maxRetransmits,
		        };
		        // @ts-expect-error --- On purpose.
		        return { dataChannel, sctpStreamParameters };
		    }
		    async receive(optionsList) {
		        this.assertNotClosed();
		        const results = [];
		        for (const options of optionsList) {
		            const { trackId, kind } = options;
		            if (!this._transportReady) {
		                await this.setupTransport({ localDtlsRole: 'client' });
		            }
		            logger.debug('receive() [trackId:%s, kind:%s]', trackId, kind);
		            const localId = this._nextLocalId++;
		            const track = new fake_mediastreamtrack_1.FakeMediaStreamTrack({ kind });
		            this._tracks.set(localId, track);
		            results.push({ localId: String(localId), track });
		        }
		        return results;
		    }
		    async stopReceiving(localIds) {
		        if (this._closed) {
		            return;
		        }
		        for (const localId of localIds) {
		            logger.debug('stopReceiving() [localId:%s]', localId);
		            this._tracks.delete(Number(localId));
		        }
		    }
		    async pauseReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        this.assertNotClosed();
		        // Unimplemented.
		    }
		    async resumeReceiving(
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localIds) {
		        this.assertNotClosed();
		        // Unimplemented.
		    }
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    async getReceiverStats(localId) {
		        this.assertNotClosed();
		        return new Map(); //
		    }
		    async receiveDataChannel({ sctpStreamParameters, label, protocol, }) {
		        this.assertNotClosed();
		        if (!this._transportReady) {
		            await this.setupTransport({ localDtlsRole: 'client' });
		        }
		        logger.debug('receiveDataChannel()');
		        const dataChannel = new FakeDataChannel({
		            id: sctpStreamParameters.streamId,
		            ordered: sctpStreamParameters.ordered,
		            maxPacketLifeTime: sctpStreamParameters.maxPacketLifeTime,
		            maxRetransmits: sctpStreamParameters.maxRetransmits,
		            label,
		            protocol,
		        });
		        // @ts-expect-error --- On purpose.
		        return { dataChannel };
		    }
		    async setupTransport({ localDtlsRole, 
		    // eslint-disable-next-line @typescript-eslint/no-unused-vars
		    localSdpObject, }) {
		        const dtlsParameters = utils.clone(this.fakeParameters.generateLocalDtlsParameters());
		        // Set our DTLS role.
		        if (localDtlsRole) {
		            dtlsParameters.role = localDtlsRole;
		        }
		        // Assume we are connecting now.
		        this.emit('@connectionstatechange', 'connecting');
		        // Need to tell the remote transport about our parameters.
		        await new Promise((resolve, reject) => this.emit('@connect', { dtlsParameters }, resolve, reject));
		        this._transportReady = true;
		    }
		    assertNotClosed() {
		        if (this._closed) {
		            throw new errors_1.InvalidStateError('method called in a closed handler');
		        }
		    }
		};
		FakeHandler.FakeHandler = FakeHandler$1;
		return FakeHandler;
	}

	var fakeParameters = {};

	var hasRequiredFakeParameters;

	function requireFakeParameters () {
		if (hasRequiredFakeParameters) return fakeParameters;
		hasRequiredFakeParameters = 1;
		Object.defineProperty(fakeParameters, "__esModule", { value: true });
		fakeParameters.generateRouterRtpCapabilities = generateRouterRtpCapabilities;
		fakeParameters.generateNativeRtpCapabilities = generateNativeRtpCapabilities;
		fakeParameters.generateNativeSctpCapabilities = generateNativeSctpCapabilities;
		fakeParameters.generateLocalDtlsParameters = generateLocalDtlsParameters;
		fakeParameters.generateTransportRemoteParameters = generateTransportRemoteParameters;
		fakeParameters.generateProducerRemoteParameters = generateProducerRemoteParameters;
		fakeParameters.generateConsumerRemoteParameters = generateConsumerRemoteParameters;
		fakeParameters.generateDataProducerRemoteParameters = generateDataProducerRemoteParameters;
		fakeParameters.generateDataConsumerRemoteParameters = generateDataConsumerRemoteParameters;
		const utils = requireUtils$2();
		function generateFakeUuid() {
		    return String(utils.generateRandomNumber());
		}
		function generateRouterRtpCapabilities() {
		    return utils.deepFreeze({
		        codecs: [
		            {
		                mimeType: 'audio/opus',
		                kind: 'audio',
		                preferredPayloadType: 100,
		                clockRate: 48000,
		                channels: 2,
		                rtcpFeedback: [{ type: 'transport-cc' }],
		                parameters: {
		                    useinbandfec: 1,
		                    foo: 'bar',
		                },
		            },
		            {
		                mimeType: 'video/VP8',
		                kind: 'video',
		                preferredPayloadType: 101,
		                clockRate: 90000,
		                rtcpFeedback: [
		                    { type: 'nack' },
		                    { type: 'nack', parameter: 'pli' },
		                    { type: 'ccm', parameter: 'fir' },
		                    { type: 'goog-remb' },
		                    { type: 'transport-cc' },
		                ],
		                parameters: {
		                    'x-google-start-bitrate': 1500,
		                },
		            },
		            {
		                mimeType: 'video/rtx',
		                kind: 'video',
		                preferredPayloadType: 102,
		                clockRate: 90000,
		                rtcpFeedback: [],
		                parameters: {
		                    apt: 101,
		                },
		            },
		            {
		                mimeType: 'video/H264',
		                kind: 'video',
		                preferredPayloadType: 103,
		                clockRate: 90000,
		                rtcpFeedback: [
		                    { type: 'nack' },
		                    { type: 'nack', parameter: 'pli' },
		                    { type: 'ccm', parameter: 'fir' },
		                    { type: 'goog-remb' },
		                    { type: 'transport-cc' },
		                ],
		                parameters: {
		                    'level-asymmetry-allowed': 1,
		                    'packetization-mode': 1,
		                    'profile-level-id': '42e01f',
		                },
		            },
		            {
		                mimeType: 'video/rtx',
		                kind: 'video',
		                preferredPayloadType: 104,
		                clockRate: 90000,
		                rtcpFeedback: [],
		                parameters: {
		                    apt: 103,
		                },
		            },
		            {
		                mimeType: 'video/VP9',
		                kind: 'video',
		                preferredPayloadType: 105,
		                clockRate: 90000,
		                rtcpFeedback: [
		                    { type: 'nack' },
		                    { type: 'nack', parameter: 'pli' },
		                    { type: 'ccm', parameter: 'fir' },
		                    { type: 'goog-remb' },
		                    { type: 'transport-cc' },
		                ],
		                parameters: {
		                    'profile-id': 0,
		                    'x-google-start-bitrate': 1500,
		                },
		            },
		            {
		                mimeType: 'video/rtx',
		                kind: 'video',
		                preferredPayloadType: 106,
		                clockRate: 90000,
		                rtcpFeedback: [],
		                parameters: {
		                    apt: 105,
		                },
		            },
		        ],
		        headerExtensions: [
		            {
		                kind: 'audio',
		                uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
		                preferredId: 1,
		                preferredEncrypt: false,
		                direction: 'sendrecv',
		            },
		            {
		                kind: 'video',
		                uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
		                preferredId: 1,
		                preferredEncrypt: false,
		                direction: 'sendrecv',
		            },
		            {
		                kind: 'video',
		                uri: 'urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id',
		                preferredId: 2,
		                preferredEncrypt: false,
		                direction: 'recvonly',
		            },
		            {
		                kind: 'video',
		                uri: 'urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id',
		                preferredId: 3,
		                preferredEncrypt: false,
		                direction: 'recvonly',
		            },
		            {
		                kind: 'audio',
		                uri: 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time',
		                preferredId: 4,
		                preferredEncrypt: false,
		                direction: 'sendrecv',
		            },
		            {
		                kind: 'video',
		                uri: 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time',
		                preferredId: 4,
		                preferredEncrypt: false,
		                direction: 'sendrecv',
		            },
		            {
		                kind: 'audio',
		                uri: 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01',
		                preferredId: 5,
		                preferredEncrypt: false,
		                direction: 'recvonly',
		            },
		            {
		                kind: 'video',
		                uri: 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01',
		                preferredId: 5,
		                preferredEncrypt: false,
		                direction: 'sendrecv',
		            },
		            {
		                kind: 'video',
		                uri: 'http://tools.ietf.org/html/draft-ietf-avtext-framemarking-07',
		                preferredId: 6,
		                preferredEncrypt: false,
		                direction: 'sendrecv',
		            },
		            {
		                kind: 'video',
		                uri: 'urn:ietf:params:rtp-hdrext:framemarking',
		                preferredId: 7,
		                preferredEncrypt: false,
		                direction: 'sendrecv',
		            },
		            {
		                kind: 'audio',
		                uri: 'urn:ietf:params:rtp-hdrext:ssrc-audio-level',
		                preferredId: 10,
		                preferredEncrypt: false,
		                direction: 'sendrecv',
		            },
		            {
		                kind: 'video',
		                uri: 'urn:3gpp:video-orientation',
		                preferredId: 11,
		                preferredEncrypt: false,
		                direction: 'sendrecv',
		            },
		            {
		                kind: 'video',
		                uri: 'urn:ietf:params:rtp-hdrext:toffset',
		                preferredId: 12,
		                preferredEncrypt: false,
		                direction: 'sendrecv',
		            },
		        ],
		    });
		}
		function generateNativeRtpCapabilities() {
		    return utils.deepFreeze({
		        codecs: [
		            {
		                mimeType: 'audio/opus',
		                kind: 'audio',
		                preferredPayloadType: 111,
		                clockRate: 48000,
		                channels: 2,
		                rtcpFeedback: [{ type: 'transport-cc' }],
		                parameters: {
		                    minptime: 10,
		                    useinbandfec: 1,
		                },
		            },
		            {
		                mimeType: 'audio/ISAC',
		                kind: 'audio',
		                preferredPayloadType: 103,
		                clockRate: 16000,
		                channels: 1,
		                rtcpFeedback: [{ type: 'transport-cc' }],
		                parameters: {},
		            },
		            {
		                mimeType: 'audio/CN',
		                kind: 'audio',
		                preferredPayloadType: 106,
		                clockRate: 32000,
		                channels: 1,
		                rtcpFeedback: [{ type: 'transport-cc' }],
		                parameters: {},
		            },
		            {
		                mimeType: 'video/VP8',
		                kind: 'video',
		                preferredPayloadType: 96,
		                clockRate: 90000,
		                rtcpFeedback: [
		                    { type: 'goog-remb' },
		                    { type: 'transport-cc' },
		                    { type: 'ccm', parameter: 'fir' },
		                    { type: 'nack' },
		                    { type: 'nack', parameter: 'pli' },
		                ],
		                parameters: {
		                    baz: '1234abcd',
		                },
		            },
		            {
		                mimeType: 'video/rtx',
		                kind: 'video',
		                preferredPayloadType: 97,
		                clockRate: 90000,
		                rtcpFeedback: [],
		                parameters: {
		                    apt: 96,
		                },
		            },
		            {
		                mimeType: 'video/VP9',
		                kind: 'video',
		                preferredPayloadType: 98,
		                clockRate: 90000,
		                rtcpFeedback: [
		                    { type: 'goog-remb' },
		                    { type: 'transport-cc' },
		                    { type: 'ccm', parameter: 'fir' },
		                    { type: 'nack' },
		                    { type: 'nack', parameter: 'pli' },
		                ],
		                parameters: {
		                    'profile-id': 0,
		                },
		            },
		            {
		                mimeType: 'video/rtx',
		                kind: 'video',
		                preferredPayloadType: 99,
		                clockRate: 90000,
		                rtcpFeedback: [],
		                parameters: {
		                    apt: 98,
		                },
		            },
		        ],
		        headerExtensions: [
		            {
		                kind: 'audio',
		                uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
		                preferredId: 1,
		            },
		            {
		                kind: 'video',
		                uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
		                preferredId: 1,
		            },
		            {
		                kind: 'video',
		                uri: 'urn:ietf:params:rtp-hdrext:toffset',
		                preferredId: 2,
		            },
		            {
		                kind: 'video',
		                uri: 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time',
		                preferredId: 3,
		            },
		            {
		                kind: 'video',
		                uri: 'urn:3gpp:video-orientation',
		                preferredId: 4,
		            },
		            {
		                kind: 'video',
		                uri: 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01',
		                preferredId: 5,
		            },
		            {
		                kind: 'video',
		                uri: 'http://www.webrtc.org/experiments/rtp-hdrext/playout-delay',
		                preferredId: 6,
		            },
		            {
		                kind: 'video',
		                // @ts-expect-error --- ON purpose.
		                uri: 'http://www.webrtc.org/experiments/rtp-hdrext/video-content-type',
		                preferredId: 7,
		            },
		            {
		                kind: 'video',
		                // @ts-expect-error --- ON purpose.
		                uri: 'http://www.webrtc.org/experiments/rtp-hdrext/video-timing',
		                preferredId: 8,
		            },
		            {
		                kind: 'audio',
		                uri: 'urn:ietf:params:rtp-hdrext:ssrc-audio-level',
		                preferredId: 10,
		            },
		        ],
		    });
		}
		function generateNativeSctpCapabilities() {
		    return utils.deepFreeze({
		        numStreams: { OS: 2048, MIS: 2048 },
		    });
		}
		function generateLocalDtlsParameters() {
		    return utils.deepFreeze({
		        fingerprints: [
		            {
		                algorithm: 'sha-256',
		                value: '82:5A:68:3D:36:C3:0A:DE:AF:E7:32:43:D2:88:83:57:AC:2D:65:E5:80:C4:B6:FB:AF:1A:A0:21:9F:6D:0C:AD',
		            },
		        ],
		        role: 'auto',
		    });
		}
		function generateTransportRemoteParameters() {
		    return {
		        id: generateFakeUuid(),
		        iceParameters: utils.deepFreeze({
		            iceLite: true,
		            password: 'yku5ej8nvfaor28lvtrabcx0wkrpkztz',
		            usernameFragment: 'h3hk1iz6qqlnqlne',
		        }),
		        iceCandidates: utils.deepFreeze([
		            {
		                foundation: 'udpcandidate',
		                address: '9.9.9.9',
		                ip: '9.9.9.9',
		                port: 40533,
		                priority: 1078862079,
		                protocol: 'udp',
		                type: 'host',
		                tcpType: 'passive',
		            },
		            {
		                foundation: 'udpcandidate',
		                address: '9.9.9.9',
		                ip: '9:9:9:9:9:9',
		                port: 41333,
		                priority: 1078862089,
		                protocol: 'udp',
		                type: 'host',
		                tcpType: 'passive',
		            },
		        ]),
		        dtlsParameters: utils.deepFreeze({
		            fingerprints: [
		                {
		                    algorithm: 'sha-256',
		                    value: 'A9:F4:E0:D2:74:D3:0F:D9:CA:A5:2F:9F:7F:47:FA:F0:C4:72:DD:73:49:D0:3B:14:90:20:51:30:1B:90:8E:71',
		                },
		                {
		                    algorithm: 'sha-384',
		                    value: '03:D9:0B:87:13:98:F6:6D:BC:FC:92:2E:39:D4:E1:97:32:61:30:56:84:70:81:6E:D1:82:97:EA:D9:C1:21:0F:6B:C5:E7:7F:E1:97:0C:17:97:6E:CF:B3:EF:2E:74:B0',
		                },
		                {
		                    algorithm: 'sha-512',
		                    value: '84:27:A4:28:A4:73:AF:43:02:2A:44:68:FF:2F:29:5C:3B:11:9A:60:F4:A8:F0:F5:AC:A0:E3:49:3E:B1:34:53:A9:85:CE:51:9B:ED:87:5E:B8:F4:8E:3D:FA:20:51:B8:96:EE:DA:56:DC:2F:5C:62:79:15:23:E0:21:82:2B:2C',
		                },
		            ],
		            role: 'auto',
		        }),
		        sctpParameters: utils.deepFreeze({
		            port: 5000,
		            OS: 2048,
		            MIS: 2048,
		            maxMessageSize: 2000000,
		        }),
		    };
		}
		function generateProducerRemoteParameters() {
		    return utils.deepFreeze({
		        id: generateFakeUuid(),
		    });
		}
		function generateConsumerRemoteParameters({ id, codecMimeType, } = {}) {
		    switch (codecMimeType) {
		        case 'audio/opus': {
		            return {
		                id: id ?? generateFakeUuid(),
		                producerId: generateFakeUuid(),
		                kind: 'audio',
		                rtpParameters: utils.deepFreeze({
		                    codecs: [
		                        {
		                            mimeType: 'audio/opus',
		                            payloadType: 100,
		                            clockRate: 48000,
		                            channels: 2,
		                            rtcpFeedback: [{ type: 'transport-cc' }],
		                            parameters: {
		                                useinbandfec: 1,
		                                foo: 'bar',
		                            },
		                        },
		                    ],
		                    encodings: [
		                        {
		                            ssrc: 46687003,
		                        },
		                    ],
		                    headerExtensions: [
		                        {
		                            uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
		                            id: 1,
		                        },
		                        {
		                            uri: 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01',
		                            id: 5,
		                        },
		                        {
		                            uri: 'urn:ietf:params:rtp-hdrext:ssrc-audio-level',
		                            id: 10,
		                        },
		                    ],
		                    rtcp: {
		                        cname: 'wB4Ql4lrsxYLjzuN',
		                        reducedSize: true,
		                        mux: true,
		                    },
		                }),
		            };
		        }
		        case 'audio/ISAC': {
		            return {
		                id: id ?? generateFakeUuid(),
		                producerId: generateFakeUuid(),
		                kind: 'audio',
		                rtpParameters: utils.deepFreeze({
		                    codecs: [
		                        {
		                            mimeType: 'audio/ISAC',
		                            payloadType: 111,
		                            clockRate: 16000,
		                            channels: 1,
		                            rtcpFeedback: [{ type: 'transport-cc' }],
		                            parameters: {},
		                        },
		                    ],
		                    encodings: [
		                        {
		                            ssrc: 46687004,
		                        },
		                    ],
		                    headerExtensions: [
		                        {
		                            uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
		                            id: 1,
		                        },
		                        {
		                            uri: 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01',
		                            id: 5,
		                        },
		                    ],
		                    rtcp: {
		                        cname: 'wB4Ql4lrsxYLjzuN',
		                        reducedSize: true,
		                        mux: true,
		                    },
		                }),
		            };
		        }
		        case 'video/VP8': {
		            return {
		                id: id ?? generateFakeUuid(),
		                producerId: generateFakeUuid(),
		                kind: 'video',
		                rtpParameters: utils.deepFreeze({
		                    codecs: [
		                        {
		                            mimeType: 'video/VP8',
		                            payloadType: 101,
		                            clockRate: 90000,
		                            rtcpFeedback: [
		                                { type: 'nack' },
		                                { type: 'nack', parameter: 'pli' },
		                                { type: 'ccm', parameter: 'fir' },
		                                { type: 'goog-remb' },
		                                { type: 'transport-cc' },
		                            ],
		                            parameters: {
		                                'x-google-start-bitrate': 1500,
		                            },
		                        },
		                        {
		                            mimeType: 'video/rtx',
		                            payloadType: 102,
		                            clockRate: 90000,
		                            rtcpFeedback: [],
		                            parameters: {
		                                apt: 101,
		                            },
		                        },
		                    ],
		                    encodings: [
		                        {
		                            ssrc: 99991111,
		                            rtx: {
		                                ssrc: 99991112,
		                            },
		                        },
		                    ],
		                    headerExtensions: [
		                        {
		                            uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
		                            id: 1,
		                        },
		                        {
		                            uri: 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time',
		                            id: 4,
		                        },
		                        {
		                            uri: 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01',
		                            id: 5,
		                        },
		                        {
		                            uri: 'urn:3gpp:video-orientation',
		                            id: 11,
		                        },
		                        {
		                            uri: 'urn:ietf:params:rtp-hdrext:toffset',
		                            id: 12,
		                        },
		                    ],
		                    rtcp: {
		                        cname: 'wB4Ql4lrsxYLjzuN',
		                        reducedSize: true,
		                        mux: true,
		                    },
		                }),
		            };
		        }
		        case 'video/H264': {
		            return {
		                id: id ?? generateFakeUuid(),
		                producerId: generateFakeUuid(),
		                kind: 'video',
		                rtpParameters: utils.deepFreeze({
		                    codecs: [
		                        {
		                            mimeType: 'video/H264',
		                            payloadType: 103,
		                            clockRate: 90000,
		                            rtcpFeedback: [
		                                { type: 'nack' },
		                                { type: 'nack', parameter: 'pli' },
		                                { type: 'ccm', parameter: 'fir' },
		                                { type: 'goog-remb' },
		                                { type: 'transport-cc' },
		                            ],
		                            parameters: {
		                                'level-asymmetry-allowed': 1,
		                                'packetization-mode': 1,
		                                'profile-level-id': '42e01f',
		                            },
		                        },
		                        {
		                            mimeType: 'video/rtx',
		                            payloadType: 104,
		                            clockRate: 90000,
		                            rtcpFeedback: [],
		                            parameters: {
		                                apt: 103,
		                            },
		                        },
		                    ],
		                    encodings: [
		                        {
		                            ssrc: 99991113,
		                            rtx: {
		                                ssrc: 99991114,
		                            },
		                        },
		                    ],
		                    headerExtensions: [
		                        {
		                            uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
		                            id: 1,
		                        },
		                        {
		                            uri: 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time',
		                            id: 4,
		                        },
		                        {
		                            uri: 'http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01',
		                            id: 5,
		                        },
		                        {
		                            uri: 'urn:3gpp:video-orientation',
		                            id: 11,
		                        },
		                        {
		                            uri: 'urn:ietf:params:rtp-hdrext:toffset',
		                            id: 12,
		                        },
		                    ],
		                    rtcp: {
		                        cname: 'wB4Ql4lrsxYLjzuN',
		                        reducedSize: true,
		                        mux: true,
		                    },
		                }),
		            };
		        }
		        default: {
		            throw new TypeError(`unknown codecMimeType '${codecMimeType}'`);
		        }
		    }
		}
		function generateDataProducerRemoteParameters() {
		    return utils.deepFreeze({
		        id: generateFakeUuid(),
		    });
		}
		function generateDataConsumerRemoteParameters({ id, } = {}) {
		    return {
		        id: id ?? generateFakeUuid(),
		        dataProducerId: generateFakeUuid(),
		        sctpStreamParameters: utils.deepFreeze({
		            streamId: 666,
		            maxPacketLifeTime: 5000,
		            maxRetransmits: undefined,
		        }),
		    };
		}
		return fakeParameters;
	}

	var hasRequiredLib;

	function requireLib () {
		if (hasRequiredLib) return lib$4;
		hasRequiredLib = 1;
		(function (exports) {
			Object.defineProperty(exports, "__esModule", { value: true });
			exports.debug = exports.testFakeParameters = exports.FakeHandler = exports.ortc = exports.parseScalabilityMode = exports.detectDeviceAsync = exports.detectDevice = exports.Device = exports.version = exports.types = void 0;
			const debug_1 = requireSrc();
			exports.debug = debug_1.default;
			/**
			 * Expose all types.
			 */
			exports.types = requireTypes();
			/**
			 * Expose mediasoup-client version.
			 */
			exports.version = '3.12.2';
			/**
			 * Expose Device class and device detector helpers.
			 */
			var Device_1 = requireDevice();
			Object.defineProperty(exports, "Device", { enumerable: true, get: function () { return Device_1.Device; } });
			Object.defineProperty(exports, "detectDevice", { enumerable: true, get: function () { return Device_1.detectDevice; } });
			Object.defineProperty(exports, "detectDeviceAsync", { enumerable: true, get: function () { return Device_1.detectDeviceAsync; } });
			/**
			 * Expose parseScalabilityMode() function.
			 */
			var scalabilityModes_1 = requireScalabilityModes();
			Object.defineProperty(exports, "parseScalabilityMode", { enumerable: true, get: function () { return scalabilityModes_1.parse; } });
			/**
			 * Expose all ORTC functions.
			 */
			exports.ortc = requireOrtc();
			/**
			 * Expose FakeHandler.
			 */
			var FakeHandler_1 = requireFakeHandler();
			Object.defineProperty(exports, "FakeHandler", { enumerable: true, get: function () { return FakeHandler_1.FakeHandler; } });
			/**
			 * Expose test/fakeParameters utils.
			 */
			exports.testFakeParameters = requireFakeParameters(); 
		} (lib$4));
		return lib$4;
	}

	var libExports = requireLib();
	var index = /*@__PURE__*/getDefaultExportFromCjs(libExports);

	var mediasoupClient = /*#__PURE__*/_mergeNamespaces({
		__proto__: null,
		default: index
	}, [libExports]);

	window.mediasoupClient = mediasoupClient;

})();
