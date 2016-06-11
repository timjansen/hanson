/*
 * test/command.js - Tests for hanson CLI
 * https://github.com/timjansen/handson
 */
var exec = require('child_process').exec;
var expect = require('chai').expect;
var hanson = require("../hanson.js");
var fs = require('fs');

// Change to root project dir
process.chdir(__dirname + '/..');

describe('command', function() {
	after(function(done) {
		fs.unlink('output.json', done);
	});

	it('accepts file -> file', function(done) {
		exec('node hansoncmd.js test/data/sample.hson output.json', function(err, stdout, stderr) {
			expect(err).to.be.not.ok;
			expect(stdout).to.be.a.string;
			expect(stdout).to.be.not.ok;
			expect(stderr).to.be.not.ok;

			var obj = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
			expect(obj).to.have.property('listName', 'Sesame Street Monsters');
			expect(obj).to.have.property('content');
			expect(obj.content).to.be.an.array;
			expect(obj.content[0]).to.have.property('name', 'Cookie Monster');
			expect(obj.content[1]).to.have.property('name', 'Herry Monster');

			done();
		});
	});

	it('accepts STDIN -> file', function(done) {
		exec('node hansoncmd.js - output.json <test/data/sample.hson', function(err, stdout, stderr) {
			expect(err).to.be.not.ok;
			expect(stdout).to.be.a.string;
			expect(stdout).to.be.not.ok;
			expect(stderr).to.be.not.ok;

			var obj = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
			expect(obj).to.have.property('listName', 'Sesame Street Monsters');
			expect(obj).to.have.property('content');
			expect(obj.content).to.be.an.array;
			expect(obj.content[0]).to.have.property('name', 'Cookie Monster');
			expect(obj.content[1]).to.have.property('name', 'Herry Monster');

			done();
		});
	});

	it('accepts file -> STDOUT', function(done) {
		exec('node hansoncmd.js test/data/sample.hson - >output.json', function(err, stdout, stderr) {
			expect(err).to.be.not.ok;
			expect(stdout).to.be.a.string;
			expect(stdout).to.be.not.ok;
			expect(stderr).to.be.not.ok;

			var obj = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
			expect(obj).to.have.property('listName', 'Sesame Street Monsters');
			expect(obj).to.have.property('content');
			expect(obj.content).to.be.an.array;
			expect(obj.content[0]).to.have.property('name', 'Cookie Monster');
			expect(obj.content[1]).to.have.property('name', 'Herry Monster');

			done();
		});
	});

	it('accepts STDIN -> STDOUT', function(done) {
		exec('node hansoncmd.js - - <test/data/sample.hson >output.json', function(err, stdout, stderr) {
			expect(err).to.be.not.ok;
			expect(stdout).to.be.a.string;
			expect(stdout).to.be.not.ok;
			expect(stderr).to.be.not.ok;

			var obj = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
			expect(obj).to.have.property('listName', 'Sesame Street Monsters');
			expect(obj).to.have.property('content');
			expect(obj.content).to.be.an.array;
			expect(obj.content[0]).to.have.property('name', 'Cookie Monster');
			expect(obj.content[1]).to.have.property('name', 'Herry Monster');

			done();
		});
	});
});
