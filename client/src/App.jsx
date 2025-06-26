//rafce
import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import './App.css' // Import your global styles here
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';

const App = () => {
  //JS

  return (
    <>
      <ToastContainer />
      <AppRoutes />
      
    </>
  )
}
// Initialize AOS (Animate On Scroll) library
AOS.init({
  duration: 1000, // Duration of animations in milliseconds
  once: true, // Whether animation should happen only once - while scrolling down
  mirror: false, // Whether elements should animate out while scrolling past them
});

export default App