import React from 'react'
import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'

const LayOut = () => {
  return (
    <>
    <MainNav />
    


    <main>
        <Outlet />
    </main>
    
    </>
  )
}

export default LayOut