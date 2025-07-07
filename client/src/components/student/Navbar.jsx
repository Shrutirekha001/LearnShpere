import React, { useContext, useState } from 'react'
import { assets} from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import hamburger from '../../assets/hamburger.svg';

const Navbar = () => {

  const {navigate,isEducator, backendUrl , setIsEducator, getToken} = useContext(AppContext)

  const isCourseListPage = location.pathname.includes('/course-list');

  const {openSignIn} = useClerk();
  const { user } = useUser();

  const [menuOpen, setMenuOpen] = useState(false);

  const becomeEducator = async () => {
    try {
      if(isEducator) {
        navigate('/educator')
        return;
      }
      const token = await getToken();
      const{data} = await axios.get(backendUrl + '/api/educator/update-role',{headers: {Authorization: `Bearer ${token}`}})

      if(data.success) {
        setIsEducator(true);
       toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

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
      {/* Desktop Menu */}
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          { user && 
          <>
            <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
            |  <Link to='/my-enrollments' >My Enrollments</Link>
            |   <Link to='/quiz'>Take Quiz</Link>
          </>
              }
        </div>
        { user ? <UserButton/> :
           <button onClick={() => openSignIn()} className=' glow-button text-white text-xl font-bold py-3 px-10 rounded-full'>Sign In</button>}
      </div>
      {/* Hamburger Icon and User Icon for Mobile */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        {/* Hamburger: only show if user is logged in */}
        {user && (
          <button onClick={() => setMenuOpen(!menuOpen)} className='focus:outline-none'>
            <img src={hamburger} alt="Menu" className='w-8 h-8'/>
          </button>
        )}
        {/* User icon: always show */}
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
      {/* Mobile Dropdown Menu */}
      {menuOpen && user && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end md:hidden">
          <div className="bg-white w-4/5 max-w-xs h-full p-6 flex flex-col gap-8 shadow-2xl rounded-l-2xl animate-slide-in relative">
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-3xl font-bold text-gray-500 hover:text-purple-600"
              aria-label="Close menu"
            >
              &times;
            </button>
            {/* User greeting */}
            <div className="flex items-center gap-3 mt-8">
              <UserButton />
              <span className="font-semibold text-lg text-gray-700">
                {user.fullName}
              </span>
            </div>
            {/* Menu links */}
            <nav className="flex flex-col gap-6 mt-8">
              <button
                onClick={() => { becomeEducator(); setMenuOpen(false); }}
                className="text-left text-base font-medium text-gray-700 hover:text-purple-600 transition"
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>
              <Link
                to="/my-enrollments"
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-purple-600 transition"
              >
                My Enrollments
              </Link>
              <Link
                to="/quiz"
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-purple-600 transition"
              >
                Take Quiz
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
