import React, { useContext } from 'react'
import { assets} from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

  const {navigate,isEducator } = useContext(AppContext)

  const isCourseListPage = location.pathname.includes('/course-list');

  const {openSignIn} = useClerk();
  const { user } = useUser();

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-300 py-4 ${isCourseListPage ? 'bg-gradient-to-r from-indigo-200 via-purple-100 to-pink-100' : 'bg-gradient-to-r from-purple-200 via-purple-100 to-blue-100'}`}>
      <div className='flex items-center gap-2'>
        <img onClick={() => navigate('/')}
          src={assets.logo} 
          alt="LearnSphere Logo" 
          className='w-15 lg:w-15 cursor-pointer' 
        />
        <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text'>LearnSphere</span>
      </div>
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          { user && 
          <>
            <button onClick={() =>{ navigate('/educator')}}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
            |  <Link to='/my-enrollments' >My Enrollments</Link>
            |   <Link to='/quiz'>Take Quiz</Link>
          </>
              }
        </div>
        { user ? <UserButton/> :
           <button onClick={() => openSignIn()} className=' glow-button text-white text-xl font-bold py-3 px-10 rounded-full'>Create Account</button>}
      </div>
      {/* Mobile Menu */}
     
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='flex item-center gap-1 sm:gap-2 max-sm:text-xs'>
          { user && 
          <>
            <button onClick={() =>{ navigate('/educator')}}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
            |  <Link to='/my-enrollments' >My Enrollments</Link>
          </>
              }
        </div>
        {
          user ?
            <UserButton />:<button onClick={() => openSignIn()}><img src={assets.user_icon} alt="" /></button>

        }
            
      </div>
    </div>
  )
}

export default Navbar
