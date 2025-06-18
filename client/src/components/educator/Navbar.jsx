import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const educatorData = dummyEducatorData
   const { user } = useUser()
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3'>
      <Link to='/'>
      <div className='flex items-center gap-2'>
              <img onClick={() => navigate('/')}
                src={assets.logo} 
                alt="LearnSphere Logo" 
                className='w-15 lg:w-15 cursor-pointer' 
              />
              <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text'>LearnSphere</span>
            </div>
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi {user ? user.fullName : 'Developers'}</p>
        {user ? <UserButton /> : <img src={assets.profile_img} alt="" className='max-w-8' />}
      </div>
    </div>
  )
}

export default Navbar
