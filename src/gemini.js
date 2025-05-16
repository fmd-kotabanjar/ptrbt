const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: config.GEMINI_MODEL });

/**
 * Process a message with Gemini AI
 * @param {string} message - User's message
 * @param {Array} history - Conversation history
 * @returns {Promise<string>} - Gemini's response
 */
async function processGeminiResponse(message, history) {
  try {
    // Create a chat instance with history
    const chat = model.startChat({
      history: history.slice(0, -1), // Exclude the most recent user message
      generationConfig: {
        maxOutputTokens: config.MAX_OUTPUT_TOKENS,
      },
    });
    
    // Send the message to Gemini
    const result = await chat.sendMessage(message);
    const response = result.response.text();
    
    return response;
  } catch (error) {
    console.error('Error getting response from Gemini:', error);
    return 'Sorry, I encountered an error processing your request. Please try again later.';
  }
}

module.exports = {
  processGeminiResponse,
};
