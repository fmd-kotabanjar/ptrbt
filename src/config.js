// Configuration settings for the application
module.exports = {
  // Server configuration
  PORT: process.env.PORT || 3000,
  
  // API Keys
  FONNTE_API_KEY: process.env.FONNTE_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  
  // Bot configuration
  MAX_HISTORY_LENGTH: parseInt(process.env.MAX_HISTORY_LENGTH || '10'),
  MAX_OUTPUT_TOKENS: parseInt(process.env.MAX_OUTPUT_TOKENS || '1000'),
  
  // Fonnte API
  FONNTE_API_URL: 'https://api.fonnte.com/send',
  
  // Gemini configuration
  GEMINI_MODEL: 'gemini-pro',
};
