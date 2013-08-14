HanSON - JSON for Humans
========================

In Short
---------
* HanSON is JSON with comments, multi-line strings and unquoted property names.
* Comments use JavaScript syntax (//, /**/).
* Multi-line strings are triple-quotes like in Python: they start and end with """.
* Property names do not require quotes if they are valid JavaScript identifiers.
* Every JSON string is valid HanSON.
* HanSON can easily be converted to real JSON. 



Intro
------
JSON is a great and very simple data format, especially if you are working with JavaScript. Increasingly configuration 
files are written in JSON, and often it is used as a simpler alternative to XML. Unfortunately, when you are creating
larger JSON files by hand, you will notice some shortcomings: you need to quote all strings, even object keys; 
you can not easily have strings with several lines; and you can not include comments. 

HanSON is an extension of JSON that fixes those shortcomings with three simple additions to the JSON spec:
* quotes for strings are optional if they follow JavaScript identifier rules.
* you can alternately use triple quotes for strings. A triple-quoted string may span several lines
  and you are not required to escape quote characters, unless you need three of them. Backslashes still
  need to be escaped, and all other backslash-escape sequences work like in regular JSON.
* you can use JavaScript comments, both single line (//) and multi-line comments (/* */), in all places where JSON allows whitespace. 
  
  
  
Example
--------
```js
{
  listName: "Sesame Street Monsters", // note that listName needs no quotes
  content: [
    {
      name: "Cookie Monster",
      /* Note the triple quotes and unescaped single quotes in the next string */
      background: """Cookie Monster used to be a
monster that ate everything, especially cookies.
These days he is forced to eat "healthy" food."""
    }, {
      name: "Herry Monster",
      background: """Herry Monster is a furry blue monster with a purple nose.
He's mostly retired today."""
    }
   ]
}
```
  
  
Converting HanSON to JSON
----------------------------
*hanson* is a simple command-line converter that will convert HanSON files to JSON. 
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
	return input.replace(/(?:true|false|null)(?=[^\w_$]|$)|([a-zA-Z_$][\w_$]*)|"""([^]*?(?:\\"""|[^"]""|[^"]"|\\\\|[^\\"]))"""|"""("?"?)"""|"(?:\\.|[^"])*"|\/\*[^]*?\*\/|\/\/.*\n?/g, 
	  function(s, identifier, tripleQuoted, tripleQuotedShort) {
		if (s.charAt(0) == '/')
			return '';
		else if (identifier != null)
				return '"' + identifier + '"';
		else if (tripleQuoted != null || tripleQuotedShort != null) {
			var t = tripleQuoted != null ? tripleQuoted : tripleQuotedShort;
			return '"' + t.replace(/\\./g, function(s) { return s == '\\"' ? '"' : s; }).replace(/\n/g, '\\n').replace(/"/g, '\\"') + '"';
		}
		else 
			return s;
	 });
}
```


License
--------
All code and documentation has been dedicated to the public domain:
http://unlicense.org/






  