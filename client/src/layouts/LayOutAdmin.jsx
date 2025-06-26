import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SidebarAdmin from '../components/admin/SidebarAdmin'
import HeaderAdmin from '../components/admin/HeaderAdmin'


const LayOutAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className={`flex h-screen ${isSidebarOpen ? 'gap-2' : ''}`}>
      <SidebarAdmin isOpen={isSidebarOpen} />
      <div className='flex-1 flex flex-col '>
        <HeaderAdmin onToggleSidebar={toggleSidebar} />
        <main className='flex-1 p-6 bg-gray-200 overflow-y-auto'>
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default LayOutAdmin