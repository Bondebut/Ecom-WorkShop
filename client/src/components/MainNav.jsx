
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useEcomStore from '../store/ecom-store'

const MainNav = () => {
    const navigate = useNavigate()
    const { user, token } = useEcomStore()

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('ecom-store')
        // Reset store state
        useEcomStore.setState({ user: null, token: null })
        // Redirect to home
        navigate('/')
    }

    return (
        <nav className='bg-gray-700 '>
            <div className='mx-auto px-4'>
                <div className='flex justify-between h-16'>
                    <div className='flex items-center gap-4'>
                        <Link to={'/'} className='text-2xl font-bold text-white' >LOGO</Link>
                        <Link to={'/'} className='text-white hover:text-gray-300' >Home</Link>
                        <Link to={'shop'} className='text-white hover:text-gray-300' >Shop</Link>
                        <Link to={'cart'} className='text-white hover:text-gray-300' >Cart</Link>
                    </div>

                    <div className='flex items-center gap-4'>
                        {user && token ? (
                            <>
                                <span className='text-white' onClick={() => user.role === 'admin' ? navigate('/admin') : navigate('/user')}>
                                    Welcome, <span className='font-semibold'>{user.name || 'User'}</span>
                                    {user.role && <span className='text-gray-300 ml-1'>({user.role})</span>}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className='text-white hover:text-gray-300 bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors'
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to={'register'} className='text-white hover:text-gray-300' >Register</Link>
                                <Link to={'login'} className='text-white hover:text-gray-300' >Login</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default MainNav