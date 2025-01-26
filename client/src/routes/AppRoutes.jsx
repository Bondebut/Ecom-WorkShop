//rafce
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import Shop from '../pages/Shop'
import Cart from '../pages/Cart'
import History from '../pages/History'
import CheckOut from '../pages/CheckOut'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Category from '../pages/admin/Category'
import Dashboad from '../pages/admin/Dashboard'
import Product from '../pages/admin/Product'
import LayOut from '../layouts/LayOut'
import LayOutAdmin from '../layouts/LayOutAdmin'
import Manage from '../pages/admin/Manage'
import LayOutUser from '../layouts/LayOutUser'
import HomeUser from '../pages/user/HomeUser'
import ProtectRouteUser from '../routes/ProtectRouteUser'
import ProtectRouteAdmin from './ProtectRouteAdmin'


const router = createBrowserRouter([
  {
    path: '/',
    element: <LayOut />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'cart', element: <Cart /> },
      { path: 'history', element: <History /> },
      { path: 'checkout', element: <CheckOut /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ]
  },
  {
    path: '/admin',
    element: <ProtectRouteAdmin element={<LayOutAdmin />} /> ,
    children: [
      { index: true, element: <Dashboad /> },
      { path: 'category', element: <Category /> },
      { path: 'product', element: <Product /> },
      { path: 'manage', element: <Manage /> },
    ]
  },
  {
    path: '/user',
    element: <ProtectRouteUser element={<LayOutUser />} />,
    children: [
      { index: true, element: <HomeUser /> },
    ]
  }

])

const AppRoutes = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default AppRoutes