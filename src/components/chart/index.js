import React from 'react'
import PropTypes from 'prop-types'
import BugResistance from './BugResistance'

const Charts = ({ variables }) => {
  return (
    <div>
      <BugResistance variables={variables} />
    </div>
  )
}
Charts.propTypes = {
  variables: PropTypes.object.isRequired,
}

export default Charts