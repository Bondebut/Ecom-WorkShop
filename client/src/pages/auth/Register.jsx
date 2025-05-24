import React, { useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmpassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleOnchange = (e) => {
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    if(form.password !== form.confirmpassword){
      toast.error('Confirm Password is not match')
      return
    }
    setLoading(true)
    try{
      const res = await axios.post('http://localhost:5000/api/register',form)
      toast.success('Welcome')
      // redirect or clear form if needed
    }catch(err){
      const errMsg = err.response?.data?.message
      toast.error(errMsg)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white/80 shadow-xl rounded-2xl p-8 w-full max-w-md backdrop-blur-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6 tracking-tight">Create your account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={handleOnchange}
              value={form.email}
              placeholder="you@email.com"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={handleOnchange}
              value={form.password}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-blue-500 transition"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmpassword"
              autoComplete="new-password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              onChange={handleOnchange}
              value={form.confirmpassword}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-blue-500 transition"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <button
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </div>
      </div>
      {/* Animation */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 1s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  )
}

export default Register