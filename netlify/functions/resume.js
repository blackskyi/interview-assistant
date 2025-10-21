const multipart = require('parse-multipart-data');
const pdf = require('pdf-parse');

// In-memory storage (in production, use a database or cloud storage)
const sessions = new Map();

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const contentType = event.headers['content-type'];
    const boundary = contentType.split('boundary=')[1];
    const parts = multipart.parse(Buffer.from(event.body, 'base64'), boundary);

    // Find the file part
    const filePart = parts.find(part => part.name === 'resume');

    if (!filePart) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file uploaded' })
      };
    }

    // Parse PDF
    const pdfData = await pdf(filePart.data);
    const text = pdfData.text;

    // Extract resume data
    const resumeData = {
      rawText: text,
      skills: extractSkills(text),
      experience: extractExperience(text),
      education: extractEducation(text),
      summary: text.substring(0, 500).replace(/\s+/g, ' ').trim()
    };

    // Generate session ID
    const sessionId = Date.now().toString();

    // Store in session
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {});
    }
    sessions.get(sessionId).resume = resumeData;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        sessionId,
        message: 'Resume uploaded and parsed successfully',
        data: {
          skills: resumeData.skills.slice(0, 10),
          experienceCount: resumeData.experience.length,
          educationCount: resumeData.education.length
        }
      })
    };
  } catch (error) {
    console.error('Resume upload error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to process resume',
        message: error.message
      })
    };
  }
};

function extractSkills(text) {
  const skillKeywords = ['skills', 'technical skills', 'technologies', 'proficient in'];
  const lines = text.split('\n');
  const skills = [];
  let inSkillsSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();

    if (skillKeywords.some(keyword => line.includes(keyword))) {
      inSkillsSection = true;
      continue;
    }

    if (inSkillsSection && /^(experience|education|projects|certifications)/i.test(line)) {
      break;
    }

    if (inSkillsSection && line.length > 0) {
      const skillLine = lines[i].split(/[,;|•·]/);
      skills.push(...skillLine.map(s => s.trim()).filter(s => s.length > 0));
    }
  }

  return skills;
}

function extractExperience(text) {
  const experiences = [];
  const lines = text.split('\n');
  const experiencePattern = /\b(software engineer|developer|engineer|intern|analyst|manager|lead|senior|junior)\b/i;

  for (let i = 0; i < lines.length; i++) {
    if (experiencePattern.test(lines[i])) {
      const context = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 5)).join(' ');
      experiences.push(context);
    }
  }

  return experiences;
}

function extractEducation(text) {
  const education = [];
  const degreePattern = /\b(bachelor|master|phd|b\.s\.|m\.s\.|b\.e\.|m\.e\.|b\.tech|m\.tech|diploma|associate)\b/i;
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (degreePattern.test(lines[i])) {
      const context = lines.slice(i, Math.min(lines.length, i + 3)).join(' ');
      education.push(context);
    }
  }

  return education;
}
