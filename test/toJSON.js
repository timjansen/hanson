/*
 * test/toJSON.js - Tests for hanson.js # toJSON()
 * https://github.com/timjansen/handson
 */
var expect = require('chai').expect;
var hanson = require("../hanson.js");

describe('toJSON()', function() {
	var toJSON = hanson.toJSON;
	it('does not touch regular JSON', function() {
		var a;
		expect(toJSON(a = "[1,2, 3]")).to.equal(a);
		expect(toJSON(a = '[true, null, false, "null", "", ",", ", ]"]')).to.equal(a);
		expect(toJSON(a = '"\""')).to.equal(a);
		expect(toJSON(a = '"\\"')).to.equal(a);
		expect(toJSON(a = '"\\\""')).to.equal(a);
		expect(toJSON(a = '"\\t\\\\\\\""')).to.equal(a);
		expect(toJSON(a = '"`x``"')).to.equal(a);
		expect(toJSON(a = '{"a": "b", "c": ["a", "b\\nc"]}')).to.equal(a);
 	});
	
	it('removes commas at the end of a list/object', function() {
		expect(toJSON("[1, 2, 3, ]")).to.equal("[1, 2, 3 ]");
		expect(toJSON("[1, 2, 3,]")).to.equal("[1, 2, 3]");
		expect(toJSON("[1, 2, 3,\n]")).to.equal("[1, 2, 3\n]");
		expect(toJSON("[1, 2, 3, /*x*/]")).to.equal("[1, 2, 3 ]");
		expect(toJSON("[1, 2, 3,//\n]")).to.equal("[1, 2, 3]");
		expect(toJSON('{"a":1, "b":2,}')).to.equal('{"a":1, "b":2}');
 	});
	
	it('ignores singleline comments', function() {
		expect(toJSON("[1, // bla\n 2// blub\n//sadsad\n, 3]//\n")).to.equal("[1,  2, 3]");
		expect(toJSON("[1]//")).to.equal("[1]");
 	});

	it('ignores multiline comments', function() {
		expect(toJSON("[1, /* abc */ 2, 3]")).to.equal("[1,  2, 3]");
		expect(toJSON("/* xxx*/[1,/* abc */ 2, 3]")).to.equal("[1, 2, 3]");
		expect(toJSON("[1, /* abc */2, 3]/* []]]][ */ ")).to.equal("[1, 2, 3] ");
		expect(toJSON("[1, /* abc \"\"\" \n d \"\"\" */ 2, 3] // wsdff")).to.equal("[1,  2, 3] ");
 	});
	
	it('quotes identifiers', function() {
		expect(toJSON('a')).to.equal('"a"');
		expect(toJSON('[1, abc, a1b2B3, $$$, _$s, "X", 3]')).to.equal('[1, "abc", "a1b2B3", "$$$", "_$s", "X", 3]');
		expect(toJSON('{a: 1, b: c2$, c: d_, "f": "g\\n\\t\\\\h"}')).to.equal('{"a": 1, "b": "c2$", "c": "d_", "f": "g\\n\\t\\\\h"}');
 	});

	it('supports single-quoted strings', function() {
		expect(toJSON("''")).to.equal('""');
		expect(toJSON("'a'")).to.equal('"a"');
		expect(toJSON("'\"'")).to.equal('"\\""');
		expect(toJSON("'\\''")).to.equal('"\'"');
		expect(toJSON("'\\\\'")).to.equal('"\\\\"');
 	});
	
	it('supports template-quoted strings', function() {
		expect(toJSON('``')).to.equal('""');
		expect(toJSON('`a`')).to.equal('"a"');
		expect(toJSON('`a\nb\nc\\\\d\\``')).to.equal('"a\\nb\\nc\\\\d`"');
		expect(toJSON('`\\`\\``')).to.equal('"``"');
		expect(toJSON('`\\\\`')).to.equal('"\\\\"');
		expect(toJSON('`\nABC\t\n`')).to.equal('"\\nABC\\t\\n"');
		expect(toJSON('`\n\rABC\n\r`')).to.equal('"\\n\\rABC\\n\\r"');
		expect(toJSON('`\\"""`')).to.equal('"\\"\\"\\""');
		expect(toJSON('`g\n\t\\t\\\\h`')).to.equal('"g\\n\\t\\t\\\\h"');
		expect(toJSON('{`a`: 1, b: `c2"\n$`, c: d_, `f`: `g\n\t\\t\\\\h`}')).to.equal('{"a": 1, "b": "c2\\"\\n$", "c": "d_", "f": "g\\n\\t\\t\\\\h"}');
 	});
	
	it('mixed input', function() {
		expect(toJSON('{a: 1, `b"b`: c2$, /**/c:/*x*/d_, d: [true, null,], \'e\': false, "f"://bla\n "g\\n\\t\\\\h" , }//x')).to.equal('{"a": 1, "b\\"b": "c2$", "c":"d_", "d": [true, null], "e": false, "f": "g\\n\\t\\\\h"  }');
 	});
	
	it('keeps lines', function() {
		expect(toJSON('[`x\n\ny`, 1,0\n,/*\na\nb\n\n*/2]', false)).to.equal('["x\\n\\ny", 1,0\n,2]');
		expect(toJSON('[`x\n\ny`, 1,0\n,/*\na\nb\n\n*/2]', true)).to.equal('["x\\n\\ny"\n\n, 1,0\n,\n\n\n\n2]');
 	});
});
