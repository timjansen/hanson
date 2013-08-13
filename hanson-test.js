/*
 * hanson-test.js - Tests for hanson.js. 
 * https://github.com/timjansen/handson
 */
var assert = require("assert");
var hanson = require("./hanson.js");

describe('toJSON()', function() {
	var toJSON = hanson.toJSON;
	it('does not touch regular JSON', function() {
		var a = "[1,2, 3]";
		assert.equal(toJSON(a), a);
		
		a = '{"a": "b", "c": ["a", "b\\nc"]}';
		assert.equal(toJSON(a), a);
 	});
	
	it('ignores singleline comments', function() {
		assert.equal(toJSON("[1, // bla\n 2// blub\n//sadsad\n, 3]//\n"), 
					      "[1,  2, 3]");
		assert.equal(toJSON("[1]//"), 
					      "[1]");
 	});

	it('ignores multiline comments', function() {
		assert.equal(toJSON("[1, /* abc */ 2, 3]"), 
					      "[1,  2, 3]");
		assert.equal(toJSON("/* xxx*/[1,/* abc */ 2, 3]"), 
					      "[1, 2, 3]");
		assert.equal(toJSON("[1, /* abc */2, 3]/* []]]][ */ "), 
					      "[1, 2, 3] ");
		assert.equal(toJSON("[1, /* abc \"\"\" \n d \"\"\" */ 2, 3] // wsdff"), 
					      "[1,  2, 3] ");
 	});
	
	it('quotes identifiers', function() {
		assert.equal(toJSON('a'), 
					      '"a"');
		assert.equal(toJSON('[1, abc, a1b2B3, $$$, _$s, "X", 3]'), 
					      '[1, "abc", "a1b2B3", "$$$", "_$s", "X", 3]');
		assert.equal(toJSON('{a: 1, b: c2$, c: d_, "f": "g\\n\\t\\\\h"}'), 
					      '{"a": 1, "b": "c2$", "c": "d_", "f": "g\\n\\t\\\\h"}');
 	});

	it('supports triple-quoted strings', function() {
		assert.equal(toJSON('""""""'), 
					      '""');
		assert.equal(toJSON('"""a"""'), 
					      '"a"');
		assert.equal(toJSON('"""a\nb\nc\\\\d"""'), 
					      '"a\\nb\\nc\\\\d"');
		assert.equal(toJSON('"""""""'), 
					'"\\""');
		assert.equal(toJSON('"""\\""""'), 
					'"\\""');
		assert.equal(toJSON('"""a""""'), 
					'"a\\""');
		assert.equal(toJSON('""""a"""'), 
					'"\\"a"');
		assert.equal(toJSON('""""""""'), 
					'"\\"\\""');
		assert.equal(toJSON('"""\\\\"""'), 
					'"\\\\"');
		assert.equal(toJSON('"""\nABC\n"""'), 
					'"\\nABC\\n"');
		assert.equal(toJSON('"""\\""""""'), 
	      '"\\"\\"\\""');
		assert.equal(toJSON('"""g\n\t\\t\\\\h"""'), 
	      '"g\\n\t\\t\\\\h"');
		assert.equal(toJSON('{"""a""": 1, b: """c2"\n$""", c: d_, """f""": """g\n\t\\t\\\\h"""}'), 
					        '{"a": 1, "b": "c2\\"\\n$", "c": "d_", "f": "g\\n\t\\t\\\\h"}');
 	});
	
	it('mixed input', function() {
		assert.equal(toJSON('{a: 1, """b"b""": c2$, /**/c:/*x*/d_, "f"://bla\n "g\\n\\t\\\\h"}//x'), 
					        '{"a": 1, "b\\"b": "c2$", "c":"d_", "f": "g\\n\\t\\\\h"}');
 	});
	it('keeps lines', function() {
		assert.equal(toJSON('["""x\n\ny""", 1,0\n,/*\na\nb\n\n*/2]', false), 
        					'["x\\n\\ny", 1,0\n,2]');
		assert.equal(toJSON('["""x\n\ny""", 1,0\n,/*\na\nb\n\n*/2]', true), 
					        '["x\\n\\ny"\n\n, 1,0\n,\n\n\n\n2]');
 	});
});

describe('parse()', function() {
	it('parses HanSON', function() {
		assert.deepEqual(hanson.parse('["""a""", //\n2, c/**/]'), ["a", 2, "c"]);
 	});
});

describe('stringify()', function() {
	it('writes JSON/HanSON', function() {
		assert.deepEqual(hanson.stringify(hanson.parse('["""a""", //\n2, c/**/]')), JSON.stringify(["a",2,"c"]));
 	});
});

