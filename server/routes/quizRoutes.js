import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { protectEducator } from '../middlewares/authMiddleware.js';
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  getEducatorQuizzes,
  submitQuizAttempt,
  updateQuiz,
  deleteQuiz
} from '../controllers/quizController.js';

dotenv.config();

const quizRouter = express.Router();

// AI Quiz Generation using Google Gemini API
quizRouter.post('/generate-quiz', async (req, res) => {
  try {
    const { inputText } = req.body;

    if (!inputText) {
      return res.status(400).json({
        success: false,
        message: 'Input text is required'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const prompt = `
You are an AI LMS assistant. Generate 5 multiple choice questions (MCQ) from the following content.

Content:
${inputText}

Format:
Q1.
a)
b)
c)
d)
Correct Answer:
`;

    const response = await axios.post(endpoint, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    });

    const generatedQuiz = response.data.candidates[0].content.parts[0].text;

    res.json({
      success: true,
      quiz: generatedQuiz
    });

  } catch (error) {
    console.error('Gemini Quiz Generation Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Error generating quiz',
      error: error.response ? error.response.data : error.message
    });
  }
});

// Quiz CRUD Operations (Educators only)
quizRouter.post('/create', protectEducator, createQuiz);
quizRouter.get('/educator', protectEducator, getEducatorQuizzes);
quizRouter.put('/:id', protectEducator, updateQuiz);
quizRouter.delete('/:id', protectEducator, deleteQuiz);

// Quiz Taking (Students)
quizRouter.get('/', getAllQuizzes);
quizRouter.get('/:id', getQuizById);
quizRouter.post('/submit', submitQuizAttempt);

export default quizRouter;
