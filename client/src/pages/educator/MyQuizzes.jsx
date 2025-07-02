import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import deleteGif from '../../assets/delete_icon.gif';

const MyQuizzes = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [viewQuiz, setViewQuiz] = useState(null); // For modal
  const [editQuiz, setEditQuiz] = useState(null); // For edit modal
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Fetch educator's quizzes
  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${backendUrl}/api/quiz/educator`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setQuizzes(data.quizzes);
      } else {
        setError(data.message || 'Failed to fetch quizzes.');
      }
    } catch (err) {
      setError('Failed to fetch quizzes.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line
  }, []);

  // Fetch quiz details for modal (if not already present)
  const handleView = async (quiz) => {
    if (quiz.questions && quiz.questions.length > 0) {
      setViewQuiz(quiz);
      return;
    }
    try {
      const token = await getToken();
      const res = await fetch(`${backendUrl}/api/quiz/${quiz._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setViewQuiz({ ...quiz, questions: data.quiz.questions, isPublished: data.quiz.isPublished });
      } else {
        alert(data.message || 'Failed to fetch quiz details.');
      }
    } catch (err) {
      alert('Failed to fetch quiz details.');
    }
  };

  // Edit quiz
  const handleEdit = async (quiz) => {
    if (quiz.questions && quiz.questions.length > 0) {
      setEditQuiz({ ...quiz });
      setEditError(null);
      return;
    }
    try {
      const token = await getToken();
      const res = await fetch(`${backendUrl}/api/quiz/${quiz._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEditQuiz({ ...quiz, questions: data.quiz.questions, isPublished: data.quiz.isPublished });
        setEditError(null);
      } else {
        alert(data.message || 'Failed to fetch quiz details.');
      }
    } catch (err) {
      alert('Failed to fetch quiz details.');
    }
  };

  // Save edited quiz
  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${backendUrl}/api/quiz/${editQuiz._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editQuiz.title,
          description: editQuiz.description,
          timeLimit: editQuiz.timeLimit,
          questions: editQuiz.questions,
          isPublished: editQuiz.isPublished
        })
      });
      const data = await res.json();
      if (data.success) {
        setQuizzes(quizzes.map(q => q._id === editQuiz._id ? { ...q, ...data.quiz } : q));
        setEditQuiz(null);
      } else {
        setEditError(data.message || 'Failed to update quiz.');
      }
    } catch (err) {
      setEditError('Failed to update quiz.');
    }
    setEditLoading(false);
  };

  // Handle edit form changes
  const handleEditChange = (field, value) => {
    setEditQuiz(prev => ({ ...prev, [field]: value }));
  };
  const handleEditQuestionChange = (idx, field, value) => {
    setEditQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === idx ? { ...q, [field]: value } : q)
    }));
  };
  const handleEditOptionChange = (qIdx, optIdx, value) => {
    setEditQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((opt, oi) => (oi === optIdx ? value : opt)) }
          : q
      )
    }));
  };
  const handleEditAddQuestion = () => {
    setEditQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', options: ['', '', '', ''], correctAnswer: '' }
      ]
    }));
  };
  const handleEditRemoveQuestion = (idx) => {
    setEditQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  // Delete quiz
  const handleDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    setDeletingId(quizId);
    try {
      const token = await getToken();
      const res = await fetch(`${backendUrl}/api/quiz/${quizId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setQuizzes(quizzes.filter(q => q._id !== quizId));
      } else {
        alert(data.message || 'Failed to delete quiz.');
      }
    } catch (err) {
      alert('Failed to delete quiz.');
    }
    setDeletingId(null);
  };

  if (loading) return <div className='p-8 text-center'><Loading/></div>;
  if (error) return <div className='p-8 text-center text-red-600'>{error}</div>;

  return (
    <div className='max-w-4xl mx-auto p-4 md:p-8'>
      <h1 className='text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text'>My Quizzes</h1>
      {quizzes.length === 0 ? (
        <div className='text-gray-500 text-center'>No quizzes found.</div>
      ) : (
        <div className='space-y-6'>
          {quizzes.map(quiz => (
            <div key={quiz._id} className='bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.lesson_icon} alt='' className='w-6 h-6'/>
                  <span className='text-xl font-semibold text-gray-800'>{quiz.title}</span>
                </div>
                <div className='text-gray-600 text-sm mb-1'>{quiz.description}</div>
                <div className='text-gray-500 text-xs mb-2'>Questions: {quiz.totalQuestions} | Time Limit: {quiz.timeLimit} min</div>
                <div className={`text-xs font-semibold ${quiz.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>Status: {quiz.isPublished ? 'Published' : 'Draft'}</div>
              </div>
              <div className='flex flex-col gap-2'>
                <button
                  onClick={() => handleView(quiz)}
                  className='bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300'
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(quiz)}
                  className='bg-gradient-to-r from-green-500 to-blue-500 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  disabled={deletingId === quiz._id}
                  className='flex items-center justify-center bg-transparent p-0 border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed'
                  title='Delete'
                >
                  <img src={deleteGif} alt='Delete' className='w-10 h-10'/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing quiz details */}
      {viewQuiz && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative'>
            <button
              onClick={() => setViewQuiz(null)}
              className='absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold'>&times;</button>
            <h2 className='text-2xl font-bold mb-2'>{viewQuiz.title}</h2>
            <div className='text-gray-600 mb-2'>{viewQuiz.description}</div>
            <div className={`text-xs font-semibold mb-4 ${viewQuiz.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>Status: {viewQuiz.isPublished ? 'Published' : 'Draft'}</div>
            <div className='space-y-6 max-h-[60vh] overflow-y-auto'>
              {viewQuiz.questions && viewQuiz.questions.length > 0 ? (
                viewQuiz.questions.map((q, idx) => (
                  <div key={idx} className='border-b pb-4'>
                    <div className='font-semibold mb-2'>Q{idx + 1}. {q.question}</div>
                    <ul className='mb-2'>
                      {q.options && q.options.map((opt, oidx) => (
                        <li key={oidx} className='ml-4'>
                          <span className='font-bold'>{String.fromCharCode(65 + oidx)})</span> {opt}
                        </li>
                      ))}
                    </ul>
                    <div className='text-green-700 text-sm'>Correct Answer: <span className='font-bold'>{q.correctAnswer}</span></div>
                  </div>
                ))
              ) : (
                <div className='text-gray-500'>No questions found for this quiz.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing quiz */}
      {editQuiz && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[80vh] overflow-y-auto'>
            <button
              onClick={() => setEditQuiz(null)}
              className='absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold'>&times;</button>
            <h2 className='text-2xl font-bold mb-4'>Edit Quiz</h2>
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1'>Quiz Title</label>
              <input
                type='text'
                value={editQuiz.title}
                onChange={e => handleEditChange('title', e.target.value)}
                className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
                required
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1'>Description</label>
              <textarea
                value={editQuiz.description}
                onChange={e => handleEditChange('description', e.target.value)}
                className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
                rows={2}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1'>Time Limit (minutes)</label>
              <input
                type='number'
                value={editQuiz.timeLimit}
                onChange={e => handleEditChange('timeLimit', e.target.value)}
                className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
                min={0}
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-2'>Questions</label>
              {editQuiz.questions.map((q, qIdx) => (
                <div key={qIdx} className='mb-6 border border-gray-200 rounded-lg p-4 relative'>
                  {editQuiz.questions.length > 1 && (
                    <button type='button' onClick={() => handleEditRemoveQuestion(qIdx)} className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold'>×</button>
                  )}
                  <div className='mb-3'>
                    <input
                      type='text'
                      placeholder={`Question ${qIdx + 1}`}
                      value={q.question}
                      onChange={e => handleEditQuestionChange(qIdx, 'question', e.target.value)}
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
                        onChange={e => handleEditOptionChange(qIdx, optIdx, e.target.value)}
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
                      onChange={e => handleEditQuestionChange(qIdx, 'correctAnswer', e.target.value.toUpperCase())}
                      className='w-24 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase'
                      required
                    />
                  </div>
                </div>
              ))}
              <button type='button' onClick={handleEditAddQuestion} className='bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-300'>+ Add Question</button>
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-medium mb-1'>Status</label>
              <select
                value={editQuiz.isPublished ? 'published' : 'draft'}
                onChange={e => handleEditChange('isPublished', e.target.value === 'published')}
                className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
              >
                <option value='published'>Published</option>
                <option value='draft'>Draft</option>
              </select>
            </div>
            {editError && <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600'>{editError}</div>}
            <button
              onClick={handleEditSave}
              disabled={editLoading}
              className='w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {editLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuizzes; 