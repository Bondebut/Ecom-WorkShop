import React from 'react'
import { Outlet } from 'react-router-dom'

const LayOutUser = () => {
  return (
    <>
        <h1> nav</h1>
        <Outlet />
    </>
  )
}

export default LayOutUser