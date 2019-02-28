const elasticsearch = require('elasticsearch')
const config = require('../config')

const esClient = new elasticsearch.Client(config.elastic)

module.exports = {
  esClient,
}
