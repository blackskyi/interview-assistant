import express from 'express';
import { upload } from '../server.js';
import { parsePDF } from '../services/pdfParser.js';
import fs from 'fs/promises';

const router = express.Router();

// In-memory storage for demo (use database in production)
const sessionData = new Map();

router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Received resume file:', req.file.originalname);

    // Parse the PDF
    const resumeData = await parsePDF(req.file.path);

    // Generate session ID
    const sessionId = Date.now().toString();

    // Store in session
    if (!sessionData.has(sessionId)) {
      sessionData.set(sessionId, {});
    }
    sessionData.get(sessionId).resume = resumeData;

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      sessionId,
      message: 'Resume uploaded and parsed successfully',
      data: {
        skills: resumeData.skills.slice(0, 10),
        experienceCount: resumeData.experience.length,
        educationCount: resumeData.education.length
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      error: 'Failed to process resume',
      message: error.message
    });
  }
});

router.get('/context/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessionData.get(sessionId);

  if (!session || !session.resume) {
    return res.status(404).json({ error: 'Session or resume not found' });
  }

  res.json({
    success: true,
    data: session.resume
  });
});

export { sessionData };
export default router;
