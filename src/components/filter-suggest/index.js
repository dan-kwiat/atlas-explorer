import React, { useState } from 'react'
import PropTypes from 'prop-types'
import FilterSuggest from 'filter-suggest'
import species from './species.json'
import countries from './countries.json'
import organismGroups from './organismGroups.json'
import phenotypes from './phenotypes.json'
import specialities from './specialities.json'
import sources from './sources.json'
import MaterialIcon from '@material/react-material-icon'

const filterTypes = [
  {
    id: 'Species',
    icon: <MaterialIcon icon='bug_report' />,
    staticValues: species,
  },
  {
    id: 'Country',
    icon: <MaterialIcon icon='public' />,
    staticValues: countries,
  },
  {
    id: 'Organism Group',
    icon: <MaterialIcon icon='category' />,
    staticValues: organismGroups,
  },
  {
    id: 'Phenotype',
    icon: <MaterialIcon icon='' />,
    staticValues: phenotypes,
  },
  {
    id: 'Speciality',
    icon: <MaterialIcon icon='local_hospital' />,
    staticValues: specialities,
  },
  {
    id: 'Source',
    icon: <MaterialIcon icon='' />,
    staticValues: sources,
  },
]
 
const Filter = ({ onSelect }) => {
  const [inputValue, setInputValue] = useState('')
  return (
    <FilterSuggest
      filterTypes={filterTypes}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      onSelect={onSelect}
      showPrefix={false}
    />
  )
}
Filter.propTypes = {
  onSelect: PropTypes.func.isRequired,
}

export default Filter