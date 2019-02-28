import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Charts from './chart'
import FilterSuggest from './filter-suggest'

const parseFilters = items => {
  return items.map(x => x.label)
}

const AppContent = ({ filters, setFilters }) => {
  return (
    <div className='content-container'>
      <div style={{ padding: '16px' }}>
        <FilterSuggest
          onSelect={({ filterType, value, id }) => {
            switch (filterType) {
              case 'Country':
                if (filters.countries.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  countries: [
                    ...filters.countries,
                    { id, label: value },
                  ]
                })
              case 'Species':
                if (filters.species.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  species: [
                    ...filters.species,
                    { id, label: value },
                  ]
                })
              case 'Phenotype':
                if (filters.phenotypes.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  phenotypes: [
                    ...filters.phenotypes,
                    { id, label: value },
                  ]
                })
              case 'Organism Group':
                if (filters.organismGroups.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  organismGroups: [
                    ...filters.organismGroups,
                    { id, label: value },
                  ]
                })
              case 'Speciality':
                if (filters.specialities.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  specialities: [
                    ...filters.specialities,
                    { id, label: value },
                  ]
                })
              case 'Source':
                if (filters.sources.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  sources: [
                    ...filters.sources,
                    { id, label: value },
                  ]
                })
              default:
                return
            }
          }}
        />
      </div>
      <Charts
        variables={Object.keys(filters).reduce((agg, x) => ({
          ...agg,
          [x]: parseFilters(filters[x])
        }), {})}
      />
    </div>
  )
}
AppContent.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
}



export default AppContent