# Fonnte Gemini WhatsApp Bot

A WhatsApp chatbot that integrates Fonnte API with Google's Gemini AI to provide intelligent responses to user messages.

## Features

- Intelligent responses powered by Google Gemini AI
- Conversation history tracking
- Command handling (/help, /reset)
- Easy deployment to Railway or other hosting platforms

## Prerequisites

- Node.js v16+
- Fonnte account with API key
- Google Gemini API key

## Installation

1. Clone the repository:
git clone https://github.com/yourusername/fonnte-gemini-whatsapp-bot.git
cd fonnte-gemini-whatsapp-bot



2. Install dependencies:
npm install



3. Create a `.env` file based on `.env.example`:
cp .env.example .env



4. Add your API keys to the `.env` file.

## Usage

1. Start the server:
npm start



2. Configure your Fonnte webhook to point to your server's URL:
https://your-server-url.com/webhook


Collapse

3. Test by sending a message to your WhatsApp number.

## Deployment to Railway

1. Create a new project on [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Add environment variables (FONNTE_API_KEY, GEMINI_API_KEY)
4. Deploy

## Available Commands

- `/help` - Show help message
- `/reset` - Reset conversation history

## Troubleshooting

- **Webhook not receiving messages**: Ensure your webhook URL is correctly set in Fonnte dashboard
- **No response from bot**: Check your API keys and server logs for errors

## License

MIT
