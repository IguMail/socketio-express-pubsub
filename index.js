var minimist = require('minimist')
var server = require('./server')
const execFile = require('child_process').execFile

var argv = require('minimist')(process.argv.slice(2))
var port = argv['p'] || process.env.PORT || 3000

// stops the server
if (argv['s'] == 'stop') {
	// todo
	process.exit(0)
}

// start server
server.listen(port, () => {
  console.log('Server listening at port %d', port)
})



