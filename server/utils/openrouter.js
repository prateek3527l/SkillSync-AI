

/**
 * Call OpenRouter Chat Completion API and return the raw content string.
 * @param {Array<Object>} messages - Array of {role, content} messages.
 * @param {Object} options - Optional parameters like temperature, maxTokens.
 * @returns {Promise<string>} The assistant's response content.
 */
async function callOpenRouter(messages, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free';

  if (!apiKey) {
    throw new Error('Invalid OpenRouter API key. Please set OPENROUTER_API_KEY in .env');
  }

  const payload = {
    model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 1024,
    // OpenRouter does not have responseMimeType; we keep it for compatibility.
  };

  console.log('4. About to call OpenRouter API');
  // Abort after 30 seconds
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
    console.error('❌ OpenRouter request timed out after 30s');
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
    // Network errors (e.g., DNS, ECONNREFUSED) or abort
    if (err.name === 'AbortError') {
      throw new Error('OpenRouter request aborted due to timeout');
    }
    throw new Error('Network error connecting to OpenRouter API. Please check your internet connection and backend environment.');
  }
  clearTimeout(timeout);
  console.log('5. OpenRouter responded with status', response.status);


  if (!response.ok) {
    const errBody = await response.text();
    const status = response.status;
    if (status === 401) {
      throw new Error('Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY environment variable.');
    }
    if (status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (status === 403 || status === 402) {
      throw new Error('OpenRouter quota exceeded. Please try again later or upgrade your plan.');
    }
    if (status === 404) {
      throw new Error('The configured OpenRouter model is unsupported or deprecated.');
    }
    // Generic fallback
    throw new Error(`OpenRouter API error: ${status} ${response.statusText} - ${errBody}`);
  }

  const data = await response.json();
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('OpenRouter returned an unexpected response format.');
  }
  return data.choices[0].message.content;
}

/**
 * Compatibility wrapper that mimics the previous generateContentWithFallback signature.
 * The original code passed a GoogleGenAI instance (unused) and an options object with
 * a `contents` string and a `config` object. We ignore the AI instance and forward the
 * prompt to OpenRouter.
 * @param {*} _unusedAi - kept for backward‑compatible signature.
 * @param {Object} options - { contents: string, config: { temperature?, responseMimeType? } }
 * @returns {Promise<{ text: string }>}
 */
async function generateContentWithFallback(_unusedAi, options) {
  const prompt = options.contents || '';
  const config = options.config || {};
  const messages = [{ role: 'system', content: prompt }];
  const content = await callOpenRouter(messages, { temperature: config.temperature, maxTokens: config.max_output_tokens });
  return { text: content };
}

module.exports = { generateContentWithFallback, callOpenRouter };
