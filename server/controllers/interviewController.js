const InterviewSession = require('../models/InterviewSession');
const { generateQuestions, evaluateAnswer, generateSessionSummary } = require('../services/ai/interviewAI');

// @desc    Start a new interview session
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res, next) => {
  console.log('1. Route entered: /api/interview/start');
  try {
    console.log('2. Controller started, checking API key');
    const hasKey = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here';
    if (!hasKey) {
      res.status(400);
      throw new Error('AI provider not configured.');
    }
    console.log('3. Request body parsed');
    const { interviewType, targetRole, difficulty, questionCount = 5 } = req.body;

    if (!interviewType || !targetRole || !difficulty) {
      res.status(400);
      throw new Error('Interview type, target role, and difficulty are required');
    }

    const count = Math.min(Math.max(parseInt(questionCount), 3), 10);

    // Generate questions via AI
    console.log('4. About to call interviewAI.generateQuestions');
    const rawQuestions = await generateQuestions(interviewType, targetRole, difficulty, count);
    console.log('5. Received raw questions from AI');

    const questions = rawQuestions.slice(0, count).map(q => ({
      questionText: q.questionText,
      questionType: q.questionType || 'technical',
      expectedTopics: q.expectedTopics || [],
      userAnswer: '',
      timeTaken: 0,
    }));

    console.log('6. Creating interview session in DB');
    const session = await InterviewSession.create({
      userId: req.user.id,
      interviewType,
      targetRole,
      difficulty,
      questionCount: count,
      questions,
      startedAt: new Date(),
      status: 'in_progress',
    });

    console.log('Before res.json');
    try {
      const jsonString = JSON.stringify(session);
      console.log('JSON.stringify succeeded, length', jsonString.length);
    } catch (e) {
      console.error('JSON.stringify failed:', e);
    }
    console.log('Sending response with res.json');
    return res.status(201).json(session.toObject());
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an answer for a specific question
// @route   POST /api/interview/answer
// @access  Private
const submitAnswer = async (req, res, next) => {
  try {
    const hasKey = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here';
    if (!hasKey) {
      res.status(400);
      throw new Error('AI provider not configured.');
    }
    const { sessionId, questionIndex, answer, timeTaken } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session) { res.status(404); throw new Error('Session not found'); }
    if (session.userId.toString() !== req.user.id) { res.status(401); throw new Error('Not authorized'); }
    if (questionIndex < 0 || questionIndex >= session.questions.length) {
      res.status(400); throw new Error('Invalid question index');
    }

    // Evaluate the answer with AI
    const evaluation = await evaluateAnswer(
      session.questions[questionIndex].questionText,
      answer,
      session.interviewType,
      session.difficulty
    );

    session.questions[questionIndex].userAnswer = answer || '';
    session.questions[questionIndex].timeTaken = timeTaken || 0;
    session.questions[questionIndex].evaluation = evaluation;
    session.markModified('questions');

    await session.save();
    res.status(200).json({ evaluation, questionIndex });
  } catch (error) {
    next(error);
  }
};

// @desc    Finish interview and generate summary
// @route   POST /api/interview/finish
// @access  Private
const finishInterview = async (req, res, next) => {
  try {
    const hasKey = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here';
    if (!hasKey) {
      res.status(400);
      throw new Error('AI provider not configured.');
    }
    const { sessionId } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session) { res.status(404); throw new Error('Session not found'); }
    if (session.userId.toString() !== req.user.id) { res.status(401); throw new Error('Not authorized'); }

    const answeredQs = session.questions.filter(q => q.evaluation && q.evaluation.technicalScore !== undefined);

    // Calculate scores
    const avg = (key) => {
      const vals = answeredQs.map(q => q.evaluation[key]).filter(v => v !== undefined);
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    };

    const technicalScore = avg('technicalScore');
    const communicationScore = avg('communicationScore');
    const confidenceScore = avg('confidenceScore');
    const relevanceScore = avg('relevanceScore');

    // Time management score: based on whether questions were answered in reasonable time
    const totalTime = session.questions.reduce((s, q) => s + (q.timeTaken || 0), 0);
    const expectedTime = session.questionCount * 120; // 2 minutes per question expected
    const timeManagementScore = Math.min(100, Math.round((expectedTime / Math.max(totalTime, 1)) * 80));

    const overallScore = Math.round(
      (technicalScore * 0.35 + communicationScore * 0.25 + confidenceScore * 0.2 + relevanceScore * 0.2)
    );

    // Generate AI summary
    const summary = await generateSessionSummary(
      session.questions, session.interviewType, session.targetRole, session.difficulty
    );

    const completedAt = new Date();
    const duration = Math.round((completedAt - new Date(session.startedAt)) / 1000);

    session.overallScore = overallScore;
    session.technicalScore = technicalScore;
    session.communicationScore = communicationScore;
    session.confidenceScore = confidenceScore;
    session.timeManagementScore = timeManagementScore;
    session.overallFeedback = summary.overallFeedback || '';
    session.strengths = summary.strengths || [];
    session.weaknesses = summary.weaknesses || [];
    session.studyTopics = summary.studyTopics || [];
    session.suggestedImprovements = summary.suggestedImprovements || [];
    session.completedAt = completedAt;
    session.duration = duration;
    session.status = 'completed';

    await session.save();
    return res.status(200).json(session.toObject());
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interview history
// @route   GET /api/interview/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user.id, status: 'completed' })
      .select('interviewType targetRole difficulty overallScore duration startedAt completedAt questionCount')
      .sort({ completedAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single session detail
// @route   GET /api/interview/history/:id
// @access  Private
const getSessionDetail = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);
    if (!session) { res.status(404); throw new Error('Session not found'); }
    if (session.userId.toString() !== req.user.id) { res.status(401); throw new Error('Not authorized'); }
    return res.status(200).json(session.toObject());
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a session
// @route   DELETE /api/interview/history/:id
// @access  Private
const deleteSession = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);
    if (!session) { res.status(404); throw new Error('Session not found'); }
    if (session.userId.toString() !== req.user.id) { res.status(401); throw new Error('Not authorized'); }
    await session.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Session deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { startInterview, submitAnswer, finishInterview, getHistory, getSessionDetail, deleteSession };
