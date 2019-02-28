const filter = filters => query => {
  let filteredQuery = query.where('num_drug_tests', '>', 0)

  if (!filters) return filteredQuery

  if (filters.countries && filters.countries.length) {
    filteredQuery = filteredQuery.whereIn('country', filters.countries)
  }
  return filteredQuery
}

module.exports = filter
