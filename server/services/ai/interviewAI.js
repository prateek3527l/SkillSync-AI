const { generateContentWithFallback } = require('../../utils/openrouter');

const QUESTION_GENERATION_PROMPT = (interviewType, targetRole, difficulty, count) => `
You are a senior technical interviewer at a top tech company.
Generate exactly ${count} interview questions for a ${difficulty} level ${interviewType} interview for the role of "${targetRole}".

Focus the questions to be realistic, professional, and progressively challenging.
For technical topics, include questions about concepts, practical application, and problem solving.
For HR/Behavioral, use STAR-method applicable scenarios.

Return ONLY a valid JSON array of objects with exactly this structure, no markdown, no explanation:
[
  {
    "questionText": "The full question text here",
    "questionType": "technical" | "behavioral" | "hr",
    "expectedTopics": ["topic1", "topic2"]
  }
]
`;

const ANSWER_EVALUATION_PROMPT = (question, answer, interviewType, difficulty) => `
You are an expert technical interviewer evaluating a candidate's answer.

Interview Type: ${interviewType}
Difficulty: ${difficulty}
Question: "${question}"
Candidate's Answer: "${answer || 'No answer provided'}"

Evaluate the answer and return ONLY a valid JSON object with this exact structure, no markdown:
{
  "technicalScore": <0-100>,
  "communicationScore": <0-100>,
  "confidenceScore": <0-100>,
  "relevanceScore": <0-100>,
  "feedback": "<2-3 sentences of specific feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area 1>", "<area 2>"]
}

Score guidelines:
- technicalScore: Accuracy and depth of technical content (0 if no tech content expected)
- communicationScore: Clarity, structure, and articulation
- confidenceScore: Completeness and assertiveness of the answer
- relevanceScore: How relevant the answer is to the question asked
`;

const SESSION_SUMMARY_PROMPT = (questions, interviewType, targetRole, difficulty) => {
  const qa = questions.map((q, i) =>
    `Q${i+1}: ${q.questionText}\nA: ${q.userAnswer || 'Not answered'}`
  ).join('\n\n');

  return `
You are a career coach reviewing a complete mock interview session.

Interview Type: ${interviewType}
Target Role: ${targetRole}
Difficulty: ${difficulty}

Questions and Answers:
${qa}

Provide an overall session summary. Return ONLY valid JSON with this structure:
{
  "overallFeedback": "<3-4 sentence summary of the interview performance>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "studyTopics": ["<topic 1>", "<topic 2>", "<topic 3>", "<topic 4>"],
  "suggestedImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
}
`;
};

const parseJSONContent = (text) => {
  let jsonStr = text || '';
  if (jsonStr.includes('```')) {
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
  }
  return JSON.parse(jsonStr);
};

/**
 * Generate interview questions
 */
const generateQuestions = async (interviewType, targetRole, difficulty, count) => {
  const response = await generateContentWithFallback(null, {
    contents: QUESTION_GENERATION_PROMPT(interviewType, targetRole, difficulty, count),
    config: { temperature: 0.7, responseMimeType: 'application/json' },
  });

  try {
    return parseJSONContent(response.text);
  } catch {
    throw new Error('AI returned invalid question format');
  }
};

/**
 * Evaluate a single answer
 */
const evaluateAnswer = async (question, answer, interviewType, difficulty) => {
  if (!answer || answer.trim().length < 5) {
    return {
      technicalScore: 0, communicationScore: 0, confidenceScore: 0, relevanceScore: 0,
      feedback: 'No meaningful answer was provided for this question.',
      strengths: [], improvements: ['Provide a detailed answer', 'Practice thinking out loud'],
    };
  }

  const response = await generateContentWithFallback(null, {
    contents: ANSWER_EVALUATION_PROMPT(question, answer, interviewType, difficulty),
    config: { temperature: 0.2, responseMimeType: 'application/json' },
  });

  try {
    return parseJSONContent(response.text);
  } catch {
    throw new Error('AI returned invalid evaluation format');
  }
};

/**
 * Generate overall session summary
 */
const generateSessionSummary = async (questions, interviewType, targetRole, difficulty) => {
  const response = await generateContentWithFallback(null, {
    contents: SESSION_SUMMARY_PROMPT(questions, interviewType, targetRole, difficulty),
    config: { temperature: 0.3, responseMimeType: 'application/json' },
  });

  try {
    return parseJSONContent(response.text);
  } catch (e) {
    throw new Error('AI returned invalid summary format');
  }
};

module.exports = { generateQuestions, evaluateAnswer, generateSessionSummary };
