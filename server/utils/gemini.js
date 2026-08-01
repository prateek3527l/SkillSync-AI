const { GoogleGenAI } = require('@google/genai');

/**
 * Get list of models to try in fallback order.
 */
const getModelList = () => {
  const list = [];
  if (process.env.GEMINI_MODEL) {
    list.push(process.env.GEMINI_MODEL.trim());
  }
  // Standard fallback models in case the configured one is unsupported or deprecated
  const fallbacks = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  fallbacks.forEach(m => {
    if (!list.includes(m)) {
      list.push(m);
    }
  });
  return list;
};

/**
 * Map API errors to descriptive, user-friendly messages.
 */
const handleGeminiError = (error) => {
  const msg = error.message || '';
  if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid') || msg.includes('invalid api key') || msg.includes('API_KEY')) {
    return new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.');
  }
  if (msg.includes('Quota exceeded') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('429')) {
    return new Error('Gemini API quota exceeded. Please try again later.');
  }
  if (msg.includes('model') && (msg.includes('not found') || msg.includes('not available') || msg.includes('unsupported') || msg.includes('does not exist'))) {
    return new Error('The configured Gemini model is unsupported or deprecated.');
  }
  if (msg.includes('fetch failed') || msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED') || msg.includes('network') || msg.includes('connect')) {
    return new Error('Network error connecting to Gemini API. Please check your internet connection and backend environment.');
  }
  return error;
};

/**
 * Call generateContent with fallback models if the primary model fails.
 */
const generateContentWithFallback = async (ai, options) => {
  const models = getModelList();
  let lastError = null;

  for (const model of models) {
    try {
      console.log(`🤖 Attempting content generation with model: ${model}`);
      const response = await ai.models.generateContent({
        ...options,
        model: model,
      });
      return response;
    } catch (error) {
      console.warn(`⚠️ Model ${model} failed:`, error.message);
      lastError = handleGeminiError(error);
      // If it's an invalid API key, fail fast
      if (lastError.message.includes('Invalid Gemini API key')) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error('All Gemini models failed to generate content.');
};

module.exports = {
  generateContentWithFallback,
  handleGeminiError,
  getModelList
};
