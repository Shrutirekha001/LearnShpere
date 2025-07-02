import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const QuizCard = ({ quiz }) => {
  const formatTime = (minutes) => {
    if (minutes === 0) return 'No time limit'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <Link 
      to={`/quiz/${quiz._id}`} 
      onClick={() => scrollTo(0, 0)}
      className='group border border-purple-200 pb-6 overflow-hidden rounded-lg bg-white hover:shadow-[0_0_12px_rgba(168,85,247,0.2),0_0_12px_rgba(59,130,246,0.2)] transition-all duration-300'
    >
      <div className='relative overflow-hidden aspect-video'>
        <div className='w-full h-full bg-gradient-to-br from-purple-400 via-blue-400 to-pink-400 flex items-center justify-center'>
          <img
            src={assets.lesson_icon}
            alt="Quiz"
            className='w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform duration-300'
          />
        </div>
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        <div className='absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium'>
          Quiz
        </div>
      </div>
      
      <div className="p-3 text-left">
        <h3 className='text-base font-semibold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2'>
          {quiz.title}
        </h3>
        <p className='text-gray-600 mt-1 text-sm line-clamp-2'>
          {quiz.description}
        </p>
        
        <div className='flex items-center justify-between mt-3'>
          <div className='flex items-center gap-4 text-sm text-gray-500'>
            <div className='flex items-center gap-1'>
              <img src={assets.lesson_icon} alt="questions" className='w-4 h-4' />
              <span>{quiz.totalQuestions} questions</span>
            </div>
            <div className='flex items-center gap-1'>
              <img src={assets.time_clock_icon} alt="time" className='w-4 h-4' />
              <span>{formatTime(quiz.timeLimit)}</span>
            </div>
          </div>
        </div>

        <div className='mt-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            <span className='text-sm text-green-600 font-medium'>Available</span>
          </div>
          <button className='bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300'>
            Start Quiz
          </button>
        </div>
      </div>
    </Link>
  )
}

export default QuizCard 