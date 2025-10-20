# Quick Start - Interview Assistant

## You Have 2 Options

### Option 1: Run Locally (For Testing)

**Start Backend:**
```bash
cd backend
npm start
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

**Access:** http://localhost:3000

> **Note:** You need to add API keys to `backend/.env` first

---

### Option 2: Deploy to Netlify (For Production)

**Quick Deploy:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Set API keys
netlify env:set OPENAI_API_KEY "your-openai-key"
netlify env:set ANTHROPIC_API_KEY "your-anthropic-key"

# Deploy
./deploy-netlify.sh
```

**Or use the automated script:**
```bash
./deploy-netlify.sh
```

**Your app will be live at:** `https://your-site.netlify.app`

---

## API Keys Required

Get your API keys:

1. **OpenAI** (for voice-to-text): https://platform.openai.com/api-keys
2. **Anthropic** (for AI answers): https://console.anthropic.com/

---

## How to Use the App

1. **Upload Resume** - Upload your PDF resume
2. **Add Job Description** - Paste the job posting
3. **Ask Questions** - Click mic, speak your question, click to stop
4. **Get Answers** - AI generates personalized interview answers

---

## Files Overview

```
interview-assistant/
├── backend/               # Express server (local development)
├── frontend/              # React app
├── netlify/functions/     # Serverless functions (Netlify)
├── netlify.toml          # Netlify configuration
├── deploy-netlify.sh     # Deployment script
└── NETLIFY_DEPLOYMENT.md # Full deployment guide
```

---

## Support

- **Local Development Issues:** Check `backend/.env` and console logs
- **Netlify Issues:** Check `NETLIFY_DEPLOYMENT.md`
- **Microphone Issues:** Ensure HTTPS (Netlify has this by default)

---

**Ready to deploy?** Run `./deploy-netlify.sh` and follow the prompts!
