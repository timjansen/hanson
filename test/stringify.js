/*
 * test/stringify.js - Tests for hanson.js # stringify()
 * https://github.com/timjansen/handson
 */
var expect = require('chai').expect;
var hanson = require("../hanson.js");

describe('stringify()', function() {
	it('writes JSON/HanSON', function() {
		expect(hanson.stringify(hanson.parse('[`a`, //\n2, c/**/]'))).to.deep.equal(JSON.stringify(["a",2,"c"]));
 	});
});
