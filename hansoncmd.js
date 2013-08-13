#! /usr/bin/env node
/*
 * hanson.js - Command line tool for HanSON
 * 
 * Public Domain. Use, modify and distribute it any way you like. No attribution required.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * For details, see LICENSE or http://unlicense.org/
 *
 *
 * To convert a single file, just write
 *   handson input.hson output.json
 *
 * You can also convert multiple files using the -m options. It will automatically change the file extension to .json:
 *   handson -m input1.hson input2.hson input3.hson input4.hson input5.hson
 * 
 * Use the -l option to keep line numbers by inserting spaces into the resulting JSON file:
 *   handson -l input.hson output.json
 * 
 * https://github.com/timjansen/hanson
 */

var fs = require("fs");
var hanson = require('./hanson.js');


var args = process.argv.slice(2);
var keepLineNumbers = false;
var multiFile = false;

while (/^-/.test(args[0])) {
	var a = args.shift();
	if (/^--?h(elp)?$/.test(a))
		printHelp();
	else if (a == '-l')
		keepLineNumbers = true;
	else if (a == '-m')
		multiFile = true;
	else
		printHelp("Unknown option: " + a);
}

if (multiFile) {
	for (var i = 0; i < args.length; i++)
		if (!fs.existsSync(args[i]))
			error("File not found: "+ args[i]);
	
	for (var i = 0; i < args.length; i++)
		convert(args[i], getOutputFileName(args[i]));
}
else {
	if (args.length < 1)
		error("No file names specified.");
	if (args.length < 2)
		error("No output file specified.");
	if (args.length > 2)
		error("Too many arguments - need input file and output file (or forgot -m option?)");

	if (!fs.existsSync(args[0]))
		error("File not found: "+ args[0]);
	
	convert(args[0], args[1]);
}


function getOutputFileName(file) {
	return file.replace(/\.hson$/, '') + '.json';
}

function convert(inputFile, outputFile) {
	var src = fs.readFileSync(inputFile).toString();
	fs.writeFileSync(outputFile, hanson.toJSON(src, keepLineNumbers));
}

function error(msg) {
	console.log('ERROR:', msg, '\n');
	console.log("Run hanson -h for help.");
	process.exit(2);
}

function printHelp(extraMsg) {
	if (extraMsg)
		console.log(extraMsg, '\n');
	
	console.log('Hanson converts HanSON files into JSON files.');
	console.log('Syntax: hanson [-l] inputFile.hson outputFile.json');
	console.log('        hanson [-l] -m inputFile1.hson [inputFile2.hson [inputFile3.hson...]]');
	console.log();
	console.log('Options: -l : keep line numbers in output files (adds empty lines)');
	console.log('         -m : multi-input files. Will write .json file for each.');
	console.log();
	process.exit(1);
}

