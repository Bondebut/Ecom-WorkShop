import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'
import useEcomStore from '../../store/ecom-store';
import { useNavigate } from 'react-router-dom';



const Login = () => {
  //Code
  const navigate = useNavigate()
  const actionLogin = useEcomStore((state)=>state.actionLogin)
  const user = useEcomStore((state)=>state.user)

  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  
  const handleOnchange = (e) => {
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try{
      const res = await actionLogin(form)
      const role = res.data.payload.role
      redirectRole(role)
      toast.success('welcome')
    }catch(err){
      const errMsg = err.response?.data?.message
      toast.error(errMsg)
    }
  }

  const redirectRole = (role) =>{
    if(role === 'admin'){
      navigate('/admin')
    }else{
      navigate('/user')
    }
  }

  return (
    <div>
      Login
      <form onSubmit={handleSubmit} className=''>
        Email
        <input type="email" name='email' className='border' onChange={handleOnchange} />

        Password
        <input type="text" name='password' className='border' onChange={handleOnchange} />

        <button className='bg-blue-500 rounded-md p-1'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login