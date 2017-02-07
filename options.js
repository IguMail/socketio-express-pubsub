var argv = require('minimist')(process.argv.slice(2))

var options = {}

options.port = argv['p'] || process.env.PORT || 8000
options.debug = argv['debug'] || argv['d']
options.host = argv['host'] || 'localhost'
options.origin = argv['origin'] || argv['cors']
options.output = argv['output'] || argv['O']
options.verbose = argv['verbose'] || argv['v']
options.max_conns = argv['max-connections'] || argv['c']
options.help = argv['help'] || argv['h'] || argv['?']
options.stop = argv['s']
options.cert = argv['cert']
options.key = argv['key']

module.exports = options