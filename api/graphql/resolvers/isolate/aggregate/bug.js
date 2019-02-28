const { StudyIsolate, knex } = require('../../../../models')
const log = require('../../../../logger')

async function aggregateIsolatesByBug(filters) {
  try {
    let query = StudyIsolate
      .query()
      .select(
        'species',
        knex.raw(`COUNT(id) as count`),
        knex.raw(`AVG(num_resistant::float/num_drug_tests::float) as resistance_mean`),
        knex.raw(`MIN(num_resistant::float/num_drug_tests::float) as resistance_min`),
        knex.raw(`MAX(num_resistant::float/num_drug_tests::float) as resistance_max`),
        knex.raw(`STDDEV_SAMP(num_resistant::float/num_drug_tests::float) as resistance_std`)
      )
      .where('num_drug_tests', '>', 0)

    if (filters.countries) {
      query = query.whereIn('country', filters.countries)
    }

    const results = await query
      .groupBy('species')
      .orderBy([{ column: 'resistance_mean', order: 'desc' }])

    return {
      buckets: results.map(x => ({
        id: x.species,
        name: x.species,
        count: x.count,
        resistance: {
          mean: x.resistance_mean,
          min: x.resistance_min,
          max: x.resistance_max,
          std: x.resistance_std,
        }
      }))
    }
  } catch(e) {
    throw(e)
  }
}

module.exports = aggregateIsolatesByBug
