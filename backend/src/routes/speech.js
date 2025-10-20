import express from 'express';
import { upload } from '../server.js';
import { transcribeAudio } from '../services/speechToText.js';
import fs from 'fs/promises';

const router = express.Router();

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    console.log('Received audio file:', req.file.originalname, 'Size:', req.file.size, 'bytes');

    // Transcribe the audio
    const result = await transcribeAudio(req.file.path);

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      transcription: result.text,
      duration: result.duration,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      error: 'Failed to transcribe audio',
      message: error.message
    });
  }
});

export default router;
