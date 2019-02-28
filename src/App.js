import React, { useState } from 'react'
import { AppBar, AppContent, Drawer } from './components'
import { TopAppBarFixedAdjust } from '@material/react-top-app-bar'
import './App.scss'

const defaultFilters = {
  countries: [],
  species: [],
  phenotypes: [],
}

const AppLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  return (
    <div className='desktop-drawer-container'>
      <Drawer
        isOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        filters={filters}
        setFilters={setFilters}
      />
      <div className='desktop-drawer-app-content'>
        <AppBar
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <TopAppBarFixedAdjust>
          <AppContent
            filters={filters}
            setFilters={setFilters}
          />
        </TopAppBarFixedAdjust>
      </div>
    </div>
  )
}

export default AppLayout
