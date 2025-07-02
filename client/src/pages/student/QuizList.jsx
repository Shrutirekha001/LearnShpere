import React, { useState, useEffect, useContext } from 'react'
import { assets } from '../../assets/assets'
import QuizCard from '../../components/student/QuizCard'
import Footer from '../../components/student/Footer'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext'

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const { backendUrl, getToken } = useContext(AppContext)

  useEffect(() => {
    fetchQuizzes()
  }, [backendUrl, getToken])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      let headers = {}
      if (getToken) {
        const token = await getToken()
        if (token) headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${backendUrl}/api/quiz`, { headers })
      const data = await response.json()
      
      if (data.success) {
        setQuizzes(data.quizzes)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Failed to fetch quizzes')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>{error}</p>
          <button 
            onClick={fetchQuizzes}
            className='bg-purple-500 text-white px-4 py-2 rounded-lg'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='min-h-screen bg-gradient-to-b from-purple-50 via-white to-white'>
        <div className='max-w-7xl mx-auto px-4 md:px-8 pt-20'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-4'>
              Available Quizzes
            </h1>
            <p className='text-gray-600 max-w-2xl mx-auto text-lg'>
              Test your knowledge with our interactive quizzes. Choose from a variety of topics and challenge yourself!
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-10">
            <form className="w-full max-w-lg" onSubmit={e => e.preventDefault()}>
              <div className="flex items-center border border-gray-300 rounded-full shadow-sm bg-white px-4 py-2">
                <img src={assets.search_icon} alt="Search" className="w-6 h-6 mr-2 opacity-60" />
                <input
                  type="text"
                  placeholder="Search quizzes by title or description..."
                  className="w-full outline-none bg-transparent text-gray-700 px-2 py-1"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Quiz Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
            <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <img src={assets.lesson_icon} alt="" className='w-6 h-6' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>{quizzes.length}</h3>
              <p className='text-gray-600'>Total Quizzes</p>
            </div>
            
            <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <img src={assets.time_clock_icon} alt="" className='w-6 h-6' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                {quizzes.reduce((total, quiz) => total + quiz.totalQuestions, 0)}
              </h3>
              <p className='text-gray-600'>Total Questions</p>
            </div>
            
            <div className='bg-white rounded-lg shadow-lg p-6 text-center'>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <img src={assets.person_tick_icon} alt="" className='w-6 h-6' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>Free</h3>
              <p className='text-gray-600'>All Quizzes</p>
            </div>
          </div>

          {/* Quiz Grid */}
          {quizzes.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {quizzes
                .filter(quiz =>
                  quiz.title.toLowerCase().includes(search.toLowerCase()) ||
                  (quiz.description && quiz.description.toLowerCase().includes(search.toLowerCase()))
                )
                .map((quiz) => (
                  <QuizCard key={quiz._id} quiz={quiz} />
                ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <img src={assets.lesson_icon} alt="" className='w-12 h-12 opacity-50' />
              </div>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>No Quizzes Available</h3>
              <p className='text-gray-600 mb-6'>
                There are currently no published quizzes. Check back later!
              </p>
              <button 
                onClick={() => window.history.back()}
                className='bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors'
              >
                Go Back
              </button>
            </div>
          )}

          {/* Tips Section */}
          <div className='mt-16 bg-blue-50 rounded-lg p-8'>
            <h3 className='text-2xl font-semibold text-blue-800 mb-4 text-center'>
              💡 Quiz Tips
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div className='text-center'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='text-blue-600 font-bold text-lg'>1</span>
                </div>
                <h4 className='font-semibold text-blue-800 mb-2'>Read Carefully</h4>
                <p className='text-blue-700 text-sm'>Take your time to read each question and all answer options carefully.</p>
              </div>
              
              <div className='text-center'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='text-blue-600 font-bold text-lg'>2</span>
                </div>
                <h4 className='font-semibold text-blue-800 mb-2'>Review Answers</h4>
                <p className='text-blue-700 text-sm'>Review your answers before submitting to ensure accuracy.</p>
              </div>
              
              <div className='text-center'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <span className='text-blue-600 font-bold text-lg'>3</span>
                </div>
                <h4 className='font-semibold text-blue-800 mb-2'>Learn from Results</h4>
                <p className='text-blue-700 text-sm'>Use the detailed feedback to understand your mistakes and improve.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default QuizList 