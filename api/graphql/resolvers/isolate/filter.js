const filter = filters => query => {
  let filteredQuery = query.where('num_drug_tests', '>', 0)

  if (!filters) return filteredQuery

  if (filters.countries && filters.countries.length) {
    filteredQuery = filteredQuery.whereIn('country', filters.countries)
  }
  if (filters.species && filters.species.length) {
    filteredQuery = filteredQuery.whereIn('species', filters.species)
  }
  return filteredQuery
}

module.exports = filter
