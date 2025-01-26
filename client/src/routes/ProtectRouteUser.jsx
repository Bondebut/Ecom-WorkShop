import React, { useEffect, useState } from 'react'
import useEcomStore from '../store/ecom-store'
import { currentUser } from '../api/auth'
import LoadingToRedirect from './LoadingToRedirect'


const ProtectRouteUser = ({ element }) => {
  const [status, setStatus] = useState(false)
  const user = useEcomStore((state) => state.user)
  const token = useEcomStore((state) => state.token)

  useEffect(() => {
    if (user && token) {
      currentUser(token)
        .then((res) => setStatus(true))
        .catch((err) => setStatus(false))
    }

  }, [])


  return  status ? element:<LoadingToRedirect />
}

export default ProtectRouteUser