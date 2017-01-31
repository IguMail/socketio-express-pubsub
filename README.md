# SocketIO REST Pubsub #

A REST and WebSocket Service over Express and SocketIO

### PubSub with REST and WebSocket ###

* Some actions are better performed with REST, others with WebSocket. 
* PubSub over websocket and REST allows this. 

## Quick Start ##

Clone repo 
`git clone git+ssh://git@bitbucket.org/fijiweb/socketio-rest-pubsub.git`

`cd socketio-rest-pubsub`

Install dependencies
`npm install`

Start the server with default
`npm start`

## Starting Server ##

Usage: 
		`node index.js [--host hostname] [-p port] [-d] [-s stop] [--cert path] [--key path]`
	
	Examples:

		1) Secure HTTPS and TLS websocket with debugging

		  `node index.js --host 0.0.0.0 -p 8000 -d --cert /path/to/cert.crt --key /path/to/key.pem`
		
		2) Plain HTTP and websocket with debugging

		  `node index.js --host 0.0.0.0 -p 8000 -d`

		3) Plain HTTP and websocket default port (process.env.PORT)

		  `node index.js`

### Testing ###

Install mocha test runner globally
`npm i -g mocha`

Run tests with mocha
`npm test`

or 

`mocha`

### Benchmarking ###

Install websocket-bench globally
`npm i -g websocket-bench`

Set the max number of file descriptors
`ulimit -n 2048` or `ulimit -n 60000`

Run the benchmark tool with 1000 connections and 100 concurrent connections
`npm run benchmark -- -a 1000 -c 100`


### Profiling ###

Install node-inspector globally
`npm i -g node-inspector`

Run the server with node-inspector debugging attached
`node-debug index.js -p 8000 -d`

### Production ###

`ulimit -n 60000`

Install and use PM2 to manage the processes and load balance

 [http://pm2.keymetrics.io/docs/usage/quick-start/](http://pm2.keymetrics.io/docs/usage/quick-start/) 

Install PM2 globally
 `npm install pm2 -g` 

Start PM2 with just one process. Output to console.
 `pm2 start index.js -- -p 8000 -O console`

View logs
 `pm2 log index` 

Start PM2 with max number of processes available with logging.
 `pm2 start index.js -i 0 -e log/err.log -o log/out.log -- -p 8000 -O console`

 Monitor processes
 `pm2 monit`

Manage PM2 processes 
 `pm2 list` 
 `pm2 stop` 
 `pm2 restart` 
 `pm2 delete`
