import React, { useState } from 'react'
import PropTypes from 'prop-types'
import FilterSuggest from 'filter-suggest'
import species from './species.json'
import countries from './countries.json'
import MaterialIcon from '@material/react-material-icon'

const filterTypes = [
  {
    id: 'species',
    icon: <MaterialIcon icon='bug_report' />,
    staticValues: species,
  },
  {
    id: 'country',
    icon: <MaterialIcon icon='public' />,
    staticValues: countries,
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