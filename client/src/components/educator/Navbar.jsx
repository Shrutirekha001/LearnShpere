import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import hamburger from '../../assets/hamburger.svg';

const Navbar = ({ onMenuClick }) => {
  const educatorData = dummyEducatorData
  const { user } = useUser()
  // Assume openSignIn is available in props or context if needed
  // If not, replace with your actual login function
  const openSignIn = () => {
    // Implement your login logic here
    // For example, redirect to login page or open modal
  }
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3'>
      <div className='flex items-center gap-2'>
        {/* Hamburger icon: only show if user is logged in */}
        {user && (
          <button className='md:hidden mr-2' onClick={onMenuClick}>
            <img src={hamburger} alt="Menu" className='w-8 h-8' />
          </button>
        )}
        <Link to='/'>
          <div className='flex items-center gap-2'>
            <img src={assets.logo} alt="LearnSphere Logo" className='w-15 lg:w-15 cursor-pointer' />
            <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text'>LearnSphere</span>
          </div>
        </Link>
      </div>
      <div className='flex items-center gap-3 text-gray-500 relative'>
        {/* Hide greeting on mobile, show on md+ */}
        <span className='hidden md:block'>
          Hi {user ? user.fullName : 'Developers'}
        </span>
        {/* Always show user icon/login button */}
        {user ? <UserButton /> : <img src={assets.profile_img} alt="" className='max-w-8' onClick={openSignIn} />}
      </div>
    </div>
  )
}

export default Navbar
