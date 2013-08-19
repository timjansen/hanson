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
 * - Multi-line strings use ES6's template quote syntax: ``.
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
		var UNESCAPE_MAP = { '\\"': '"', "\\`": "`", "\\'": "'" };
		var ML_ESCAPE_MAP = {'\n': '\\n', "\r": '\\r', "\t": '\\t', '"': '\\"'};
		function unescapeQuotes(r) { return UNESCAPE_MAP[r] || r; }
		
		return input.replace(/`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\/\*[^]*?\*\/|\/\/.*\n?/g, // pass 1: remove comments 
							 function(s) {
			if (s.charAt(0) == '/')
				return keepLineNumbers ? extractLineFeeds(s) : '';
			else  
				return s;
		})
		.replace(/(?:true|false|null)(?=[^\w_$]|$)|([a-zA-Z_$][\w_$]*)|`((?:\\.|[^`])*)`|'((?:\\.|[^'])*)'|"(?:\\.|[^"])*"|(,)(?=\s*[}\]])/g, // pass 2: requote 
							 function(s, identifier, multilineQuote, singleQuote, lonelyComma) {
			if (lonelyComma)
				return '';
			else if (identifier != null)
					return '"' + identifier + '"';
			else if (multilineQuote != null)
				return '"' + multilineQuote.replace(/\\./g, unescapeQuotes).replace(/[\n\r\t"]/g, function(r) { return ML_ESCAPE_MAP[r]; }) +
				       '"' + (keepLineNumbers ? extractLineFeeds(multilineQuote) : '');
			else if (singleQuote != null)
				return '"' + singleQuote.replace(/\\./g, unescapeQuotes).replace(/"/g, '\\"') + '"';
			else 
				return s;
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

