$(function() {

  var socket = io()
  var log = console.log.bind(console)
  var myUserId = 1

  authenticate(myUserId)

  function authenticate (userId) {
    var data = {
      user_id: userId,
      token: '123'
    }
    myUserId = userId
    socket.emit('auth', data)
    log('Authenticating', data)
  }

  socket.on('auth', function(data) {
    log('auth', data)
  })

  socket.on('activity', function(data) {
    log('activity', data)
  })

  socket.on('disconnect', function () {
    log('you have been disconnected')
  })

  socket.on('reconnect', function () {
    log('you have been reconnected')
    if (myUserId) {
      authenticate (myUserId)
    }
  })

  socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed')
  })

})