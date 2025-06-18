import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CourseSection = () => {

  const {allCourses} = useContext(AppContext)
  return (
    <div className='py-16 md:px-40 px-8'>
      


      <h2 className='text-3xl font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3'>Discover our top-rated courses across various categories. From coding and design to <br /> business and wellness, our courses are crafted to deliver results.</p>

       <div className='grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] px-4 md:px-0 md:my-16 my-10 gap-4'>
     


        {allCourses.slice(0, 4).map((course, index) => <CourseCard key={index} course={course}/>)}
       </div>

      <Link to={'/course-list'} onClick={()=>scrollTo(0,0)}
      className='text-white bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)] px-10 py-3 rounded-lg transition-all duration-300'>Show all courses</Link>
    </div>
  )
}

export default CourseSection
