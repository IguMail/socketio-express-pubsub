var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var uuid = require('node-uuid')
var debug = require('debug')('pubsub-server')

var bodyParser = require('body-parser')
app.use( bodyParser.json() )      // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
}))

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
  sockets.forEach((socket) => {
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

  debug('connection', Object.keys(socket))

  // when the client emits 'auth', this listens and executes
  socket.on('auth', (data) => {
    debug('auth', data)
    var success = false
    if (data.user_id && data.token) {
      // todo: authenticate user
      success = true

      addUserSocket(data.user_id, socket, users)
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
    delete sockets[uid]
  })
})

function authenticate(user_id, token) {
  // todo: implement
}

function addUserSocket(user_id, socket, users) {
  debug('addUserSocket', user_id)
  if (!users[user_id]) {
    users[user_id] = {
      sockets: []
    }
  }
  users[user_id].sockets.push(socket)
}

function getUserSockets(user_id, users) {
  debug('getUserSockets', user_id)
  if (!users[user_id]) {
    return []
  }
  return users[user_id].sockets
}

module.exports = server