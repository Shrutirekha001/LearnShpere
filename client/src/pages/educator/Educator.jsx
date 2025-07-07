import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'

const Educator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className='flex'>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className='flex-1'>
          {<Outlet />}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Educator
