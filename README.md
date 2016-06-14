HanSON - JSON for Humans
========================

In Short
---------
* HanSON is JSON with comments, multi-line strings and unquoted property names.
* Comments use JavaScript syntax (//, /**/).
* Supports backticks as quotes (``) for multi-line strings.
* You can use either double-quotes ("") or single-quotes ('') for single-line strings.
* Property names do not require quotes if they are valid JavaScript identifiers.
* Commas after the last list element or property will be ignored.
* Every JSON string is valid HanSON.
* HanSON can easily be converted to real JSON. 



Intro
------
JSON is a great and very simple data format, especially if you are working with JavaScript. Increasingly configuration 
files are written in JSON, and often it is used as a simpler alternative to XML. Unfortunately, when you are creating
larger JSON files by hand, you will notice some shortcomings: you need to quote all strings, even object keys; 
you can not easily have strings with several lines; and you can not include comments. 

HanSON is an extension of JSON that fixes those shortcomings with four simple additions to the JSON spec:
* quotes for strings are optional if they follow JavaScript identifier rules.
* you can alternatively use backticks, as in ES6's template string literal, as quotes for strings. 
  A backtick-quoted string may span several lines and you are not required to escape regular quote characters,
  only backticks. Backslashes still need to be escaped, and all other backslash-escape sequences work like in 
  regular JSON.
* for single-line strings, single quotes ('') are supported in addition to double quotes ("")
* you can use JavaScript comments, both single line (//) and multi-line comments (/* */), in all places where JSON allows whitespace.
* Commas after the last list element or object property will be ignored. 
  
  

Example HanSON
---------------
```js
{
  listName: "Sesame Street Monsters", // note that listName needs no quotes
  content: [
    {
      name: "Cookie Monster",
      /* Note the template quotes and unescaped regular quotes in the next string */
      background: `Cookie Monster used to be a
monster that ate everything, especially cookies.
These days he is forced to eat "healthy" food.`
    }, {
      name: "Herry Monster",
      background: `Herry Monster is a furry blue monster with a purple nose.
He's mostly retired today.`
    },    // don't worry, the trailing comma will be ignored
   ]
}
```
  
  
Converting HanSON to JSON
----------------------------
*hanson* is a command-line converter that will convert HanSON files to JSON. 
It is a Nodes.js package that can be installed using npm:
> npm install -g hanson

After installation, convert a single file like this:
> hanson input.hson output.json

You can also convert multiple files using the -m options. It will automatically change the file extension to .json:
> hanson -m input1.hson input2.hson input3.hson input4.hson input5.hson



Grunt Task to Convert HanSON to JSON
--------------------------------------

The Grunt plugin <a href="https://github.com/timjansen/grunt-hanson-plugin">grunt-hanson-plugin</a> can help you converting 
HanSON files to JSON. More about it in its own <a href="https://github.com/timjansen/grunt-hanson-plugin">repository</a>.


Webpack loader to Convert HanSON to JSON
--------------------------------------

The Webpack loader [hson-loader](https://github.com/kentcdodds/hson-loader) can help you converting HanSON files to JSON. More
about it in its own [repository](https://github.com/kentcdodds/hson-loader).


Reading HanSON in JavaScript
-------------------------------
*hanson.js* is a simple library for Node.js that provides you with a HanSON object which works pretty much like the *JSON*
object, with the only difference being that hanson.parse() will accept HanSON.

```js
var hanson = require('hanson');
var obj = hanson.parse(hansonSrc);
```
 
hanson.stringify() will currently write regular JSON and just invokes JSON.stringify(), but future versions may pretty-print 
the output and use triple-quotes for multi-line strings instead of '\n'.

There's also a toJSON() function that can convert your HanSON source into JSON:
```js
var hanson = require('hanson');
var json = hanson.parse(hansonSrc);
```



How Can HanSON Help Me?
--------------------------
* If you have configuration or descriptor files (like package.json), you can write them as HanSON and convert them 
  with the command line tool or the Grunt task.
* Multi-line strings make it feasible to use JSON/HanSON for larger template systems, e.g. to generate static HTML pages. 
  Just write a small script that accepts HanSON and uses your favorite JavaScript template engine to create HTML.
  Actually this is why I started HanSON - I wanted to replace my XSLT-based template system.
* You can, of course, extend your application to accept HanSON files.



Function to Convert HanSON
----------------------------
Want to use HanSON in your program, without including any libraries? Use this function to convert
HanSON to JSON. It returns a JSON string that can be read using JSON.parse().

```js
function toJSON(input) {
		var UNESCAPE_MAP = { '\\"': '"', "\\`": "`", "\\'": "'" };
		var ML_ESCAPE_MAP = {'\n': '\\n', "\r": '\\r', "\t": '\\t', '"': '\\"'};
		function unescapeQuotes(r) { return UNESCAPE_MAP[r] || r; }
		
		return input.replace(/`(?:\\.|[^`])*`|'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\/\*[^]*?\*\/|\/\/.*\n?/g, // pass 1: remove comments 
							 function(s) {
			if (s.charAt(0) == '/')
				return '';
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
				return '"' + multilineQuote.replace(/\\./g, unescapeQuotes).replace(/[\n\r\t"]/g, function(r) { return ML_ESCAPE_MAP[r]; }) + '"';
			else if (singleQuote != null)
				return '"' + singleQuote.replace(/\\./g, unescapeQuotes).replace(/"/g, '\\"') + '"';
			else 
				return s;
		});
}
```

Changes
--------
* August 14, 2013: First release (0.1.0)
* August 15, 2013: Replaced triple-quotes with backticks (1.0.0, backward-incompatible change)
* August 19, 2013: Added support for single-quotes (1.1.0)
* June 14, 2016: Support for STDIN/STDOUT in command line. Improved tests. Thank you, Matt Carter (1.2.0)


License
--------
All code and documentation has been dedicated to the public domain:
http://unlicense.org/






  
