import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between w-full px-4 py-4 border-t border-gray-300 bg-white text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <img src={assets.logo} alt="LearnSphere Logo" className="w-10 md:w-12" />
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">LearnSphere</span>
        </div>
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
        <p className="text-xs md:text-sm text-gray-700 mt-2 md:mt-0">© 2025 LearnSphere. All rights reserved</p>
      </div>
      <div className="flex items-center gap-3 mt-3 md:mt-0">
        <a href="#"><img src={assets.facebook_icon} alt="Facebook" className="w-6 h-6" /></a>
        <a href="#"><img src={assets.twitter_icon} alt="Twitter" className="w-6 h-6" /></a>
        <a href="#"><img src={assets.instagram_icon} alt="Instagram" className="w-6 h-6" /></a>
      </div>
    </footer>
  )
}

export default Footer
