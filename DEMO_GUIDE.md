# Demo Guide - Interview Assistant

## Quick Start Demo

### 1. Get Your API Keys

**OpenAI API Key** (for Speech-to-Text):
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-`)

**Anthropic Claude API Key** (for Answer Generation):
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=3001
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd interview-assistant/backend
npm start
```

You should see:
```
🚀 Server running on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd interview-assistant/frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜ Local: http://localhost:3000/
```

### 4. Open the App

Open your browser and go to: **http://localhost:3000**

## Demo Workflow

### Step 1: Upload Resume

1. Click the file upload area
2. Select a PDF resume
3. Click "Upload Resume"
4. Wait for success message: "✓ Resume uploaded successfully"

**What happens:**
- PDF is parsed to extract skills, experience, and education
- Session ID is created
- Context is stored for answer generation

### Step 2: Add Job Description

1. (Optional) Enter job title and company
2. Paste the job description
3. Click "Add Job Description"
4. Wait for success message: "✓ Job description added"

**What happens:**
- Job description is stored in session
- Will be used to tailor answers to the role

### Step 3: Ask Questions with Voice

1. **Click the microphone button** to start recording
2. **Speak your question clearly** (e.g., "Tell me about yourself")
3. **Click again to stop** recording
4. Wait for processing (transcription + answer generation)
5. View your transcribed question and AI-generated answer

**Example Questions to Try:**

**Introduction:**
- "Tell me about yourself"
- "Walk me through your resume"

**Behavioral:**
- "Tell me about a time you faced a difficult challenge"
- "Describe a situation where you worked in a team"
- "Give me an example of when you showed leadership"

**Technical:**
- "What programming languages are you proficient in?"
- "Explain your experience with [technology from resume]"

**Motivation:**
- "Why do you want to work here?"
- "Why are you interested in this role?"

**Self-Assessment:**
- "What are your strengths?"
- "What is your biggest weakness?"

## Expected Results

### Transcription
You'll see your spoken question displayed exactly as transcribed:
```
Your Question:
Tell me about yourself
```

### Generated Answer
The AI will provide a context-aware answer that:
- References your resume details
- Aligns with the job description
- Uses the STAR method for behavioral questions
- Is conversational (30-90 seconds when spoken)
- Sounds natural and authentic

### Context Indicators
The answer will show which context was used:
- ✓ Resume data
- ✓ Job description

## Testing Tips

### For Best Voice Recognition:
1. **Speak clearly** at normal pace
2. **Reduce background noise**
3. **Use a good microphone** (laptop mic usually works)
4. **Wait 1-2 seconds** after asking before stopping

### For Best Answers:
1. **Upload a detailed resume** with skills and experiences
2. **Add a comprehensive job description**
3. **Ask complete questions** (not fragments)
4. **Try different question types** to see varied responses

## Common Issues & Solutions

### Microphone Not Working
**Problem:** "Failed to access microphone"
**Solution:**
- Check browser permissions (should show popup)
- Make sure you're using localhost or HTTPS
- Try Chrome/Firefox/Safari
- Restart browser if needed

### API Errors
**Problem:** "Failed to transcribe audio" or "Failed to generate answer"
**Solution:**
- Verify API keys in `backend/.env`
- Check API key quotas:
  - OpenAI: https://platform.openai.com/usage
  - Anthropic: https://console.anthropic.com/
- Ensure billing is set up if required
- Check backend console for detailed errors

### Recording Too Short
**Problem:** "Recording too short"
**Solution:**
- Speak for at least 2-3 seconds
- Make sure microphone is capturing audio
- Check system audio settings

### Poor Transcription Quality
**Problem:** Wrong words transcribed
**Solution:**
- Speak more clearly
- Reduce background noise
- Get closer to microphone
- Try speaking slower

## Architecture Overview

### Request Flow:

```
1. User clicks record → Browser captures audio
2. User stops → Audio blob created
3. Frontend sends audio → Backend receives
4. Backend → OpenAI Whisper API (transcription)
5. Backend → Claude API (answer generation with context)
6. Backend → Frontend (returns answer)
7. Frontend displays answer
```

### Session Management:

```
Upload Resume → Session ID created
              ↓
Add Job Description → Context stored
              ↓
Ask Questions → Context retrieved for each answer
```

## Sample Demo Script

**"Let me show you the Interview Assistant in action:"**

1. **"First, I'll upload my resume..."** (Upload PDF)
   - "The system extracts my skills, experience, and education"

2. **"Next, I'll add the job description..."** (Paste job details)
   - "This helps tailor answers to the specific role"

3. **"Now I'll ask a question using my voice..."** (Click mic)
   - "Tell me about yourself" (Speak clearly)
   - (Stop recording)

4. **"Watch the system work:"**
   - "First, it transcribes my speech using OpenAI Whisper"
   - "Then, Claude generates a personalized answer using my resume and job context"
   - "The answer is conversational and uses the STAR method"

5. **"Let me try another question..."**
   - "Tell me about a challenging project you worked on"
   - (Show how answer references specific resume details)

## Performance Metrics

**Typical Response Times:**
- Resume parsing: 1-3 seconds
- Speech transcription: 2-5 seconds
- Answer generation: 3-7 seconds
- **Total time per question: 5-12 seconds**

**API Costs (approximate):**
- Whisper transcription: ~$0.006 per minute
- Claude answer generation: ~$0.01-0.03 per answer
- **Cost per question: ~$0.02-0.05**

## Next Steps After Demo

1. **Try with your own resume and job posting**
2. **Practice common interview questions**
3. **Refine answers by regenerating with slight question variations**
4. **Read answers aloud to practice delivery**
5. **Customize wording to match your speaking style**

## Production Deployment Checklist

- [ ] Set up proper database (PostgreSQL/MongoDB)
- [ ] Implement user authentication
- [ ] Add file storage (AWS S3)
- [ ] Set up HTTPS
- [ ] Implement rate limiting
- [ ] Add error tracking (Sentry)
- [ ] Set up monitoring
- [ ] Add unit and integration tests
- [ ] Optimize context retrieval with vector DB
- [ ] Implement session persistence
- [ ] Add user dashboard
- [ ] Create mobile apps (iOS/Android)

## Contact & Support

For issues, suggestions, or contributions, please refer to the main README.md

Happy interviewing! 🎤✨
