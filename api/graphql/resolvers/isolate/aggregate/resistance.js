const { StudyIsolate, knex } = require('../../../../models')
const log = require('../../../../logger')
const applyFilters = require('../filter')

const numerator = includeIntermediate => {
  return includeIntermediate ? '(num_resistant + num_intermediate)' : 'num_resistant'
}

async function aggregateIsolatesResistance(filters, { includeIntermediate }) {
  try {
    const results = await applyFilters(filters)(
      StudyIsolate
      .query()
      .select(
        'species',
        knex.raw(`COUNT(id) as count`),
        knex.raw(`AVG(${numerator(includeIntermediate)}::float/num_drug_tests::float) as resistance_mean`),
        knex.raw(`MIN(${numerator(includeIntermediate)}::float/num_drug_tests::float) as resistance_min`),
        knex.raw(`MAX(${numerator(includeIntermediate)}::float/num_drug_tests::float) as resistance_max`),
        knex.raw(`STDDEV_SAMP(${numerator(includeIntermediate)}::float/num_drug_tests::float) as resistance_std`)
      )
      .groupBy('species')
      .orderBy([{ column: 'resistance_mean', order: 'desc' }])
    )

    return {
      buckets: results.map(x => ({
        key: x.species,
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

module.exports = aggregateIsolatesResistance
