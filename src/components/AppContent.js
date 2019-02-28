import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Charts from './chart'
import FilterSuggest from './filter-suggest'

const parseCountries = countryItems => {
  return countryItems.map(x => x.label)
}

const AppContent = ({ filters, setFilters }) => {
  return (
    <div className='content-container'>
      <div style={{ padding: '16px' }}>
        <FilterSuggest
          onSelect={({ filterType, value, query: id }) => {
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
              default:
                return
            }
          }}
        />
      </div>
      <Charts
        variables={{
          countries: parseCountries(filters.countries),
        }}
      />
    </div>
  )
}
AppContent.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
}



export default AppContent