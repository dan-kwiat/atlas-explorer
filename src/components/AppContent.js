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
              case 'country':
                if (filters.countries.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  countries: [
                    ...filters.countries,
                    { id, label: value },
                  ]
                })
              case 'species':
                if (filters.species.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  species: [
                    ...filters.species,
                    { id, label: value },
                  ]
                })
              case 'phenotype':
                if (filters.phenotypes.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  phenotypes: [
                    ...filters.phenotypes,
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