var express = require('express')
var app = express()
var uuid = require('node-uuid')
var debug = require('debug')('pubsub-server')
var fs =    require('fs')
var server

var minimist = require('minimist') // todo: move this out
var argv = require('minimist')(process.argv.slice(2))

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

// Globals
var sockets = {}
var users = {}

app.post('/activity', (req, res) => {
  debug('Post /activity', req.body)

  var activity = req.body
  var user_id = activity.user_id

  var sockets = getUserSockets(user_id, users)
  debug('got sockets for user', user_id, sockets.length)
  Object.keys(sockets).forEach((uid) => {
    var socket = sockets[uid]
    var data = {
      activity: activity
    }
    debug('emitting to user ', user_id, data)
    socket.emit('activity', data)
  })

  res.json({
    status: true,
    body: req.body
  })
})

io.on('connection', (socket) => {
  var uid = uuid.v4()
  sockets[uid] = socket
  var user_id = null

  debug('connection', uid)

  // when the client emits 'auth', this listens and executes
  socket.on('auth', (data) => {
    debug('auth', data)
    var success = false
    if (data.user_id && data.token) {
      // todo: authenticate user
      success = true

      user_id = data.user_id

      addUserSocket(data.user_id, socket, users, uid)
    }

    var data = {
      status: success
    }
    debug('sending auth data:', data)
    socket.emit('auth', data)
    
  })

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    debug('disconnect', uid)
    cleanSocket(uid, user_id, sockets)
  })

  socket.on('error', (e) => {
    debug('Error on socket', uid, e)
    cleanSocket(uid, user_id, sockets)
  })

  socket.on('connect_failed', (e) => {
    debug('Connection failed on socket', uid, e)
    cleanSocket(uid, user_id, sockets)
  })
})

function cleanSocket(uid, user_id, sockets) {
  delete sockets[uid]
  if (users[user_id]) {
    delete users[user_id].sockets[uid]
  }
}

function authenticate(user_id, token) {
  // todo: implement
}

function addUserSocket(user_id, socket, users, uid) {
  debug('addUserSocket', user_id)
  if (!users[user_id]) {
    users[user_id] = {
      sockets: {}
    }
  }
  users[user_id].sockets[uid] = socket
}

function getUserSockets(user_id, users) {
  debug('getUserSockets', user_id)
  if (!users[user_id]) {
    return []
  }
  return users[user_id].sockets
}

module.exports = server
module.exports.io = io