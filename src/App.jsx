import React from 'react'
import './App.css'
import Topnav from './component/Topnav/Topnav'
import Sidenav from './component/Sidenav/Sidenav'
import Maincont from './component/Maincont/Maincont'
import { SearchProvider } from './SearchContext'

const App = () => {
  return (
    <SearchProvider>
      <div>
        <Topnav />
        <Sidenav />
        <Maincont />
      </div>
    </SearchProvider>
  )
}

export default App

