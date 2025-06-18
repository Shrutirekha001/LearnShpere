import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gradient-to-br from-purple-200 via-blue-100 to-purple-100 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-purple-300/50'>
        {/* Company Info */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <div className='flex items-center gap-2'>
            <img src={assets.logo} alt="LearnSphere Logo" className='w-12' />
            <span className='text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text'>LearnSphere</span>
          </div>
          <p className='mt-6 text-center md:text-left text-sm text-gray-700'>Empowering learners worldwide with quality education and expert-led courses — inspiring growth, sparking curiosity, and building a community of lifelong learners. Together, we make learning meaningful, accessible, and truly transformative.</p>
          
        </div>

        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-gray-700 mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-gray-700 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div >
        
        <div className='hidden md:flex flex-col items-start w-full'>

          <h2 className='font-semibold text-gray-700 mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm text-gray-700'>The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className='flex items-center gap-2 pt-4'>
            <input type="email" placeholder='Enter your email' className='border border-gray-500/30 bg-white text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'/>
            <button className='bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)] transition-all duration-300 w-24 h-9 text-white rounded'>Subscribe</button>
          </div>

        </div>

        

        

        

     
      
      </div>
      <p className='py-4 text-center text-xs md:text-sm text-gray-700'>© 2025 LearnSphere. All rights reserved</p>
    </footer>
  )
}

export default Footer
