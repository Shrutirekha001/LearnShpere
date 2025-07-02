import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const QuizGenerator = () => {
  const [activeTab, setActiveTab] = useState('ai')

  // AI Quiz Generator State
  const [inputText, setInputText] = useState('')
  const [quizData, setQuizData] = useState({
    questions: [],
    isLoading: false,
    error: null
  })

  // Manual Quiz Creator State
  const [manualQuiz, setManualQuiz] = useState({
    title: '',
    description: '',
    timeLimit: '',
    questions: [
      { question: '', options: ['', '', '', ''], correctAnswer: '' }
    ]
  })
  const [manualError, setManualError] = useState(null)
  const [manualLoading, setManualLoading] = useState(false)
  const [manualSuccess, setManualSuccess] = useState(null)

  // New state for Save AI Quiz
  const [aiSaveLoading, setAiSaveLoading] = useState(false)
  const [aiSaveSuccess, setAiSaveSuccess] = useState(null)
  const [aiSaveError, setAiSaveError] = useState(null)

  const generateQuiz = async () => {
    if (!inputText.trim()) {
      setQuizData(prev => ({
        ...prev,
        error: 'Please enter some content to generate quiz questions'
      }))
      return
    }

    setQuizData(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('http://localhost:5000/api/quiz/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText: inputText.trim() }),
      })

      const data = await response.json()
      
      if (data.success) {
        const parsedQuestions = parseQuizContent(data.quiz)
        setQuizData({
          questions: parsedQuestions,
          isLoading: false,
          error: null
        })
      } else {
        setQuizData(prev => ({
          ...prev,
          isLoading: false,
          error: data.message
        }))
      }
    } catch (error) {
      setQuizData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to generate quiz. Please check your connection.'
      }))
    }
  }

  const parseQuizContent = (quizText) => {
    const questions = []
    const lines = quizText.split('\n').filter(line => line.trim())
    
    let currentQuestion = null
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.startsWith('Q') && line.includes('.')) {
        if (currentQuestion) {
          questions.push(currentQuestion)
        }
        currentQuestion = {
          question: line.substring(line.indexOf('.') + 1).trim(),
          options: [],
          correctAnswer: ''
        }
      } else if (line.match(/^[a-d]\)/)) {
        if (currentQuestion) {
          currentQuestion.options.push(line.substring(2).trim())
        }
      } else if (line.toLowerCase().includes('correct answer:')) {
        if (currentQuestion) {
          currentQuestion.correctAnswer = line.split(':')[1].trim()
        }
      }
    }
    
    if (currentQuestion) {
      questions.push(currentQuestion)
    }
    
    return questions
  }

  const clearQuiz = () => {
    setQuizData({
      questions: [],
      isLoading: false,
      error: null
    })
    setInputText('')
  }

  // Manual Quiz Handlers
  const handleManualChange = (e) => {
    setManualQuiz({ ...manualQuiz, [e.target.name]: e.target.value })
  }
  const handleQuestionChange = (idx, field, value) => {
    const updatedQuestions = manualQuiz.questions.map((q, i) =>
      i === idx ? { ...q, [field]: value } : q
    )
    setManualQuiz({ ...manualQuiz, questions: updatedQuestions })
  }
  const handleOptionChange = (qIdx, optIdx, value) => {
    const updatedQuestions = manualQuiz.questions.map((q, i) =>
      i === qIdx
        ? { ...q, options: q.options.map((opt, oi) => (oi === optIdx ? value : opt)) }
        : q
    )
    setManualQuiz({ ...manualQuiz, questions: updatedQuestions })
  }
  const addQuestion = () => {
    setManualQuiz({
      ...manualQuiz,
      questions: [
        ...manualQuiz.questions,
        { question: '', options: ['', '', '', ''], correctAnswer: '' }
      ]
    })
  }
  const removeQuestion = (idx) => {
    setManualQuiz({
      ...manualQuiz,
      questions: manualQuiz.questions.filter((_, i) => i !== idx)
    })
  }
  const handleManualSubmit = async (e) => {
    e.preventDefault()
    setManualError(null)
    setManualSuccess(null)
    setManualLoading(true)
    // Basic validation
    if (!manualQuiz.title.trim() || !manualQuiz.questions.length) {
      setManualError('Quiz title and at least one question are required.')
      setManualLoading(false)
      return
    }
    for (const q of manualQuiz.questions) {
      if (!q.question.trim() || q.options.some(opt => !opt.trim()) || !q.correctAnswer.trim()) {
        setManualError('All questions, options, and correct answers are required.')
        setManualLoading(false)
        return
      }
    }
    // Prepare payload
    const payload = {
      title: manualQuiz.title,
      description: manualQuiz.description,
      timeLimit: Number(manualQuiz.timeLimit) || 0,
      questions: manualQuiz.questions
    }
    try {
      const res = await fetch('http://localhost:5000/api/quiz/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        setManualSuccess('Quiz created successfully!')
        setManualQuiz({
          title: '',
          description: '',
          timeLimit: '',
          questions: [
            { question: '', options: ['', '', '', ''], correctAnswer: '' }
          ]
        })
      } else {
        setManualError(data.message || 'Failed to create quiz.')
      }
    } catch (err) {
      setManualError('Failed to create quiz. Please try again.')
    }
    setManualLoading(false)
  }

  const saveAIQuiz = async () => {
    setAiSaveError(null)
    setAiSaveSuccess(null)
    if (!quizData.questions.length) return
    const title = prompt('Enter a title for this quiz:')
    if (!title) return
    const description = prompt('Enter a description for this quiz:') || ''
    setAiSaveLoading(true)
    const payload = {
      title,
      description,
      timeLimit: 0,
      questions: quizData.questions
    }
    try {
      const res = await fetch('http://localhost:5000/api/quiz/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        setAiSaveSuccess('Quiz saved successfully!')
        // Optionally clear quizData or redirect
      } else {
        setAiSaveError(data.message || 'Failed to save quiz.')
      }
    } catch (err) {
      setAiSaveError('Failed to save quiz. Please try again.')
    }
    setAiSaveLoading(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-purple-50 via-white to-white p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Tabs */}
        <div className='flex justify-center mb-8'>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-200 ${activeTab === 'ai' ? 'bg-white shadow text-purple-700' : 'bg-purple-100 text-gray-500'}`}
            onClick={() => setActiveTab('ai')}
          >
            AI Quiz Generator
          </button>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-200 ml-2 ${activeTab === 'manual' ? 'bg-white shadow text-purple-700' : 'bg-purple-100 text-gray-500'}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Quiz Creator
          </button>
        </div>

        {/* AI Quiz Generator Tab */}
        {activeTab === 'ai' && (
          <>
            {/* Header */}
            <div className='text-center mb-8'>
              <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-4'>
                AI Quiz Generator
              </h1>
              <p className='text-gray-600 max-w-2xl mx-auto'>
                Generate intelligent quiz questions from your course content using AI. 
                Simply paste your text and get 5 multiple choice questions with correct answers.
              </p>
            </div>

            {/* Input Section */}
            <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>Course Content</h2>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your course content, lecture notes, or any educational material here..."
                className='w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none'
              />
              
              <div className='flex gap-4 mt-4'>
                <button
                  onClick={generateQuiz}
                  disabled={quizData.isLoading || !inputText.trim()}
                  className='flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)] text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {quizData.isLoading ? (
                    <span className='flex items-center justify-center'>
                      <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Generating Quiz...
                    </span>
                  ) : (
                    'Generate Quiz'
                  )}
                </button>
                
                {quizData.questions.length > 0 && (
                  <button
                    onClick={clearQuiz}
                    className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    Clear All
                  </button>
                )}
              </div>

              {quizData.error && (
                <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-red-600 text-sm'>{quizData.error}</p>
                </div>
              )}
            </div>

            {/* Quiz Results */}
            {quizData.questions.length > 0 && (
              <div className='bg-white rounded-lg shadow-lg p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-semibold text-gray-800'>
                    Generated Quiz Questions ({quizData.questions.length})
                  </h2>
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <img src={assets.lesson_icon} alt="" className='w-4 h-4' />
                    <span>AI Generated</span>
                  </div>
                </div>

                <div className='space-y-6'>
                  {quizData.questions.map((question, index) => (
                    <div key={index} className='border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'>
                      <div className='flex items-start gap-3 mb-4'>
                        <div className='bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold'>
                          {index + 1}
                        </div>
                        <h3 className='text-lg font-medium text-gray-800 flex-1'>
                          {question.question}
                        </h3>
                      </div>

                      <div className='ml-11 space-y-2'>
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className='flex items-center gap-3 p-3 rounded-lg bg-gray-50'>
                            <span className='text-sm font-medium text-gray-600 w-6'>
                              {String.fromCharCode(97 + optIndex)})
                            </span>
                            <span className='text-gray-700'>{option}</span>
                          </div>
                        ))}
                      </div>

                      <div className='mt-4 ml-11 p-3 bg-green-50 border border-green-200 rounded-lg'>
                        <div className='flex items-center gap-2'>
                          <img src={assets.blue_tick_icon} alt="" className='w-4 h-4' />
                          <span className='text-sm font-medium text-green-700'>
                            Correct Answer: {question.correctAnswer}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className='flex gap-4 mt-8 pt-6 border-t border-gray-200'>
                  <button
                    className='flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-[0_0_12px_rgba(34,197,94,0.4),0_0_12px_rgba(59,130,246,0.3)] text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={saveAIQuiz}
                    disabled={aiSaveLoading}
                  >
                    {aiSaveLoading ? 'Saving...' : 'Save Quiz'}
                  </button>
                </div>

                {aiSaveSuccess && (
                  <div className='mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700'>{aiSaveSuccess}</div>
                )}
                {aiSaveError && (
                  <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600'>{aiSaveError}</div>
                )}
              </div>
            )}
          </>
        )}

        {/* Manual Quiz Creator Tab */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className='bg-white rounded-lg shadow-lg p-6 mb-8'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Create Quiz Manually</h2>
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1'>Quiz Title</label>
              <input
                type='text'
                name='title'
                value={manualQuiz.title}
                onChange={handleManualChange}
                className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
                required
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1'>Description</label>
              <textarea
                name='description'
                value={manualQuiz.description}
                onChange={handleManualChange}
                className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
                rows={2}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1'>Time Limit (minutes)</label>
              <input
                type='number'
                name='timeLimit'
                value={manualQuiz.timeLimit}
                onChange={handleManualChange}
                className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
                min={0}
              />
            </div>
            <div className='mb-6'>
              <label className='block text-gray-700 font-medium mb-2'>Questions</label>
              {manualQuiz.questions.map((q, qIdx) => (
                <div key={qIdx} className='mb-6 border border-gray-200 rounded-lg p-4 relative'>
                  {manualQuiz.questions.length > 1 && (
                    <button type='button' onClick={() => removeQuestion(qIdx)} className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold'>×</button>
                  )}
                  <div className='mb-3'>
                    <input
                      type='text'
                      placeholder={`Question ${qIdx + 1}`}
                      value={q.question}
                      onChange={e => handleQuestionChange(qIdx, 'question', e.target.value)}
                      className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-3'>
                    {q.options.map((opt, optIdx) => (
                      <input
                        key={optIdx}
                        type='text'
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        value={opt}
                        onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                        className='border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
                        required
                      />
                    ))}
                  </div>
                  <div className='mb-2'>
                    <label className='block text-gray-700 font-medium mb-1'>Correct Answer (A, B, C, or D)</label>
                    <input
                      type='text'
                      maxLength={1}
                      placeholder='A'
                      value={q.correctAnswer}
                      onChange={e => handleQuestionChange(qIdx, 'correctAnswer', e.target.value.toUpperCase())}
                      className='w-24 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase'
                      required
                    />
                  </div>
                </div>
              ))}
              <button type='button' onClick={addQuestion} className='bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-300'>+ Add Question</button>
            </div>
            {manualError && <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600'>{manualError}</div>}
            {manualSuccess && <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700'>{manualSuccess}</div>}
            <button
              type='submit'
              disabled={manualLoading}
              className='w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {manualLoading ? 'Creating Quiz...' : 'Create Quiz'}
            </button>
          </form>
        )}

        {/* Tips Section */}
        <div className='mt-8 bg-blue-50 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-blue-800 mb-3'>💡 Tips for Better Quiz Generation</h3>
          <ul className='space-y-2 text-blue-700 text-sm'>
            <li>• Include key concepts and important points in your content</li>
            <li>• Use clear and specific language for better question generation</li>
            <li>• Include definitions, examples, and explanations</li>
            <li>• The more detailed your content, the better the questions will be</li>
            <li>• You can generate multiple quizzes from the same content</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default QuizGenerator 