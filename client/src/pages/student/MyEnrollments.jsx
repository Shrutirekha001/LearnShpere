import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { useState } from 'react'
import Footer from '../../components/student/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyEnrollments = () => {


  const { enrolledCourses, calculateCourseDuration, navigate, userData, fetchUserEnrolledCourses, backendUrl, getToken, calculateNoOfLectures } = useContext(AppContext)

  const [progressArray, setProgressArray] = useState([])

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`, { courseId: course._id }, { headers: { Authorization: `Bearer ${token}` } })
          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
          return {
            totalLectures,
            lectureCompleted
          }
        })
      )
      setProgressArray(tempProgressArray);


    } catch (error) {
        toast.error(error.message);
    }
  }
 
  useEffect(()=>{
      if(userData){
        fetchUserEnrolledCourses()
      }
  },[userData])

  useEffect(()=>{
      if(enrolledCourses.length > 0){
        getCourseProgress()
      }
  },[enrolledCourses])
  

  return (
    <>
      <div className='md:px-36 px-8 pt-10'>
        <h1 className='text-2xl font-semibold bg-gradient-to-r from-blue-600 to-pink-500 text-transparent bg-clip-text'>My Enrollments</h1>
        <table className='md:table-auto table-fixed w-full overflow-hidden border border-gray-500/20 mt-10'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {enrolledCourses.map((course, index) => (
              <tr key={index} className='border-b border-gray-500/20' >
                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                  <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28' />
                  <div className='flex-1'>
                    <p className='mb-1 max-sm:text-sm'>
                      {course.courseTitle}
                    </p>
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradientMove"
                        style={{
                          width: `${(progressArray[index]?.lectureCompleted / progressArray[index]?.totalLectures) * 100 || 0}%`,
                          backgroundSize: '200% 200%',
                        }}
                      ></div>
                    </div>



                  </div>
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  {calculateCourseDuration(course)}
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  {progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}<span>Lectures</span>
                </td>
                <td className='px-4 py-3 max-sm:text-right'>
                  <button className='px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)] rounded-lg transition-all duration-300 max-sm:text-xs text-white' onClick={() => navigate('/player/' + course._id)}>
                    {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 ? 'Completed' : 'On Going'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <Footer />
    </>
  )
}

export default MyEnrollments
