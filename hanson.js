/*
 * hanson.js - Parser library for HanSON
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * For details, see LICENSE or http://unlicense.org/
 *
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 *
 * HanSON is JSON with comments, multiline strings and unquoted object property names.
 * - Comments use JavaScript syntax 
 * - Multi-line strings are triple-quotes like in Python: they start and end with """.
 * - Object property names do not require quotes if they are valid JavaScript identifiers.
 * - Every JSON string is valid HanSON.
 * - HanSON can easily converted to real JSON. 
 *
 *
 * hanson.js provides you with a HanSON object that has parse() and stringify() methods which
 * work like JSON's. Yu can use it as a CommonJS package dependency in Node.js:
 *
 *		var HanSON = require('hanson');
 *
 * If you invoke hanson.js and 'module' is not defined, it will write its reference into this.HanSON.
 * 
 * Parsing a HanSON string is as easy as parsing a JSON string:
 * 		var obj = HanSON.parse(jsonSrc);
 *      
 * Writing HanSON is also possible:
 * 		var h = HanSON.stringify(obj);
 * 
 * Note that the current implementation of stringify() will write a JSON string without using any HanSON features.
 * This may change in future implementations. 
 * 
 * https://github.com/timjansen/hanson
 */
(function(target) {
	
	function extractLineFeeds(s) {
		return s.replace(/[^\n]+/g, '');
	}
	
	// input is the HanSON string to convert.
	// if keepLineNumbers is set, toJSON() tried not to modify line numbers, so a JSON parser's
	// line numbers in error messages will still make sense.
	function toJSON(input, keepLineNumbers) {
		return input.replace(/[a-zA-Z_$][\w_$]*|"""([^]*?(?:\\"""|[^"]""|[^"]"|\\\\|[^\\"]))"""|"""("?"?)"""|"([^"]|\\")*"|\/\*[^]*?\*\/|\/\/.*\n?/g, 
							 function(s, tripleQuoted, tripleQuotedShort, singleQuoted) {
			if (s.charAt(0) == '/')
				return keepLineNumbers ? extractLineFeeds(s) : '';
			else if (tripleQuoted != null || tripleQuotedShort != null) {
				var t = tripleQuoted != null ? tripleQuoted : tripleQuotedShort;
				return '"' + t.replace(/\\./g, function(s) { return s == '\\"' ? '"' : s; }).replace(/\n/g, '\\n').replace(/"/g, '\\"') +
				       '"' + (keepLineNumbers ? extractLineFeeds(s) : '');
			}
			else if (singleQuoted != null)
				return s;
			else 
				return '"' + s + '"';
		});
	}
	
	var hanson = {
			toJSON: toJSON,
			parse: function(input) {
				return JSON.parse(toJSON(input, true));
			},
			stringify: function(obj) {
				return JSON.stringify(obj);
			}
	};

	target[0][target[1]] = hanson;
})(typeof module === 'undefined' ? [this, 'HanSON'] : [module, 'exports']);

