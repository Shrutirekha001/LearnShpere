import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t border-gray-300'>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <img src={assets.logo} alt="LearnSphere Logo" className='w-12' />
          <span className='text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text'>LearnSphere</span>
        </div>

        <div className='hidden md:block h-7 w-px bg-gray-500/60'></div>
           <p className='py-4 text-center text-xs md:text-sm text-gray-700'>© 2025 LearnSphere. All rights reserved</p>
      </div>

      <div className='flex items-center gap-3 max-md:mt-4'>
        <a href="#"><img src={assets.facebook_icon} alt="" /></a>
        <a href="#"><img src={assets.twitter_icon} alt="" /></a>
        <a href="#"><img src={assets.instagram_icon} alt="" /></a>
      </div>

    </footer>
  )
}

export default Footer
