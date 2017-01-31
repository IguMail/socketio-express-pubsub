var minimist = require('minimist')
const execFile = require('child_process').execFile

var argv = require('minimist')(process.argv.slice(2))
var port = argv['p'] || process.env.PORT || 3000
var _debug = argv['debug'] || argv['d']
var host = argv['host'] || 'localhost'

if (_debug) {
	process.env.DEBUG = '*pubsub*'
}
var debug = process.env.DEBUG ? require('debug')('pubsub-index') : console.log

// stops the server
if (argv['s'] == 'stop') {
	// todo
	process.exit(0)
}

// start server
var server = require('./server')
server.listen(port, host, () => {
  debug('Server listening at host %s port %d', host, port)
})



