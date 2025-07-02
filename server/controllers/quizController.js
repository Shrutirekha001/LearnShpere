import Quiz from "../models/Quiz.js";

// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, questions, timeLimit, isPublished } = req.body;
    const educator = req.auth.userId;

    if (!title || !description || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and questions are required"
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      educator,
      questions,
      totalQuestions: questions.length,
      timeLimit: timeLimit || 0,
      isPublished: typeof isPublished === 'boolean' ? isPublished : true
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all published quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true })
      .select(['title', 'description', 'totalQuestions', 'timeLimit', 'createdAt'])
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get quiz by ID (for taking the quiz)
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    if (!quiz.isPublished) {
      return res.status(403).json({
        success: false,
        message: "Quiz is not published"
      });
    }

    // Remove correct answers for security
    const quizForStudent = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      totalQuestions: quiz.totalQuestions,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options
      }))
    };

    res.json({
      success: true,
      quiz: quizForStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get educator's quizzes
export const getEducatorQuizzes = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const quizzes = await Quiz.find({ educator })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Submit quiz attempt
export const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.auth.userId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (
        answers[index] &&
        question.correctAnswer &&
        answers[index].toLowerCase() === question.correctAnswer.toLowerCase()
      ) {
        correctAnswers++;
      }
    });

    const percentage = Math.round((correctAnswers / quiz.totalQuestions) * 100);

    // Add attempt to quiz
    quiz.attempts.push({
      userId,
      score: correctAnswers,
      totalQuestions: quiz.totalQuestions,
      percentage
    });

    await quiz.save();

    res.json({
      success: true,
      message: "Quiz submitted successfully",
      result: {
        score: correctAnswers,
        totalQuestions: quiz.totalQuestions,
        percentage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update quiz
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions, timeLimit, isPublished } = req.body;
    const educator = req.auth.userId;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    if (quiz.educator !== educator) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own quizzes"
      });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      {
        title,
        description,
        questions,
        totalQuestions: questions.length,
        timeLimit,
        isPublished,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Quiz updated successfully",
      quiz: updatedQuiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const educator = req.auth.userId;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    if (quiz.educator !== educator) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own quizzes"
      });
    }

    await Quiz.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Quiz deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 

