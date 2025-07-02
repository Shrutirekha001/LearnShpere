import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <h1 className='text-xl md:text-4xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text'>Learn anything, anytime, anywhere</h1>
      <p className='text-gray-500 sm:text-sm max-w-2xl text-center'>Unlock your potential with our expert-led courses. Whether you're starting your journey or advancing your career, we provide the tools and support you need to succeed in today's dynamic world.</p>

      <div className='flex item-center font-medium gap-6 mt-4'>
        <button
          className='px-10 py-3 rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)] transition-all duration-300'
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate('/');
          }}
        >
          Get Started
        </button>
        <button onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate('/');
          }}
         className='flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 transition-all duration-300'>
          Learn More <img src={assets.arrow_icon} alt="arrow" className='w-6 h-6' />
        </button>
      </div>
    </div>
  )
}

export default CallToAction
