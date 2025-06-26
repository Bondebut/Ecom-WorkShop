import React, { useState , useEffect } from 'react'
import { toast } from 'react-toastify';
import useEcomStore from '../../store/ecom-store';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate()
  const actionLogin = useEcomStore((state)=>state.actionLogin)
  const { user , token } = useEcomStore() 

  const [form, setForm] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  
  // Check if user is already logged in
  useEffect(() => {
    if(user && token){
      // Redirect based on user role
      if(user.role === 'admin'){
        navigate('/admin')
      }else{
        navigate('/user')
      }
    }
  }, [user, token, navigate]);

  const handleOnchange = (e) => {
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const res = await actionLogin(form)
      const role = res.data.payload.role
      redirectRole(role)
      toast.success('Welcome!')
    }catch(err){
      const errMsg = err.response?.data?.message
      toast.error(errMsg)
    }
    setLoading(false)
  }

  const redirectRole = (role) =>{
    if(role === 'admin'){
      navigate('/admin')
    }else{
      navigate('/user')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white/80 shadow-xl rounded-2xl p-8 w-full max-w-md backdrop-blur-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6 tracking-tight">Sign in to Ecom</h2>
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
              autoComplete="current-password"
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
          <button
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
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

export default Login