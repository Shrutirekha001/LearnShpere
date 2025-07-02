import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import YouTube from 'react-youtube'
import axios from 'axios'
import { toast } from 'react-toastify'

const CourseDetails = () => {

  const { id } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [openSection, setOpenSection] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)
  

  const { allCourses, calculateRating , calculateChapterTime, calculateCourseDuration,calculateNoOfLectures, currency,backendUrl,userData,getToken} = useContext(AppContext)

  const fetchCourseData = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/course/' + id)

      if(data.success){
        setCourseData(data.courseData)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  const enrollCourse = async () => {
    try {
      if(!userData){
        return toast.warn('Please login to enroll in the course')
      }
      if(isAlreadyEnrolled) {
        return toast.warn('You are already enrolled in this course')
      }
      const token = await getToken();

      const{data} = await axios.post(backendUrl + '/api/user/purchase', {courseId: courseData._id}, {headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        const {session_url} = data;
        window.location.replace(session_url)
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [])

  useEffect(() => {
   if(userData && courseData){
    setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
   }
  }, [userData, courseData])


  const toggleSection = (index) => {
    setOpenSection(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


  return courseData ? (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-10 relative items-start justify-between px-8 pt-20 text-left md:px-36 md:pt-30">

        <div className='absolute top-0 left-0 w-full h-[500px] -z[-1] bg-gradient-to-b from-purple-200 via-purple-100/80 to-transparent'>

        </div>



        {/* left coloum */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='text-3xl font-semibold bg-gradient-to-r from-blue-600 to-pink-500 text-transparent bg-clip-text md:text-5xl'>{courseData.courseTitle}</h1>
          <p className='pt-4 text-sm md:text-base'
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}></p>


          {/* review and rating */}
          <div className='flex items-center space-x-2 mt-2 pt-3 pb-1 text-sm'>
            <p className='text-purple-600 font-medium'>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (<img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5' />
              ))}
            </div>
            <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c5.421 0 10-4.579 10-10S17.421 2 12 2 2 6.579 2 12s4.579 10 10 10zm0-18a8 8 0 100 16 8 8 0 000-16zm-1 4h2v6h-2V8zm0 8h2v2h-2v-2z" />
              </svg>
              <span>{courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'}</span>
            </div>

            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.673 0 8 1.337 8 4v2H4v-2c0-2.663 5.327-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
              <span>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</span>
            </div>
          </div>


          <p>Course by <span className='text-purple-600 font-semibold'>{courseData.educator.name}</span></p>

          <div className='pt-8 text-gray-800'>
             <h2 className='text-xl font-semibold'>Course Stucture</h2>

             <div className='pt-5'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                  <div className='flex item-center justify-between px-4 py-3 cursor-pointer select-none' onClick={()=> toggleSection(index)}>
                    <div className='flex items-center gap-2'>
                      <img className={`transform transition-transform ${openSection[index] ? 'rotate-180' :''}`}
                      src={assets.down_arrow_icon} alt="arrow" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className=' md:text-default'>{chapter.chapterContent.length} lectures -{calculateChapterTime(chapter)}</p>
                  </div>


                  <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className='flex items-start gap-2 py-1'>
                          <img src={assets.play_icon} alt="play icon"  className='w-4 h-4 mt-1'/>
                          <div className='flex items-center justify-between w-full text-gray-800  md:text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {lecture.isPreviewFree &&  <p 
                              onClick={()=>setPlayerData({
                                videoId : lecture.lectureUrl.split('/').pop()
                              })}
                              className='text-purple-600 cursor-pointer'>Preview</p>}
                              <p>{humanizeDuration(lecture.lectureDuration* 60 * 1000, {units: ['h', 'm']})}</p>
                            </div>
                          </div>

                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

             </div>

          </div>


          <div>
            <div className='py-20 text-sm md:text-default'>
              <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
              <p className='pt-3 rich-text '
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}></p>

            </div>
          </div>


        </div>
        {/* right coloum */}
        <div className='max-w-[424px] z-10 shadow-[0px_4px_15px_2px_rgba(0,0,0,0.1)] rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
          {
            playerData ?
                     <YouTube videoId={playerData.videoId} opts={{playerVars:{ autoplay: 1}}} iframeClassName='w-full aspect-video'/>
                    :<img src={courseData.courseThumbnail} alt="" />

          }
          
          <div className='p-5'>
                <div className='flex items-center gap-2'>
                   <img className='w-3.5' src={assets.time_left_clock_icon} alt="time left icon" />
                   <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price</p>
                </div>

                <div className='flex items-center gap-3 pt-2'>
                  <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
                  <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
                  <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
                </div>

                <div className='flex items-center gap-4 pt-2 text-sm md:text-default md:pt-4 text-gray-500'>

                  <div className='flex items-center gap-1'>
                    <img src={assets.star} alt="star" />
                    <p>{calculateRating(courseData)}</p>
                  </div>

                  <div className='h-4 w-px bg-gray-500/40'></div>
                   
                   <div className='flex items-center gap-1'>
                    <img src={assets.time_clock_icon} alt="time clock" />
                    <p>{calculateCourseDuration(courseData)}</p>
                  </div>

                  <div className='h-4 w-px bg-gray-500/40'></div>

                  <div className='flex items-center gap-1'>
                    <img src={assets.lesson_icon} alt="lesson icon" />
                    <p>{calculateNoOfLectures(courseData)} lessons</p>
                  </div>


                </div>

                <button onClick={enrollCourse} className='md:mt-6 mt-4 w-full py-3 rounded text-white bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)] px-10 transition-all duration-300  font-medium'
                >{isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}</button>

                <div className='pt-6'>
                  <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
                   <ul className='ml-5 pt-2  md:text-default text-gray-500 list-disc'>
                    <li>Lifetime access with free updates.</li>
                    <li>Step-by-step, hands-on project guidance.</li>
                    <li>Downloadable resources and source code.</li>
                    <li>Quizzes to test your knowledge.</li>
                    <li>Certificate of completion.</li>
                   </ul>
                </div>
          </div>
        </div>
        <div>

        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default CourseDetails
