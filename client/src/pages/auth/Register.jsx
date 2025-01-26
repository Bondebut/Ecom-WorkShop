import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'


const Register = () => {
  //Code
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmpassword: ""
  })
  
  const handleOnchange = (e) => {
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(form.password !== form.confirmpassword){
      return alert('Confirm Password is not Math')
    }
    console.log(form)

    try{
      const res = await axios.post('http://localhost:5000/api/register',form)
      console.log(res.data)
      toast.success('Welcome')
    }catch(err){
      const errMsg = err.response?.data?.message
      toast.error(errMsg)
      console.log(err)
    }
  }

  return (
    <div>
      Register
      <form onSubmit={handleSubmit} className=''>
        Email
        <input type="email" name='email' className='border' onChange={handleOnchange} />

        Password
        <input type="text" name='password' className='border' onChange={handleOnchange} />

        ConfirmPassword
        <input type="text" name='confirmpassword' className='border' onChange={handleOnchange} />

        <button className='bg-blue-500 rounded-md p-1'>
          Register
        </button>
      </form>
    </div>
  )
}

export default Register