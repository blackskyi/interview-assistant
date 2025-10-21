// Shared session storage
const sessions = new Map();

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { sessionId, jobDescription, jobTitle, company } = JSON.parse(event.body);

    if (!sessionId || !jobDescription) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          required: ['sessionId', 'jobDescription']
        })
      };
    }

    // Get or create session
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {});
    }

    // Store job context
    sessions.get(sessionId).job = {
      description: jobDescription,
      title: jobTitle || 'Not specified',
      company: company || 'Not specified',
      addedAt: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Job description added successfully',
        data: {
          sessionId,
          jobTitle: jobTitle || 'Not specified',
          company: company || 'Not specified'
        }
      })
    };
  } catch (error) {
    console.error('Job description error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to add job description',
        message: error.message
      })
    };
  }
};

export { sessions };
