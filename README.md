# Interview Assistant - Voice-Enabled Prototype

A voice-enabled interview preparation app that listens to your interview questions and generates context-aware answers based on your resume and job description.

## Features

- **Resume Upload**: Upload your resume (PDF) for context extraction
- **Job Description Input**: Add job details to tailor answers
- **Voice Recognition**: Ask questions using your voice (Speech-to-Text via OpenAI Whisper)
- **AI-Powered Answers**: Get intelligent, context-aware answers (via Claude API)
- **Question Type Detection**: Automatically identifies question types (behavioral, technical, etc.)
- **Real-time Processing**: Instant transcription and answer generation

## Tech Stack

### Backend
- Node.js + Express
- OpenAI Whisper API (Speech-to-Text)
- Anthropic Claude API (Answer Generation)
- PDF-Parse (Resume extraction)

### Frontend
- React 18
- Vite
- Web Audio API (Voice recording)
- Axios (HTTP client)

## Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get it here](https://platform.openai.com/api-keys))
- Anthropic API key ([Get it here](https://console.anthropic.com/))

## Installation

### 1. Clone and Install Dependencies

```bash
cd interview-assistant

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
PORT=3001
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key
```

### 3. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```

The backend will run on `http://localhost:3001`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Upload Resume**: Click to upload your PDF resume
2. **Add Job Description**: Paste the job description (optional but recommended)
3. **Record Question**: Click the microphone button and ask your interview question
4. **Get Answer**: Stop recording to get your AI-generated answer

## API Endpoints

### Resume
- `POST /api/resume/upload` - Upload resume PDF
- `GET /api/resume/context/:sessionId` - Get resume context

### Job Description
- `POST /api/job/add` - Add job description
- `GET /api/job/context/:sessionId` - Get job context

### Speech-to-Text
- `POST /api/speech/transcribe` - Transcribe audio to text

### Answer Generation
- `POST /api/answer/generate` - Generate interview answer

## Project Structure

```
interview-assistant/
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   └── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
└── README.md
```

## Key Components

### Backend Services

**pdfParser.js** - Extracts skills, experience, and education from resume
**speechToText.js** - Converts voice to text using Whisper API
**llmService.js** - Generates context-aware answers using Claude

### Frontend Components

**ResumeUploader.jsx** - File upload interface
**JobDescriptionInput.jsx** - Job details form
**VoiceRecorder.jsx** - Audio recording and transcription
**AnswerDisplay.jsx** - Answer presentation with context info

## Browser Compatibility

The app requires:
- Modern browser with MediaRecorder API support
- Microphone access permission
- HTTPS (or localhost for development)

## Development Features

- Hot reload in development mode
- Automatic API proxying (frontend → backend)
- In-memory session storage (no database required)

## Production Considerations

For production deployment, consider:

1. **Database**: Replace in-memory storage with PostgreSQL/MongoDB
2. **File Storage**: Use AWS S3 or similar for resume files
3. **Authentication**: Add user authentication and session management
4. **Rate Limiting**: Implement API rate limiting
5. **Error Handling**: Enhanced error tracking and logging
6. **HTTPS**: Ensure HTTPS for microphone access
7. **Caching**: Add Redis for session caching
8. **Vector Database**: Use Pinecone/Weaviate for better context retrieval

## Troubleshooting

**Microphone not working:**
- Check browser permissions
- Ensure you're using HTTPS or localhost
- Try a different browser

**API errors:**
- Verify your API keys in `.env`
- Check API key quotas and billing
- Review backend console logs

**Poor transcription quality:**
- Speak clearly and at normal pace
- Reduce background noise
- Ensure good microphone quality

## Future Enhancements

- [ ] Job link scraping
- [ ] Multiple interview sessions
- [ ] Answer history and analytics
- [ ] Follow-up question suggestions
- [ ] Video recording mode
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Industry-specific question banks

## License

MIT

## Support

For issues and questions, please check the console logs and ensure all API keys are configured correctly.
