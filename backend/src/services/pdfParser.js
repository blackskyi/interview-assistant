import pdf from 'pdf-parse';
import fs from 'fs/promises';

export async function parsePDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);

    // Extract text content
    const text = data.text;

    // Simple parsing logic to extract key sections
    const resumeData = {
      rawText: text,
      skills: extractSkills(text),
      experience: extractExperience(text),
      education: extractEducation(text),
      summary: extractSummary(text)
    };

    return resumeData;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF');
  }
}

function extractSkills(text) {
  const skillKeywords = [
    'skills', 'technical skills', 'technologies', 'proficient in',
    'programming languages', 'tools', 'frameworks'
  ];

  const lines = text.split('\n');
  const skills = [];
  let inSkillsSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();

    // Check if we're entering skills section
    if (skillKeywords.some(keyword => line.includes(keyword))) {
      inSkillsSection = true;
      continue;
    }

    // Check if we're leaving skills section (next major section)
    if (inSkillsSection && /^(experience|education|projects|certifications)/i.test(line)) {
      inSkillsSection = false;
      break;
    }

    if (inSkillsSection && line.length > 0) {
      // Split by common delimiters
      const skillLine = lines[i].split(/[,;|•·]/);
      skills.push(...skillLine.map(s => s.trim()).filter(s => s.length > 0));
    }
  }

  return skills;
}

function extractExperience(text) {
  const experiences = [];
  const lines = text.split('\n');

  // Look for common experience patterns
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

function extractSummary(text) {
  // Get first 500 characters as summary
  const cleanText = text.replace(/\s+/g, ' ').trim();
  return cleanText.substring(0, 500) + (cleanText.length > 500 ? '...' : '');
}
