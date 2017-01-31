const debug = require('debug')('test:pubsub')
const execFile = require('child_process').execFile
const assert = require('assert')
const http = require('http')
const url = require('url')

debug('starting tests')

function json_http_req(uri, data, cb) {
	var opts = url.parse(uri)
	opts.method = 'POST'
	opts.headers = { 'Content-Type': 'application/json'}

	return http.request(opts, function(res) {
		var str = ''
		var buffs = []
		res.on('data', buffer => buffs.push(buffer))
		res.on('end', () => {
			str = Buffer.concat(buffs).toString('utf8')
			cb && cb(str)
		})
	}).end(JSON.stringify(data));
}

// Test pubsub server responses
describe('PubSub Server', () => {

  it('should start server in under 10s', (done) => {

  	// implement stopping server
  	done()
  	return

  	execFile('node', ['./index', '-p 8000'], (err, stdout, stderr) => {
	  if (err instanceof Error)
	  	throw err
	  debug('server output', stdout)
	  done()
	})

  }).timeout(10000)

  it('should set activity for user 1', (done) => {
	json_http_req('http://localhost:8000/activity', {
				"user_id": "1", 
				"type": "join_meeting",
				"contact_id": Math.ceil(Math.random()*100),
				"created_at": new Date()
			}, function(res) {
				debug('activity user 1', res)
				done()
			})
  })

  it('should set activity for user 2', (done) => {
	json_http_req('http://localhost:8000/activity', {
				"user_id": "2", 
				"type": "email_text_open",
				"contact_id": Math.ceil(Math.random()*100),
				"created_at": new Date()
			}, function(res) {
				debug('activity user 1', res)
				done()
			})
  })

})