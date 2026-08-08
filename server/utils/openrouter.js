

/**
 * Call OpenRouter Chat Completion API and return the raw content string.
 * @param {Array<Object>} messages - Array of {role, content} messages.
 * @param {Object} options - Optional parameters like temperature, maxTokens.
 * @returns {Promise<string>} The assistant's response content.
 */
async function callOpenRouter(messages, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = options.model || process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';

  if (!apiKey) {
    throw new Error('Invalid OpenRouter API key. Please set OPENROUTER_API_KEY in .env');
  }

  const payload = {
    model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 1024,
  };

  console.log(`4. About to call OpenRouter API with model: ${model}`);
  // Abort after 30 seconds
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
    console.error(`❌ OpenRouter request for model ${model} timed out after 30s`);
  }, 30000);

  let response;
  try {
    response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error(`OpenRouter request for ${model} aborted due to timeout`);
    }
    throw new Error(`Network error connecting to OpenRouter API for ${model}. Please check your internet connection.`);
  }
  clearTimeout(timeout);
  console.log(`5. OpenRouter responded for model ${model} with status`, response.status);

  if (!response.ok) {
    const errBody = await response.text();
    const status = response.status;
    if (status === 401) {
      throw new Error('Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY environment variable.');
    }
    if (status === 429) {
      throw new Error(`Rate limit exceeded for model ${model}.`);
    }
    if (status === 403 || status === 402) {
      throw new Error('OpenRouter quota exceeded. Please try again later or upgrade your plan.');
    }
    if (status === 404) {
      throw new Error(`The configured OpenRouter model ${model} is unsupported or deprecated.`);
    }
    throw new Error(`OpenRouter API error for ${model}: ${status} ${response.statusText} - ${errBody}`);
  }

  const data = await response.json();
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error(`OpenRouter returned an unexpected response format for model ${model}.`);
  }
  return data.choices[0].message.content;
}

/**
 * Get list of models to try in fallback order.
 */
const getOpenRouterModelList = () => {
  const list = [];
  if (process.env.OPENROUTER_MODEL) {
    list.push(process.env.OPENROUTER_MODEL.trim());
  }
  const fallbacks = [
    'google/gemini-2.5-flash',
    'meta-llama/llama-3.1-8b-instruct',
    'openai/gpt-oss-20b:free'
  ];
  fallbacks.forEach(m => {
    if (!list.includes(m)) {
      list.push(m);
    }
  });
  return list;
};

/**
 * Compatibility wrapper that mimics the previous generateContentWithFallback signature.
 * @param {*} _unusedAi - kept for backward‑compatible signature.
 * @param {Object} options - { contents: string, config: { temperature?, responseMimeType? } }
 * @returns {Promise<{ text: string }>}
 */
async function generateContentWithFallback(_unusedAi, options) {
  const prompt = options.contents || '';
  const config = options.config || {};
  const messages = [{ role: 'system', content: prompt }];
  
  const models = getOpenRouterModelList();
  let lastError = null;

  for (const model of models) {
    try {
      const content = await callOpenRouter(messages, {
        model,
        temperature: config.temperature,
        maxTokens: config.max_output_tokens
      });
      return { text: content };
    } catch (error) {
      console.warn(`⚠️ OpenRouter model ${model} failed:`, error.message);
      lastError = error;
      if (error.message.includes('Invalid OpenRouter API key') || error.message.includes('quota exceeded')) {
        throw error;
      }
    }
  }

  throw lastError || new Error('All OpenRouter models failed to generate content.');
}

module.exports = { generateContentWithFallback, callOpenRouter, getOpenRouterModelList };

