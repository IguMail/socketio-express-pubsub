var minimist = require('minimist')
const execFile = require('child_process').execFile

var argv = require('minimist')(process.argv.slice(2))
var port = argv['p'] || process.env.PORT || 3000
var _debug = argv['debug'] || argv['d']
var host = argv['host'] || 'localhost'
var origin = argv['origin'] || argv['cors']
var output = argv['output'] || argv['O']
var verbose = argv['verbose'] || argv['v']

// debugging
if (_debug) {
	process.env.DEBUG = '*pubsub*'
}
var debug = process.env.DEBUG ? require('debug')('pubsub-index') : console.log
if (output == 'stdout' || output == 'console') {
	debug = console.log
	debug('debugging to console')
}


// stops the server
if (argv['s'] == 'stop') {
	// todo
	process.exit(0)
}

// stops the server
if (argv['h']) {
	debug(`SocketIO PubSub server
	Usage: 
		node index.js [--host hostname] [-p port] [-d] [-s stop] [--cert path] [--key path]
	
	Examples:

		1) Secure HTTPS and TLS websocket with debugging

		  node index.js --host 0.0.0.0 -p 8000 -d --cert /path/to/cert.crt --key /path/to/key.pem
		
		2) Plain HTTP and websocket with debugging

		  node index.js --host 0.0.0.0 -p 8000 -d

		3) Plain HTTP and websocket default port (process.env.PORT)

		  node index.js

	Copyright: 
		gabe@fijiwebdesign.com 
		http://fijiwebdesign.com
		`)
	process.exit(0)
}

// http server & socket.io
var server = require('./server')

// cors. eg: node index.js --cors '*:*'
if (origin) {
	server.io.set('origins', origin)
	debug('cors origin is: ', origin)
}

// bind and listen
server.listen(port, host, () => {
  debug('Starting server on %s %s with pid %d', 
  		process.platform, process.arch, process.pid)
  if (verbose) {
  	debug('Platform versions', process.versions)
	debug('Current directory', process.cwd())
	debug('Executed with', process.execPath)
	//debug('Environment', process.env)
  }
  
  debug('Server listening at host %s port %d', host, port)
})



