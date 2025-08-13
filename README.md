# Voice AI Agent

Real-time voice conversation with Gemini AI using WebSocket streaming.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Get Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. Update `.env` file with your API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

4. Start the server:
```bash
npm start
```

5. Open http://localhost:3000 in your browser

## Usage

- Click "Start Conversation" to begin recording
- Speak naturally 
- Click "Stop & Send" when finished speaking
- AI will respond with audio
- Repeat the conversation

## Technical Details

- Frontend captures 16kHz mono PCM audio
- Streams audio chunks every 100ms via WebSocket
- Backend proxies to Gemini Live API
- AI responds with 24kHz PCM audio
- Frontend plays response and waits for next input