import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext)

  return (
    <Link to={'/course/' + course._id} onClick={() => scrollTo(0, 0)}
      className='group border border-purple-200 pb-6 overflow-hidden rounded-lg bg-white hover:shadow-[0_0_12px_rgba(168,85,247,0.2),0_0_12px_rgba(59,130,246,0.2)] transition-all duration-300'>
      <div className='relative overflow-hidden aspect-video'>
        <img
          className='w-full  object-cover group-hover:scale-105 transition-transform duration-300'
          src={course.courseThumbnail}
          alt=''
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
      </div>
      <div className="p-3 text-left">
        <h3 className='text-base font-semibold text-gray-800 group-hover:text-purple-600 transition-colors'>{course.courseTitle}</h3>
        <p className='text-gray-600 mt-1'>LearnShpere</p>
        <div className='flex items-center space-x-2 mt-2'>
          <p className='text-purple-600 font-medium'>{calculateRating(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (<img key={i} src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5' />
            ))}
          </div>
          <p className='text-gray-500'>{course.courseRatings.length}</p>
        </div>
        <div className='mt-3 flex items-center justify-between'>
          <p className='text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text'>
            {currency}{(course.coursePrice - course.coursePrice * course.discount / 100).toFixed(2)}
          </p>
          {course.discount > 0 && (
            <span className='px-2 py-1 text-sm font-medium text-purple-600 bg-purple-100 rounded-full'>
              {course.discount}% OFF
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
