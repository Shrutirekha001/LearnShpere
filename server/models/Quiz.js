import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  educator: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: String,
      required: true
    }
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  timeLimit: {
    type: Number,
    default: 0 // 0 means no time limit
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  attempts: [{
    userId: String,
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Quiz", quizSchema); 
