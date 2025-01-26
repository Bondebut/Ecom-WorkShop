import React from 'react'
import { NavLink } from 'react-router-dom'
import { CircleGauge, LayoutDashboard } from 'lucide-react';

const SidebarAdmin = () => {
    return (
        <div className='bg-gray-700 w-64 text-gray-100 flex flex-col h-screen '>
            <div className='h-24 bg-gray-900 flex items-center justify-center text-2xl font-bold'>
                Admin panel
            </div>

            <nav className='flex-1 px-2 py-4 space-y-2'>
                <NavLink to={'/admin'} end className={({isActive})=>
                isActive 
                ? 'bg-gray-800 px-4 py-2 text-white flex items-center gap-2 rounded' 
                : 'text-gray-300 px-4 py-2 hover:bg-gray-600 flex gap-2 rounded hover:text-white'
                }>
                <LayoutDashboard />
                    Dashboard
                </NavLink>

                <NavLink to={'manage'} className={({isActive})=>
                isActive 
                ? 'bg-gray-800 px-4 py-2 text-white flex items-center gap-2 rounded' 
                : 'text-gray-300 px-4 py-2 hover:bg-gray-600 flex gap-2 rounded hover:text-white'
                }>
                <CircleGauge />
                    Manage
                </NavLink>


                <NavLink to={'category'} className={({isActive})=>
                isActive 
                ? 'bg-gray-800 px-4 py-2 text-white flex items-center gap-2 rounded' 
                : 'text-gray-300 px-4 py-2 hover:bg-gray-600 flex gap-2 rounded hover:text-white'
                }>
                <LayoutDashboard />
                    Category
                </NavLink>

                <NavLink to={'product'} className={({isActive})=>
                isActive 
                ? 'bg-gray-800 px-4 py-2 text-white flex items-center gap-2 rounded' 
                : 'text-gray-300 px-4 py-2 hover:bg-gray-600 flex gap-2 rounded hover:text-white'
                }>
                <LayoutDashboard />
                    Product
                </NavLink>


            </nav>

            <div>
            <NavLink className={({isActive})=>
                isActive 
                ? 'bg-gray-800 px-4 py-2 text-white flex items-center gap-2 rounded' 
                : 'text-gray-300 px-4 py-2 hover:bg-gray-600 flex gap-2 rounded hover:text-white'
                }>
                <LayoutDashboard />
                    Logout
                </NavLink>
            </div>
        </div>
    )
}

export default SidebarAdmin