require('dotenv').config();
const express = require('express');
const app = express();
const config = require('./src/config');
const { processGeminiResponse } = require('./src/gemini');
const { sendWhatsAppMessage } = require('./src/fonnte');
const { saveMessage, getConversationHistory } = require('./src/utils/conversation');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route for checking if server is running
app.get('/', (req, res) => {
  res.send('WhatsApp Gemini Bot is running!');
});

// Webhook endpoint for Fonnte
app.post('/webhook', async (req, res) => {
  try {
    const { device, sender, message, nama } = req.body;
    console.log('Received message:', { device, sender, message });
    
    // Skip if no message content
    if (!message) {
      return res.status(200).send('No message to process');
    }
    
    // Handle commands
    if (message.startsWith('/')) {
      const command = message.split(' ')[0].toLowerCase();
      
      if (command === '/reset') {
        // Reset conversation
        saveMessage(sender, [], true);
        await sendWhatsAppMessage(sender, 'Conversation has been reset.');
        return res.status(200).send('Reset command processed');
      }
      
      if (command === '/help') {
        await sendWhatsAppMessage(sender, 'Available commands:\n/reset - Reset conversation history\n/help - Show this help message');
        return res.status(200).send('Help command processed');
      }
    }
    
    // Save user message to conversation history
    saveMessage(sender, { role: 'user', parts: [{ text: message }] });
    
    // Get conversation history
    const history = getConversationHistory(sender);
    
    // Get response from Gemini
    const aiReply = await processGeminiResponse(message, history);
    
    // Save AI response to conversation history
    saveMessage(sender, { role: 'model', parts: [{ text: aiReply }] });
    
    // Send response back via Fonnte API
    await sendWhatsAppMessage(sender, aiReply);
    
    res.status(200).send('Message processed');
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send('Error processing message');
  }
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
