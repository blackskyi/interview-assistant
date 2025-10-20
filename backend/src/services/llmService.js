import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export async function generateAnswer(question, resumeContext, jobContext) {
  try {
    console.log('Generating answer for question:', question);

    const prompt = buildPrompt(question, resumeContext, jobContext);

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const answer = message.content[0].text;
    console.log('Generated answer length:', answer.length);

    return {
      answer,
      questionType: detectQuestionType(question),
      usedContext: {
        hasResume: !!resumeContext,
        hasJobDescription: !!jobContext
      }
    };
  } catch (error) {
    console.error('LLM service error:', error);
    throw new Error(`Failed to generate answer: ${error.message}`);
  }
}

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
