const execFile = require('child_process').execFile
const debug = require('debug')('benchmark:pubsub')
var minimist = require('minimist')
var argv = require('minimist')(process.argv.slice(2))

var total = argv['a'] || 1000
var concurrency = argv['c'] || 100
var host = argv['host']

// websocket-bench -a 1000 -c 500
debug('Benchmarking with: websocket-bench -a %d -c %d', total, concurrency)
execFile('websocket-bench', [
	'-a', total,
	'-c', concurrency,
	host || 'http://localhost:8000',
	'-g', './benchmark/websocket-bench-generator.js'
	], 
	(err, stdout, stderr) => {
	  if (err instanceof Error)
	  	throw err
	  debug('BenchMark Results:', stdout)
	})