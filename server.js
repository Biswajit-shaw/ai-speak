const express = require('express');
const { WebSocketServer } = require('ws');
const { createServer } = require('http');
const https = require('https');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static('public'));

// Simple speech-to-text using Web Speech API (client-side)
// Text-to-speech using browser API
wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'text') {
        console.log('Received text:', data.text);
        
        // Call Gemini API
        const response = await callGeminiAPI(data.text);
        
        ws.send(JSON.stringify({
          type: 'response',
          text: response
        }));
      }
    } catch (error) {
      console.error('Error:', error.message);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message || 'Failed to process request'
      }));
    }
  });
});

async function callGeminiAPI(text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{
        parts: [{
          text: text
        }]
      }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log('API Response:', responseData);
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
            return;
          }
          const text = parsed.candidates[0].content.parts[0].text;
          resolve(text);
        } catch (error) {
          console.error('Parse error:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});