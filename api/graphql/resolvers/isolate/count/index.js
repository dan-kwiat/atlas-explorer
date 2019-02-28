const { StudyIsolate } = require('../../../../models')

async function countIsolates(filters) {
  try {
    let query = StudyIsolate
      .query()
      .count()
      .where('num_drug_tests', '>', 0)

    if (filters.countries) {
      query = query.whereIn('country', filters.countries)
    }

    const results = await query
    return results[0].count
  } catch(e) {
    throw(e)
  }
}

module.exports = countIsolates
