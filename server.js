var express = require('express')
var app = express()
var debug = require('debug')('pubsub-server')
var fs =    require('fs')
var server

var minimist = require('minimist') // todo: move this out
var argv = require('minimist')(process.argv.slice(2))

// debugging
var output = argv['output'] || argv['O']
if (!process.env.DEBUG || output == 'stdout' || output == 'console') {
  debug = console.log.bind(console)
}
var stats = argv['stats'] || argv['v']

//SSL cert and key
var ssl_options = {
    cert:   argv['cert'] ? fs.readFileSync(argv['cert']) : null,
    key:    argv['key'] ? fs.readFileSync(argv['key']) : null,
}
var options = {}

// create a https or http server 
if (options.cert && options.key) {
  options = Object.assign(options, ssl_options)
  server = require('https').createServer(options, app)
} else {
  server = require('http').createServer(app)
}

var io = require('socket.io')(server)

var bodyParser = require('body-parser')
app.use( bodyParser.json() )      // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
}))

// cors
io.set('origins', '*:*')

// Routing
app.use(express.static(__dirname + '/public'))

module.exports = server
module.exports.app = app
module.exports.io = io
module.exports.opts = {
  stats: stats
}