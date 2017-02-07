var express = require('express')
var app = express()
var debug = require('debug')('pubsub-server')
var fs =    require('fs')
var server

var options = require('./options')

// debugging
if (!options.debug || options.output == 'stdout' || options.output == 'console') {
  debug = console.log.bind(console)
}

//SSL cert and key
var ssl_options = {
    cert:   options.cert ? fs.readFileSync(options.cert) : null,
    key:    options.key ? fs.readFileSync(options.key) : null,
}

// create a https or http server 
if (options.cert && options.key) {
  server = require('https').createServer(ssl_options, app)
} else {
  server = require('http').createServer(app)
}

var io = require('socket.io')(server)

var bodyParser = require('body-parser')
app.use( bodyParser.json() )      // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
}))

// Routing
app.use(express.static(__dirname + '/public'))

module.exports = server
module.exports.app = app
module.exports.io = io