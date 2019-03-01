import React from 'react'
import PropTypes from 'prop-types'
import TopAppBar from '@material/react-top-app-bar'
import MaterialIcon from '@material/react-material-icon'

const renderDrawerIcon = onClick => (
  <MaterialIcon
    icon='filter_list'
    onClick={onClick}
  />
)

const AppBar = ({ setIsDrawerOpen }) => (
  <>
    <TopAppBar
      className='mobile-appbar'
      title='ATLAS Explorer'
      navigationIcon={renderDrawerIcon(() => setIsDrawerOpen(true))}
    />
    <TopAppBar
      className='desktop-appbar'
      title='ATLAS Explorer'
      fixed
    />
  </>
)
AppBar.propTypes = {
  setIsDrawerOpen: PropTypes.func.isRequired,
}

export default AppBar