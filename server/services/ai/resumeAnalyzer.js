const fs = require('fs');
const pdf = require('pdf-parse');
const { generateContentWithFallback } = require('../../utils/openrouter');

const PROMPT_TEMPLATE = `
You are an expert technical recruiter and senior software engineer. Review the following resume text.
Your goal is to evaluate this resume for a Software Engineering Internship or Junior Developer role.
Focus on: Full-stack development, Backend, React, Node.js, Express, MongoDB, problem solving, projects, and ATS optimization.

Please provide a detailed analysis strictly in the following JSON format. Do not include markdown formatting like \`\`\`json. Just the raw JSON object.

{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "formattingScore": <number 0-100>,
  "grammarScore": <number 0-100>,
  "keywordScore": <number 0-100>,
  "strengths": [<array of 3-5 strings>],
  "weaknesses": [<array of 3-5 strings>],
  "missingSkills": [<array of 3-5 strings>],
  "suggestedImprovements": [<array of 3-5 strings>],
  "rewrittenBulletPoints": [<array of 2-3 strings showing "Before: ... After: ...">],
  "summary": "<string, a 2-3 sentence overall summary>"
}

Resume Text:
`;

/**
 * Extract text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
};

/**
 * Analyze resume text using Gemini
 * @param {string} text - The resume text
 * @returns {Promise<Object>} - The parsed JSON analysis
 */
const analyzeWithGemini = async (text) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const response = await generateContentWithFallback(null, {
    contents: PROMPT_TEMPLATE + text,
    config: {
      temperature: 0.2, // Low temp for more consistent/factual analysis
      responseMimeType: "application/json"
    }
  });

  try {
    const jsonStr = response.text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", response.text);
    throw new Error('AI returned invalid format');
  }
};

module.exports = {
  extractTextFromPDF,
  analyzeWithGemini
};
