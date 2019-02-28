import React from 'react'
import PropTypes from 'prop-types'
import BugResistance from './BugResistance'

const Charts = ({ filters }) => {
  return (
    <div>
      <BugResistance filters={filters} />
    </div>
  )
}
Charts.propTypes = {
  filters: PropTypes.object.isRequired,
}

export default Charts