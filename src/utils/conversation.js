const config = require('../config');

// In-memory storage for conversations
// In a production environment, consider using a database
const conversations = {};

/**
 * Save a message to the conversation history
 * @param {string} sender - Sender's phone number
 * @param {object} message - Message object (role, parts)
 * @param {boolean} reset - Whether to reset the conversation
 */
function saveMessage(sender, message, reset = false) {
  // Reset conversation if requested
  if (reset) {
    conversations[sender] = [];
    return;
  }
  
  // Initialize conversation if it doesn't exist
  if (!conversations[sender]) {
    conversations[sender] = [];
  }
  
  // Add message to conversation
  if (message && Object.keys(message).length > 0) {
    conversations[sender].push(message);
  }
  
  // Limit conversation history
  if (conversations[sender].length > config.MAX_HISTORY_LENGTH) {
    conversations[sender] = conversations[sender].slice(-config.MAX_HISTORY_LENGTH);
  }
}

/**
 * Get conversation history for a sender
 * @param {string} sender - Sender's phone number
 * @returns {Array} - Conversation history
 */
function getConversationHistory(sender) {
  return conversations[sender] || [];
}

module.exports = {
  saveMessage,
  getConversationHistory,
};
