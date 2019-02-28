const filter = filters => query => {
  let filteredQuery = query.where('num_drug_tests', '>', 0)

  if (!filters) return filteredQuery

  if (filters.countries && filters.countries.length) {
    filteredQuery = filteredQuery.whereIn('country', filters.countries)
  }
  if (filters.species && filters.species.length) {
    filteredQuery = filteredQuery.whereIn('species', filters.species)
  }
  if (filters.organismGroups && filters.organismGroups.length) {
    filteredQuery = filteredQuery.whereIn('organism_group', filters.organismGroups)
  }
  if (filters.phenotypes && filters.phenotypes.length) {
    filteredQuery = filteredQuery.whereIn('phenotype', filters.phenotypes)
  }
  if (filters.specialities && filters.specialities.length) {
    filteredQuery = filteredQuery.whereIn('speciality', filters.specialities)
  }
  if (filters.sources && filters.sources.length) {
    filteredQuery = filteredQuery.whereIn('source', filters.sources)
  }
  return filteredQuery
}

module.exports = filter
