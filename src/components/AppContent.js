import React from 'react'
import PropTypes from 'prop-types'
import Charts from './chart'

const AppContent = ({ filters, setFilters }) => {
  return (
    <div className='content-container'>
      <Charts
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}
AppContent.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
}

export default AppContent
