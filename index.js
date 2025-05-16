// Load environment variables
require('dotenv').config();
const express = require('express');
const app = express();
const config = require('./src/config');
const { processGeminiResponse } = require('./src/gemini');
const { sendWhatsAppMessage } = require('./src/fonnte');
const { saveMessage, getConversationHistory } = require('./src/utils/conversation');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route for checking if server is running
app.get('/', (req, res) => {
  res.send('WhatsApp Gemini Bot is running!');
});

// GET handler for webhook (helpful for testing)
app.get('/webhook', (req, res) => {
  console.log('GET request received on /webhook');
  res.send('Webhook endpoint is accessible. Use POST for actual webhook data.');
});

// Webhook endpoint for Fonnte
app.post('/webhook', async (req, res) => {
  console.log('Webhook triggered. Request body:', JSON.stringify(req.body));
  
  try {
    // Extract webhook data from Fonnte
    const { device, sender, message, nama } = req.body;
    console.log('Received message:', { device, sender, message });
    
    // Skip if no message content
    if (!message) {
      console.log('No message content found');
      return res.status(200).send('No message to process');
    }
    
    // Handle commands
    if (message.startsWith('/')) {
      const command = message.split(' ')[0].toLowerCase();
      console.log(`Command detected: ${command}`);
      
      if (command === '/reset') {
        // Reset conversation
        saveMessage(sender, [], true);
        await sendWhatsAppMessage(sender, 'Conversation has been reset.');
        console.log(`Reset command processed for ${sender}`);
        return res.status(200).send('Reset command processed');
      }
      
      if (command === '/help') {
        await sendWhatsAppMessage(sender, 'Available commands:\n/reset - Reset conversation history\n/help - Show this help message');
        console.log(`Help command processed for ${sender}`);
        return res.status(200).send('Help command processed');
      }
    }
    
    // Process regular message
    console.log(`Processing message from ${sender}: ${message}`);
    
    // Save user message to conversation history
    saveMessage(sender, { role: 'user', parts: [{ text: message }] });
    
    // Get conversation history
    const history = getConversationHistory(sender);
    console.log(`Retrieved ${history.length} previous messages for context`);
    
    // Get response from Gemini
    console.log('Sending message to Gemini AI...');
    const aiReply = await processGeminiResponse(message, history);
    console.log(`Received response from Gemini: ${aiReply.substring(0, 50)}...`);
    
    // Save AI response to conversation history
    saveMessage(sender, { role: 'model', parts: [{ text: aiReply }] });
    
    // Send response back via Fonnte API
    console.log('Sending response back to user via Fonnte...');
    await sendWhatsAppMessage(sender, aiReply);
    
    console.log('Message processing complete');
    res.status(200).send('Message processed successfully');
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).send(`Error processing message: ${error.message}`);
  }
});

// Catch-all route for 404 errors
app.use((req, res) => {
  console.log(`404 error: ${req.method} ${req.url}`);
  res.status(404).send('Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Server Error');
});

// Start the server
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook URL: ${process.env.BASE_URL || '[your-domain]'}/webhook`);
});
