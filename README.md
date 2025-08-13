Voice AI Agent
Real-time voice conversation with Gemini AI using WebSocket streaming.

Features
Continuous, real-time voice conversation with AI

Automatic speech-to-text (STT) and text-to-speech (TTS)

16kHz mono PCM audio capture from browser

Streams audio chunks to Gemini API every 50–100ms

AI responds with 24kHz PCM audio played in real-time

Setup
Clone the repository

bash
Copy
Edit
git clone <your-repo-url>
cd <your-repo-folder>
Install dependencies

bash
Copy
Edit
npm install
Get Gemini API key

Obtain your key from Google AI Studio

Create a .env file

ini
Copy
Edit
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
Start the server

bash
Copy
Edit
npm start
Open in browser

arduino
Copy
Edit
http://localhost:3000
Usage
Click "Start Conversation" to begin recording.

Speak naturally; your voice will be streamed to the AI.

AI will respond with audio in real-time.

Click "Stop & Send" to end the current input.

Repeat to continue the conversation.

Technical Details
Frontend:

Captures 16kHz mono PCM audio

Streams audio chunks every 50–100ms via WebSocket

Plays back AI response using browser TTS or PCM audio

Backend:

Node.js + Express + WebSocket server

Proxies audio/text to Gemini API

Receives 24kHz PCM audio from Gemini and sends to frontend

Audio Processor:

Web Audio Worklet handles low-latency audio streaming

Converts float samples to 16-bit PCM

Sends smaller chunks frequently for minimal latency

Notes
Requires modern browsers with Web Speech API support

Continuous conversation mode ensures smooth back-and-forth without pressing buttons repeatedly

Latency depends on network and AI response times