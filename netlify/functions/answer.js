const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Shared session storage
const sessions = new Map();

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { sessionId, question } = JSON.parse(event.body);

    if (!question) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Question is required' })
      };
    }

    console.log('Generating answer for question:', question);

    // Get session context if available
    let resumeContext = null;
    let jobContext = null;

    if (sessionId && sessions.has(sessionId)) {
      const session = sessions.get(sessionId);
      resumeContext = session.resume || null;
      jobContext = session.job || null;
    }

    // Build prompt
    const prompt = buildPrompt(question, resumeContext, jobContext);

    // Generate answer using Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const answer = message.content[0].text;
    const questionType = detectQuestionType(question);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        question,
        answer,
        questionType,
        usedContext: {
          hasResume: !!resumeContext,
          hasJobDescription: !!jobContext
        },
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Answer generation error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to generate answer',
        message: error.message
      })
    };
  }
};

function buildPrompt(question, resumeContext, jobContext) {
  let prompt = `You are an interview preparation assistant helping a candidate answer interview questions effectively.

`;

  if (resumeContext) {
    prompt += `CANDIDATE'S RESUME INFORMATION:
${formatResumeContext(resumeContext)}

`;
  }

  if (jobContext) {
    prompt += `JOB DESCRIPTION:
${jobContext.description || jobContext}

`;
  }

  prompt += `INTERVIEW QUESTION:
"${question}"

Please provide a clear, concise, and professional answer to this interview question. The answer should:
1. Be conversational and natural (as if spoken in an interview)
2. Use the STAR method (Situation, Task, Action, Result) when describing experiences
3. Relate to the candidate's background when relevant
4. Address the job requirements when applicable
5. Be between 30-90 seconds when spoken (approximately 75-200 words)
6. Sound authentic and avoid being overly rehearsed

Provide ONLY the answer text without any meta-commentary or labels.`;

  return prompt;
}

function formatResumeContext(resumeContext) {
  let formatted = '';

  if (resumeContext.summary) {
    formatted += `Summary: ${resumeContext.summary}\n\n`;
  }

  if (resumeContext.skills && resumeContext.skills.length > 0) {
    formatted += `Skills: ${resumeContext.skills.slice(0, 20).join(', ')}\n\n`;
  }

  if (resumeContext.experience && resumeContext.experience.length > 0) {
    formatted += `Experience:\n${resumeContext.experience.slice(0, 3).join('\n')}\n\n`;
  }

  if (resumeContext.education && resumeContext.education.length > 0) {
    formatted += `Education:\n${resumeContext.education.slice(0, 2).join('\n')}`;
  }

  return formatted;
}

function detectQuestionType(question) {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('tell me about yourself') || lowerQuestion.includes('introduce yourself')) {
    return 'introduction';
  } else if (lowerQuestion.includes('weakness') || lowerQuestion.includes('strengths')) {
    return 'self-assessment';
  } else if (lowerQuestion.includes('why') && (lowerQuestion.includes('company') || lowerQuestion.includes('role'))) {
    return 'motivation';
  } else if (lowerQuestion.includes('describe a time') || lowerQuestion.includes('tell me about a time')) {
    return 'behavioral';
  } else if (lowerQuestion.includes('technical') || lowerQuestion.includes('how would you')) {
    return 'technical';
  }

  return 'general';
}
