import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CircleGauge, LayoutDashboard } from 'lucide-react';

const SidebarAdmin = ({ isOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // ลบ token หรือข้อมูล session ออกจาก localStorage
        // localStorage.removeItem('token');
        localStorage.removeItem('ecom-store');
        // redirect ไปหน้า login
        navigate('/login');
    };

    return (
        <div className={`bg-gray-700 text-gray-100 flex flex-col h-screen transition-all duration-300 ${
            isOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}>
            <div className='h-24 bg-gray-900 flex items-center justify-center text-2xl font-bold min-w-64'>
                Admin panel
            </div>

            <nav className='flex-1 px-2 py-4 space-y-2 min-w-64'>
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

            <div className='min-w-64'>
                <button
                    onClick={handleLogout}
                    className='text-gray-300 px-4 py-2 hover:bg-gray-600 flex gap-2 rounded hover:text-white w-full text-left'
                >
                    <LayoutDashboard />
                    Logout
                </button>
            </div>
        </div>
    )
}

export default SidebarAdmin