import React, { useEffect, useState } from 'react'

const Rating = ({initialRating, onRate}) => {

  const [rating, setRating] = useState(initialRating || 0) 
  const [hoverRating, setHoverRating] = useState(0)
  
  useEffect(()=>{
    if(initialRating) {
      setRating(initialRating);
    }
  }, [initialRating])

  const handleRating = (value) =>{
    setRating(value);
    if(onRate) {
      onRate(value); // Call the onRate function if provided
    }
  }

  return (
    <div>
      {Array.from({ length: 5 }, (_, index) =>{
          const starValue = index + 1;
          return (
            <span key={index} 
                  className={`text-xl sm:text-2xl cursor-pointer transition-all duration-200 ease-in-out transform ${
                    starValue <= (hoverRating || rating)
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent scale-110 drop-shadow-lg'
                      : 'text-purple-200'
                  }`}
                  onClick={()=> handleRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
            >
              &#9733; {/* Unicode for filled star */}
            </span>
          )
      })}
    </div>
  )
}

export default Rating
