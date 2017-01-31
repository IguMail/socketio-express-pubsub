$(function() {

  // Initialize variables
  var $window = $(window)
  var $inputUserId = $('#inputUserId') // Input for user id
  var $messages = $('#messages') // Messages area

  var $btnAuth = $('#btn-auth') // The chatroom page

  var socket = io()

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

  $btnAuth.click(function() {
    authenticate($inputUserId.val())
  })

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message + ' ' + JSON.stringify(options))
    $messages.append($el)
    console.log(message, options)
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