import React, { useState, useEffect, useRef, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext'

const QuizTaker = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { backendUrl, getToken } = useContext(AppContext)
  
  const [quizData, setQuizData] = useState(null)
  const [userAnswers, setUserAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const timerRef = useRef()
  const userAnswersRef = useRef(userAnswers)

  useEffect(() => {
    fetchQuizData()
  }, [id])

  useEffect(() => {
    userAnswersRef.current = userAnswers
  }, [userAnswers])

  // Timer effect
  useEffect(() => {
    if (quizData && quizData.timeLimit > 0 && !showResults) {
      setTimeLeft(quizData.timeLimit * 60)
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 1) {
            clearInterval(timerRef.current)
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timerRef.current)
    }
  }, [quizData, showResults])

  const handleAutoSubmit = () => {
    if (!showResults && !quizCompleted) {
      submitQuiz(userAnswersRef.current)
    }
  }

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/quiz/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      if (data.success) {
        setQuizData(data.quiz);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const submitQuiz = async (answersOverride) => {
    try {
      const token = await getToken();
      const response = await fetch(`${backendUrl}/api/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          quizId: id,
          answers: Object.values(answersOverride || userAnswers)
        }),
      });

      const data = await response.json();
      console.log('Quiz submit response:', data);

      if (data.success) {
        setScore(data.result.score)
        setQuizCompleted(true)
        setShowResults(true)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Failed to submit quiz')
      console.error('Quiz submit error:', error)
    }
  }

  const resetQuiz = () => {
    setUserAnswers({})
    setCurrentQuestion(0)
    setQuizCompleted(false)
    setScore(0)
    setShowResults(false)
  }

  const nextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const getQuestionStatus = (index) => {
    if (userAnswers[index]) {
      return 'answered'
    }
    return 'unanswered'
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
            onClick={() => navigate('/quiz')}
            className='bg-purple-500 text-white px-4 py-2 rounded-lg'
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Quiz not found</p>
          <button 
            onClick={() => navigate('/quiz')}
            className='bg-purple-500 text-white px-4 py-2 rounded-lg'
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='min-h-screen bg-gradient-to-b from-purple-50 via-white to-white'>
        <div className='max-w-4xl mx-auto p-4 md:p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-4'>
              {quizData.title}
            </h1>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              {quizData.description}
            </p>
            {/* Timer */}
            {quizData.timeLimit > 0 && !showResults && (
              <div className={`mt-4 text-lg font-semibold ${timeLeft !== null && timeLeft <= 60 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                Time Left: {timeLeft !== null ? `${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}` : '--:--'}
                {timeLeft !== null && timeLeft <= 60 && <span className='ml-2 text-sm'>(Hurry up! Less than 1 minute left)</span>}
              </div>
            )}
          </div>

          {!showResults ? (
            <div className='bg-white rounded-lg shadow-lg p-6 md:p-8'>
              {/* Progress Bar */}
              <div className='mb-6'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-sm text-gray-600'>
                    Question {currentQuestion + 1} of {quizData.questions.length}
                  </span>
                  <span className='text-sm text-gray-600'>
                    {Math.round(((currentQuestion + 1) / quizData.questions.length) * 100)}% Complete
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div 
                    className='bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300'
                    style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Navigation */}
              <div className='flex flex-wrap gap-2 mb-6'>
                {quizData.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                      index === currentQuestion
                        ? 'bg-purple-500 text-white'
                        : getQuestionStatus(index) === 'answered'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Current Question */}
              <div className='mb-8'>
                <h2 className='text-xl font-semibold text-gray-800 mb-6'>
                  {currentQuestion + 1}. {quizData.questions[currentQuestion]?.question}
                </h2>

                <div className='space-y-3'>
                  {quizData.questions[currentQuestion]?.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        userAnswers[currentQuestion] === String.fromCharCode(97 + index)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type='radio'
                        name={`question-${currentQuestion}`}
                        value={String.fromCharCode(97 + index)}
                        checked={userAnswers[currentQuestion] === String.fromCharCode(97 + index)}
                        onChange={() => handleAnswerSelect(currentQuestion, String.fromCharCode(97 + index))}
                        className='sr-only'
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        userAnswers[currentQuestion] === String.fromCharCode(97 + index)
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {userAnswers[currentQuestion] === String.fromCharCode(97 + index) && (
                          <div className='w-2 h-2 bg-white rounded-full mx-auto mt-0.5'></div>
                        )}
                      </div>
                      <span className='text-gray-700'>
                        {String.fromCharCode(97 + index)}) {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className='flex justify-between items-center'>
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Previous
                </button>

                {currentQuestion === quizData.questions.length - 1 ? (
                  <button
                    onClick={() => submitQuiz()}
                    disabled={Object.keys(userAnswers).length < quizData.questions.length}
                    className='bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-[0_0_12px_rgba(34,197,94,0.4),0_0_12px_rgba(59,130,246,0.3)] text-white px-8 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className='bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300'
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className='bg-white rounded-lg shadow-lg p-6 md:p-8'>
              <div className='text-center mb-8'>
                <h2 className='text-2xl font-bold text-gray-800 mb-4'>Quiz Results</h2>
                <div className='text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-4'>
                  {score}/{quizData.totalQuestions}
                </div>
                <p className='text-gray-600 mb-6'>
                  {score === quizData.totalQuestions ? 'Perfect! 🎉' : 
                   score >= quizData.totalQuestions * 0.8 ? 'Great job! 👍' :
                   score >= quizData.totalQuestions * 0.6 ? 'Good effort! 💪' : 'Keep practicing! 📚'}
                </p>
                <div className='text-lg text-gray-700'>
                  Percentage: {Math.round((score / quizData.totalQuestions) * 100)}%
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4 justify-center'>
                <button
                  onClick={resetQuiz}
                  className='bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300'
                >
                  Take Quiz Again
                </button>
                <button
                  onClick={() => navigate('/quiz')}
                  className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default QuizTaker 