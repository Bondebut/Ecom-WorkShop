import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const LoadingToRedirect = () => {
    const [count,setCount] = useState(3)
    const [redirect,setRedirect] = useState(false)


    useEffect(()=>{
        const interval = setInterval(()=>{
            setCount((count)=>{
                if(count === 1){
                    clearInterval(interval)
                    setRedirect(true)
                }
                return count - 1
            })
        },1000)

        return ()=> clearInterval(interval)
    },[])

    if(redirect){
        return <Navigate to={'/'} />
    }

    return (
        <div>No Permission,Redirect in {count}</div>
    )
}

export default LoadingToRedirect