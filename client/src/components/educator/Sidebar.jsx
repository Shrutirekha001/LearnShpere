import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {

  const {isEducator} = useContext(AppContext)

  const menuItems =[

    {name: 'Dashboard', path: '/educator', icon: assets.home_icon},
    {name:'Add Course', path: '/educator/add-course', icon: assets.add_icon},
    {name:'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon},
    {name:'Students Enrolled', path: '/educator/students-enrolled', icon: assets.person_tick_icon},
    {name:'Quiz Generator',path:'/educator/quiz-generator', icon: assets.quiz_icon},
    {name:'My Quizzes', path:'/educator/my-quizzes', icon: assets.quiz_icon2}
  ];

  // Desktop: always show. Mobile: only show if open
  return isEducator && (
    <>
      {/* Desktop sidebar */}
      <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex-col md:flex hidden'>
        {menuItems.map((item) =>(
          <NavLink
            to = {item.path}
            key = {item.name}
            end = {item.path === '/educator'}
            className={({isActive})=> `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 border-r-[6px] border-purple-600/90': 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}>
            <img src={item.icon} alt=""  className='w-6 h-6'/>
            <p className='md:block hidden text-center'>{item.name}</p>
          </NavLink>
        ))}
      </div>
      {/* Mobile sidebar overlay */}
      {open && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-40 flex md:hidden'>
          <div className='bg-white w-64 h-full p-4 flex flex-col gap-2 shadow-lg relative'>
            <button onClick={onClose} className='self-end text-2xl font-bold mb-2'>&times;</button>
            {menuItems.map((item) =>(
              <NavLink
                to = {item.path}
                key = {item.name}
                end = {item.path === '/educator'}
                onClick={onClose}
                className={({isActive})=> `flex items-center gap-3 py-3 px-4 rounded ${isActive ? 'bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 font-bold': 'hover:bg-gray-100/90'}`}>
                <img src={item.icon} alt=""  className='w-6 h-6'/>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
