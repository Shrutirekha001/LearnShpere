import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-16 pb-10 px-4 md:px-20'>
      <p className='text-base text-gray-500 text-center'>Trusted by learners from</p>
      <div className='flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-8'>
        <img src={assets.microsoft_logo} alt="Microsoft" className='w-24 md:w-28 opacity-80 hover:opacity-100 transition-opacity' />
        <img src={assets.walmart_logo} alt="Walmart" className='w-24 md:w-28 opacity-80 hover:opacity-100 transition-opacity' />
        <img src={assets.accenture_logo} alt="Accenture" className='w-24 md:w-28 opacity-80 hover:opacity-100 transition-opacity' />
        <img src={assets.adobe_logo} alt="Adobe" className='w-24 md:w-28 opacity-80 hover:opacity-100 transition-opacity' />
        <img src={assets.paypal_logo} alt="PayPal" className='w-24 md:w-28 opacity-80 hover:opacity-100 transition-opacity' />
      </div>
    </div>
  )
}

export default Companies
