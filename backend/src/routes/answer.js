import express from 'express';
import { generateAnswer } from '../services/llmService.js';
import { sessionData } from './resume.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { sessionId, question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log('Generating answer for question:', question);

    // Get session context if available
    let resumeContext = null;
    let jobContext = null;

    if (sessionId && sessionData.has(sessionId)) {
      const session = sessionData.get(sessionId);
      resumeContext = session.resume || null;
      jobContext = session.job || null;
    }

    // Generate answer using LLM
    const result = await generateAnswer(question, resumeContext, jobContext);

    res.json({
      success: true,
      question,
      answer: result.answer,
      questionType: result.questionType,
      usedContext: result.usedContext,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Answer generation error:', error);
    res.status(500).json({
      error: 'Failed to generate answer',
      message: error.message
    });
  }
});

export default router;
