const { StudyIsolate } = require('../../../../models')
const applyFilters = require('../filter')

async function countIsolates(filters) {
  try {
    const results = await applyFilters(filters)(
      StudyIsolate
        .query()
        .count()
    )
    return results[0].count
  } catch(e) {
    throw(e)
  }
}

module.exports = countIsolates
