var msg_id = 1
var user_id = 1
var conn_id = 1
module.exports = {
       /**
        * Before connection (optional, just for faye)
        * @param {client} client connection
        */
       beforeConnect : function(client) {
         // Example:
         // client.setHeader('Authorization', 'OAuth abcd-1234')
         // client.disable('websocket')
       },

       /**
        * On client connection (required)
        * @param {client} client connection
        * @param {done} callback function(err) {}
        */
       onConnect : function(client, done) {
        user_id = Math.ceil(Math.random() * 1000000)
         // Faye client
         // client.subscribe('/channel', function(message) { })

         // Socket.io client
         client.emit('auth', {
          conn_id: conn_id++,
          msg_id: msg_id++,
          user_id: user_id,
          token: '123'
         })

         var sendMessage = this.sendMessage
         var count = Math.ceil(Math.random()*10)-1
         for (var i = 0; i < count; i++) {
          var s = Math.ceil(Math.random()*10)-1
          setTimeout(function() {
            sendMessage(client, () => {})
           }, s * 1000)
         }

         // Primus client
         // client.write('Sailing the seas of cheese')

         // WAMP session
         // client.subscribe('com.myapp.hello').then(function(args) { })

         done()
       },

       /**
        * Send a message (required)
        * @param {client} client connection
        * @param {done} callback function(err) {}
        */
       sendMessage : function(client, done) {
        var i = Math.ceil(Math.random()*3)-1
        var type = ["join_meeting", "email", "email_opened"][i]
         
         client.emit('activity', {
          "conn_id": conn_id,
          "msg_id": msg_id++,
          "user_id": user_id, 
          "type": type,
          "contact_id": Math.ceil(Math.random()*100),
          "created_at": new Date()
        })

         done()
       },

       /**
        * WAMP connection options
        */
       options : {
         // realm: 'chat'
       }
    }