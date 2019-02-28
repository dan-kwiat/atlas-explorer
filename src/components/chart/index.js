import React from 'react'
import PropTypes from 'prop-types'
import BugResistance from './BugResistance'

const Charts = ({ filters, setFilters }) => {
  return (
    <div>
      <BugResistance
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}
Charts.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
}

export default Charts