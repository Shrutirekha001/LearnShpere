import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
     <h2 className='text-3xl font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text'>Testimonials</h2>
     <p className='md:text-base text-gray-500 mt-3'>Hear from our learners as they share their journeys of transformation,success, and how our <br />platform has made a difference in their lives</p>

     <div className='grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-8 mt-14'>
        {dummyTestimonial.map((testimonial, index) => (
         <div key={index} className='text-sm text-left border border-purple-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-purple-100/50 hover:shadow-[0_0_12px_rgba(168,85,247,0.2),0_0_12px_rgba(59,130,246,0.2)] transition-all duration-300 overflow-hidden'>
           <div className='flex item-center gap-4 px-5 py-4 bg-gradient-to-r from-purple-50 to-blue-50'>
            <img className='h-12 w-12 rounded-full' src={testimonial.image} alt={testimonial.name} />
            <div>
              <h1 className='text-lg font-semibold text-gray-800'>{testimonial.name}</h1>
              <p className='text-gray-800/80'>{testimonial.role}</p>
            </div>
           </div>
           <div className='p-5 pb-7'>
              <div className='flex gap-0.5'>
                {[...Array(5)].map((_,i)=>(
                <img className='h-5' key={i} src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank } alt='star'  />
              ))}
              </div>
              <p className='text-gray-500 mt-5'>{testimonial.feedback}</p>
            </div>
            <a href="#" className='inline-block px-5 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 transition-all duration-300'>Read more →</a>
         </div>
        ))}
    </div>
    </div>
  )
}

export default TestimonialsSection
