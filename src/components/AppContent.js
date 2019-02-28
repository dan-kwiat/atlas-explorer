import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Charts from './chart'
import { FilterInput } from './filter'

const parseCountries = countryItems => {
  return countryItems.map(x => x.label)
}

const AppContent = ({ filters, setFilters }) => {
  return (
    <div className='content-container'>
      <div style={{ padding: '16px' }}>
        <FilterInput
          onSelect={({ id, name, filterType }) => {
            switch (filterType) {
              case 'country':
                if (filters.country.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  country: [
                    ...filters.country,
                    { id, label: name },
                  ]
                })
              case 'species':
                if (filters.species.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  species: [
                    ...filters.species,
                    { id, label: name },
                  ]
                })
              case 'orgGroup':
                if (filters.orgGroup.map(x => x.id).indexOf(id) > -1) return
                return setFilters({
                  ...filters,
                  orgGroup: [
                    ...filters.orgGroup,
                    { id, label: name },
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
          countries: parseCountries(filters.country),
          species: parseCountries(filters.species),
          orgGroups: parseCountries(filters.orgGroup),
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