/*
 * test/parse.js - Tests for hanson.js # parse()
 * https://github.com/timjansen/handson
 */
var expect = require('chai').expect;
var hanson = require("../hanson.js");

describe('parse()', function() {
	it('parses HanSON', function() {
		expect(hanson.parse('[`a`, //\n2, c/**/]')).to.deep.equal(["a", 2, "c"]);
 	});
});
