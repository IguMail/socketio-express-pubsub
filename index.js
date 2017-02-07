const minimist = require('minimist')

const options = require('./options')

// debugging
if (options.debug) {
	process.env.DEBUG = '*pubsub*'
}
var debug = options.debug ? require('debug')('pubsub-index') : console.log.bind(console)
if (options.output == 'stdout' || options.output == 'console') {
	debug = console.log.bind(console)
	debug('debugging to console')
}

// stops the server
if (options.stop == 'stop') {
	// todo
	process.exit(0)
}

// stops the server
if (options.help) {
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

// attach routes
require('./routes')

// cors. eg: node index.js --cors '*:*'
if (options.origin) {
	server.io.set('origins', options.origin)
	debug('cors origin is: ', options.origin)
}

// bind and listen
server.listen(options.port, options.host, () => {
  debug('Starting server on %s %s with pid %d', 
  		process.platform, process.arch, process.pid)
  if (options.verbose) {
  	debug('Platform versions', process.versions)
	debug('Current directory', process.cwd())
	debug('Executed with', process.execPath)
	//debug('Environment', process.env)
  }
  
  debug('Server listening at http://%s:%d/', options.host, options.port)
})

if (options.max_conns) {
	try {
		const posix = require('posix')
		var curr_max_conns = posix.getrlimit('nofile')
		posix.setrlimit('nofile', { soft: options.max_conns, hard: options.max_conns })
		debug('Set max-connections limit to %d', posix.getrlimit('nofile'))
	} catch(e) {
		debug('ERROR %o', e)
		debug('Could not set max-connections limit (ulimit -s %d) !!', options.max_conns)
		debug('You will be limited to the systems limit on open files: %o', curr_max_conns)
		debug('see: http://stackoverflow.com/questions/34588/how-do-i-change-the-number-of-open-files-limit-in-linux')
	}
}

