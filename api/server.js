const express = require('express')
const cors = require('cors')
const graphqlHTTP = require('express-graphql')
const elasticsearch = require('elasticsearch')
const { rootValue, schema } = require('./graphql')
const config = require('./config')

const esClient = new elasticsearch.Client(config.elastic)

const app = express()
app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: rootValue(esClient),
  graphiql: true,
}));
app.listen(4000)

console.log('Running a GraphQL API server at localhost:4000/graphql')