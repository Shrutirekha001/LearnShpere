import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import {  useNavigate } from 'react-router-dom'

const SearchBar = ({data}) => {

const navigate = useNavigate()
const [input, setInput] = useState(data ? data : '')

const onSearchHandler = (e) => {
  e.preventDefault()
  navigate('/course-list/' + input)
}


  return (
    <form
  onSubmit={onSearchHandler}
  className="max-w-xl w-full md:h-14 h-12 flex items-center 
             border border-gray-300 rounded-full shadow-sm 
             focus-within:outline-none 
             focus-within:ring-0
             focus-within:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)]
 
             transition-shadow duration-300"
>
  <img
    src={assets.search_icon}
    alt="Search"
    className="md:w-auto w-10 px-3"
  />
  <input
    onChange={(e) => setInput(e.target.value)}
    value={input}
    type="text"
    placeholder="Search for courses"
    className="w-full outline-none text-gray-500/80 bg-transparent"
  />
  <button
    type="submit"
    className="text-white rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 
               bg-[length:200%_200%] animate-gradient-x hover:scale-105 
               transition-transform md:px-10 px-7 md:py-3 py-2 mx-1"
  >
    Search
  </button>
</form>

  )
}

export default SearchBar
