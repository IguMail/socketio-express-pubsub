const server = require('./server')
const io = server.io
const app = server.app
var debug = require('debug')('pubsub-route')
var _util = require('./util')

// Globals
var sockets = {}
var users = {}

app.post('/activity', (req, res) => {
  debug('Post /activity', req.body)

  var activity = req.body

  emitActivity(activity)

  res.json({
    status: true,
    body: req.body
  })
})

io.on('connection', (socket) => {
  var uid = _util.getUid()
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

  socket.on('activity', (data) => {
    var activity = data
    debug('activity', activity)

    emitActivity(activity)
    
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

// cleanup
function cleanSocket(uid, user_id, sockets) {
  delete sockets[uid]
  if (users[user_id]) {
    delete users[user_id].sockets[uid]
    if (Object.keys(users[user_id].sockets).length == 0) {
      delete users[user_id]
    }
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

function emitActivity(activity) {
  var user_id = activity.user_id
  var sockets = getUserSockets(user_id, users)
  debug('got sockets for user', user_id, sockets.length)
  Object.keys(sockets).forEach((uid) => {
    var socket = sockets[uid]
    var data = {
      activity: activity
    }
    debug('emitting activity to user ', user_id, data)
    socket.emit('activity', data)
  })
}

if (server.opts.stats) {
  setInterval(() => {
    debug('stats: sockets %d users %d mem %o', 
      Object.keys(sockets).length, Object.keys(users).length, _util.memoryUsage())
  }, 10 * 1000)
}