const bunyan = require('bunyan')

const log = bunyan.createLogger({
  name: 'main',
  streams: [
    {
      level: 'debug',
      stream: process.stdout
    },
  ],
})

module.exports = log
