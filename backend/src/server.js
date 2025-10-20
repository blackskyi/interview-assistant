import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import resumeRoutes from './routes/resume.js';
import jobRoutes from './routes/job.js';
import speechRoutes from './routes/speech.js';
import answerRoutes from './routes/answer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
export const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/answer', answerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Interview Assistant API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
