const axios = require('axios');
const config = require('./config');

/**
 * Send a message via Fonnte API
 * @param {string} target - Recipient phone number
 * @param {string} message - Message to send
 * @returns {Promise<object>} - API response
 */
async function sendWhatsAppMessage(target, message) {
  try {
    const response = await axios.post(config.FONNTE_API_URL, {
      target: target,
      message: message,
    }, {
      headers: {
        'Authorization': config.FONNTE_API_KEY
      }
    });
    
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message via Fonnte:', error);
    throw error;
  }
}

module.exports = {
  sendWhatsAppMessage,
};
