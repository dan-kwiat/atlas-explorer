import React from 'react'
import { ChipSet, Chip } from '@material/react-chips'
import MaterialIcon from '@material/react-material-icon'

const FilterChips = ({ filters, setFilters }) => (
  <div>
    {Object.keys(filters).map(filterName => (
      <ChipSet
        key={`chipset-${filterName}`}
        input
        updateChips={filterChips => {
          setFilters({
            ...filters,
            [filterName]: filterChips,
          })
        }}
      >
        {filters[filterName].map(({ id, label }) =>
          <Chip
            id={id}
            key={id}
            label={label}
            className={`${filterName}-filter`}
            removeIcon={<MaterialIcon icon='cancel' />}
            title={label}
          />
        )}
      </ChipSet>
    ))}
  </div>
)

export default FilterChips
