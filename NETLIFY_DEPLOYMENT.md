# Netlify Deployment Guide

## Overview

This guide will help you deploy the Interview Assistant app to Netlify with serverless functions.

## Prerequisites

1. **Netlify Account** - Sign up at https://netlify.com
2. **GitHub Account** - Push your code to GitHub
3. **API Keys**:
   - OpenAI API Key: https://platform.openai.com/api-keys
   - Anthropic API Key: https://console.anthropic.com/

## Deployment Steps

### Option 1: Deploy via Netlify CLI (Recommended)

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Login to Netlify

```bash
netlify login
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Set Environment Variables

```bash
netlify env:set OPENAI_API_KEY "your-openai-api-key"
netlify env:set ANTHROPIC_API_KEY "your-anthropic-api-key"
```

#### 5. Deploy

```bash
netlify deploy --prod
```

The CLI will guide you through:
- Create a new site or link existing
- Confirm build settings
- Deploy!

Your site will be live at: `https://your-site-name.netlify.app`

---

### Option 2: Deploy via Netlify Dashboard

#### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/interview-assistant.git
git push -u origin main
```

#### 2. Connect to Netlify

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize
4. Select your repository

#### 3. Configure Build Settings

Netlify should auto-detect settings, but verify:

- **Build command**: `cd frontend && npm install && npm run build`
- **Publish directory**: `frontend/dist`
- **Functions directory**: `netlify/functions`

#### 4. Add Environment Variables

In Netlify Dashboard:
1. Go to Site settings → Environment variables
2. Add variables:
   - `OPENAI_API_KEY` = your OpenAI key
   - `ANTHROPIC_API_KEY` = your Anthropic key

#### 5. Deploy

Click "Deploy site"

Your site will be live at: `https://random-name.netlify.app`

You can change the site name in: Site settings → Site details → Change site name

---

## Testing Your Deployment

1. Visit your Netlify URL
2. Upload a resume (PDF)
3. Add a job description
4. Click the microphone and ask a question
5. Verify you get a transcribed question and AI answer

## Troubleshooting

### Function Errors

Check function logs:
```bash
netlify functions:log
```

Or in dashboard: Functions → Function logs

### Common Issues

**"Failed to transcribe audio"**
- Check OPENAI_API_KEY is set correctly
- Verify API key has credits

**"Failed to generate answer"**
- Check ANTHROPIC_API_KEY is set correctly
- Verify API key is active

**Build fails**
- Check build logs in Netlify dashboard
- Ensure all dependencies are in package.json

**Microphone not working**
- Netlify provides HTTPS by default (required for microphone access)
- Check browser permissions

### View Logs

```bash
# Real-time logs
netlify dev

# Function logs
netlify functions:log answer-generate
```

## Local Testing with Netlify Dev

Test serverless functions locally:

```bash
# Install dependencies
npm install

# Start Netlify dev server
netlify dev
```

This runs your site at `http://localhost:8888` with functions working locally.

## Important Notes

### Session Storage Limitation

⚠️ **WARNING**: The current implementation uses in-memory storage which means:
- Sessions are NOT persisted across function invocations
- Each function call is stateless on Netlify
- Resume/job data may not be available for answer generation

### Solutions for Production

**Option 1: Use External Storage (Recommended)**

Add a database like:
- **Supabase** (PostgreSQL) - Free tier available
- **MongoDB Atlas** - Free tier available
- **FaunaDB** - Serverless database

**Option 2: Use Client-Side Storage**

Modify frontend to:
1. Store resume/job context in browser localStorage
2. Send full context with each answer request
3. No server-side session needed

**Quick Fix for Demo:**

Modify `frontend/src/components/VoiceRecorder.jsx` to send context directly:

```javascript
// Store context in component state and send with each request
const answerResponse = await axios.post('/api/answer/generate', {
  sessionId,
  question: transcribedText,
  resumeContext: localStorage.getItem('resumeContext'),
  jobContext: localStorage.getItem('jobContext')
});
```

## Cost Estimates

**Netlify**:
- Free tier: 100GB bandwidth, 300 build minutes/month
- Functions: 125K requests/month free

**OpenAI Whisper**:
- ~$0.006 per minute of audio

**Anthropic Claude**:
- ~$0.01-0.03 per answer

**Total per user session**: ~$0.05-0.10

## Custom Domain

To add a custom domain:

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration steps

## Environment Variables Reference

Required environment variables:

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Support

- Netlify Docs: https://docs.netlify.com/
- Netlify Support: https://answers.netlify.com/

## Next Steps

1. **Add Database**: Implement Supabase or MongoDB for session persistence
2. **Add Analytics**: Track usage with Netlify Analytics
3. **Add Auth**: Implement user authentication
4. **Optimize**: Add caching and rate limiting
5. **Monitor**: Set up error tracking (Sentry)

---

**Your app is now live on Netlify!** 🎉
