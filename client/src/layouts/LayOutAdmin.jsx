import React from 'react'
import { Outlet } from 'react-router-dom'
import SidebarAdmin from '../components/admin/SidebarAdmin'
import HeaderAdmin from '../components/admin/HeaderAdmin'


const LayOutAdmin = () => {
  return (
    <div className='flex h-screen gap-2'>
      <SidebarAdmin />
      <div className='flex-1 flex flex-col '>
        <HeaderAdmin />
        <main className='flex-1 p-6 bg-gray-200 overflow-y-auto'>
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default LayOutAdmin