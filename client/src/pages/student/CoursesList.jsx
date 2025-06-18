import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

const CoursesList = () => {

   const {navigate,allCourses} = useContext(AppContext)
   const {input} = useParams()
   const [filteredCourses, setFilteredCourses] = useState([]);

   useEffect(()=>{
      if(allCourses && allCourses.length >0){
        const tempCourses = allCourses.slice()

        input ? 
        setFilteredCourses(tempCourses.filter(item => item.courseTitle.toLowerCase().includes(input.toLowerCase())))
        : setFilteredCourses(tempCourses)
      }
   },[allCourses, input])


  return (
   <>
   <div className='relative md:px-36 px-8 pt-20 text-left'>
    <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
      <div>
        <h1 className='text-4xl font-semibold bg-gradient-to-r from-blue-600 to-pink-500 text-transparent bg-clip-text'>
        Course List
      </h1>
      <p className='text-gray-500'>
       <span className='bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text hover:cursor-pointer'
       onClick={()=>navigate('/')}>Home</span>  / <span> Course List </span></p>
      </div>
      <SearchBar  data={input}/>
    </div>
    {
      input && <div className='inline-flex items-center gap-4 px-4 py-2 border border-gray-200 bg-transparent mt-8 -mb-8 text-gray-600'>
        <p>{input}</p>
        <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={()=>navigate('/course-list')} />
      </div>
    }


    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0'>
       {filteredCourses.map((course,index)=> <CourseCard key={index} course={course}/>)}
    </div>
   </div>
   <Footer />
   </>
  )
}

export default CoursesList
