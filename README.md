# SocketIO REST Pubsub #

A REST and WebSocket Service over Express and SocketIO

### PubSub with REST and WebSocket ###

* Some actions are better performed with REST, others with WebSocket. 
* PubSub over websocket and REST allows this. 

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

Start PM2 with just one process
 `pm2 start index.js -- -p 8000`

Start PM2 with max number of processes available with logging.
 `pm2 start index.js -i 0 -e log/err.log -o log/out.log -- -p 8000`

