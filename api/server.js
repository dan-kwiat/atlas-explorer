const express = require('express')
const cors = require('cors')
const graphqlHTTP = require('express-graphql')
// const { rootValue, schema } = require('./graphql')
const schema = require('./graphql')
const log = require('./logger')

const listenPort = process.env.PORT || 4000

log.info(`Starting process with NODE_ENV=${process.env.NODE_ENV}`)

const app = express()
app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema,
  // rootValue: rootValue(esClient),
  graphiql: true,
}))

app.listen(listenPort, () => {
  log.info(`Listening on port ${listenPort}`)
})

process.on('uncaughtException', err => {
  log.error(err)
  process.exit(1)
})
