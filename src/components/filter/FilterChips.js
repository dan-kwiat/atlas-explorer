import React from 'react'
import { ChipSet, Chip } from '@material/react-chips'
import MaterialIcon from '@material/react-material-icon'

const FilterChips = ({ filters, setFilters }) => (
  <div>
    {Object.keys(filters).map(filterType => (
      <ChipSet
        key={`chipset-${filterType}`}
        input
        updateChips={filterChips => {
          setFilters({
            ...filters,
            [filterType]: filterChips,
          })
        }}
      >
        {filters[filterType].map(({ id, label }) =>
          <Chip
            id={id}
            key={id}
            label={label}
            className={`${filterType}-filter`}
            removeIcon={<MaterialIcon icon='cancel' />}
            title={label}
          />
        )}
      </ChipSet>
    ))}
  </div>
)

export default FilterChips