var minimist = require('minimist')
const execFile = require('child_process').execFile

var argv = require('minimist')(process.argv.slice(2))
var port = argv['p'] || process.env.PORT || 3000
var _debug = argv['debug'] || argv['d']
var host = argv['host'] || 'localhost'
var origin = argv['origin'] || argv['cors']

// debugging
if (_debug) {
	process.env.DEBUG = '*pubsub*'
}
var debug = process.env.DEBUG ? require('debug')('pubsub-index') : console.log

// stops the server
if (argv['s'] == 'stop') {
	// todo
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
  debug('Server listening at host %s port %d', host, port)
})



