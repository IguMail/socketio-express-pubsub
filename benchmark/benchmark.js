process.env.DEBUG = '*benchmark*'
const execFile = require('child_process').execFile
var minimist = require('minimist')
var argv = require('minimist')(process.argv.slice(2))

var total = argv['a'] || 1000
var concurrency = argv['c'] || 100
var scheme = 'http://'
var host = argv['host'] || 'localhost'
var port = argv['port'] || argv['p'] || 8000
var debug_match = argv['debug'] || argv['d']
var max_conns = total

if (debug_match && debug_match !== true) {
	process.env.DEBUG = debug_match
}

const debug = require('debug')('benchmark:pubsub')

// try setting the ulimit -s 
try {
	const posix = require('posix')
	var curr_max_conns = posix.getrlimit('nofile')
	posix.setrlimit('nofile', { soft: max_conns, hard: max_conns })
	debug('Set max-connections limit to %d', posix.getrlimit('nofile'))
} catch(e) {
	debug('ERROR %o', e)
	debug('Could not set max-connections limit (ulimit -s %d) !!', max_conns)
	debug('You will be limited to the systems limit on open files: %o', curr_max_conns)
	debug('see: http://stackoverflow.com/questions/34588/how-do-i-change-the-number-of-open-files-limit-in-linux')
}

// websocket-bench -a 1000 -c 500
debug('Benchmarking with: websocket-bench -a %d -c %d', total, concurrency)
execFile('websocket-bench', [
	'-a', total,
	'-c', concurrency,
	scheme + host + ':' + port,
	'-g', './benchmark/websocket-bench-generator.js'
	], 
	(err, stdout, stderr) => {
	  if (err instanceof Error)
	  	throw err
	  debug('BenchMark Results:', stdout)
	})