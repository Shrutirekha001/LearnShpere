import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full md:pt-36 pt-20 px-7 md:px-20 space-y-10 md:space-y-0 bg-gradient-to-b from-purple-200 via-purple-100/80 to-transparent">
      
      <div className="w-full md:w-1/2 flex justify-center relative">
        <div className="relative flex items-center justify-center w-[250px] h-[250px] md:w-[500px] md:h-[500px]">
          {/* Animated Circle Background */}
          <div className="absolute rounded-full bg-gradient-to-tr from-purple-300 via-blue-300 to-pink-300 animate-spin-slow"
               style={{
                 width: '100%',
                 height: '100%',
                 zIndex: 1,
                 filter: 'blur(8px)',
                 animationDuration: '8s'
               }}>
          </div>
          {/* Study Image */}
          <img
            src={assets.study}
            alt="Study"
            className="relative z-10 w-[200px] h-[200px] md:w-[400px] md:h-[400px] object-cover"
            style={{ borderRadius: '50%' }}
          />
        </div>
     </div>

      {/* Right: Text Content */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="md:text-6xl text-3xl font-extrabold text-gray-900 leading-tight">
          Empower your future with the <br className="hidden md:block" />
          courses designed to{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text font-extrabold relative">
            fit your choice.
          </span>
        </h1>
        <p className="text-gray-500 text-base md:text-lg max-w-xl mt-6">
          We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.
        </p>
        <p className='md:hidden text-gray-500 max-w-sm mx-auto'>we bring together world-class instructors to hlep you achieve your professional goals</p>
        <div className="w-full mt-8">
          <SearchBar />
        </div>
      </div>
      
    </div>
  )
}

export default Hero
