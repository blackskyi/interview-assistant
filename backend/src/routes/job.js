import express from 'express';
import { sessionData } from './resume.js';

const router = express.Router();

router.post('/add', (req, res) => {
  try {
    const { sessionId, jobDescription, jobTitle, company } = req.body;

    if (!sessionId || !jobDescription) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['sessionId', 'jobDescription']
      });
    }

    // Get or create session
    if (!sessionData.has(sessionId)) {
      sessionData.set(sessionId, {});
    }

    // Store job context
    sessionData.get(sessionId).job = {
      description: jobDescription,
      title: jobTitle || 'Not specified',
      company: company || 'Not specified',
      addedAt: new Date().toISOString()
    };

    console.log(`Job description added for session ${sessionId}`);

    res.json({
      success: true,
      message: 'Job description added successfully',
      data: {
        sessionId,
        jobTitle: jobTitle || 'Not specified',
        company: company || 'Not specified'
      }
    });
  } catch (error) {
    console.error('Job description error:', error);
    res.status(500).json({
      error: 'Failed to add job description',
      message: error.message
    });
  }
});

router.get('/context/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessionData.get(sessionId);

  if (!session || !session.job) {
    return res.status(404).json({ error: 'Session or job description not found' });
  }

  res.json({
    success: true,
    data: session.job
  });
});

export default router;
