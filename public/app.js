class VoiceAgent {
  constructor() {
    this.ws = null;
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.isSpeaking = false;

    this.startBtn = document.getElementById('startBtn');
    this.status = document.getElementById('status');

    this.startBtn.addEventListener('click', () => this.toggleListening());
    this.setupSpeechRecognition();
    this.connectWebSocket();
  }

  setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
    } else {
      this.updateStatus('Speech recognition not supported');
      return;
    }

    this.recognition.continuous = true; // Listen continuously
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.updateStatus('Listening...');
      this.isListening = true;
      this.startBtn.className = 'recording';
    };

    this.recognition.onresult = (event) => {
  const text = event.results[event.results.length - 1][0].transcript.trim();
  if (!text) return;

  console.log('Recognized:', text);
  
  // If AI is speaking, stop it immediately
  if (this.isSpeaking) {
    this.synthesis.cancel();
    this.isSpeaking = false;
    this.updateStatus('Listening...');
  }

  // Send user speech to server
  if (this.ws && this.ws.readyState === WebSocket.OPEN) {
    this.ws.send(JSON.stringify({ type: 'text', text }));
  }
};


    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.updateStatus('Speech recognition failed: ' + event.error);
    };

    this.recognition.onend = () => {
  // Restart recognition only if it’s listening and not speaking
  if (!this.isSpeaking && this.isListening) {
    try {
      this.recognition.start();
    } catch (e) {
      console.log('Recognition already started, skipping restart.');
    }
  }
};
  }

  connectWebSocket() {
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onopen = () => {
      console.log('Connected to server');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'response') {
        this.speak(data.text);
      } else if (data.type === 'error') {
        this.updateStatus('Error: ' + data.message);
      }
    };

    this.ws.onerror = () => {
      this.updateStatus('Connection failed');
    };
  }

  toggleListening() {
    if (!this.isListening) {
      this.startListening();
    } else {
      this.stopListening();
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) this.recognition.stop();
    this.updateStatus('Stopped');
    this.startBtn.className = 'idle';
  }

 speak(text) {
  if (!text) return;

  this.isSpeaking = true;
  this.synthesis.cancel(); // ensure previous speech is stopped

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onstart = () => this.updateStatus('AI Speaking...');
  utterance.onend = () => {
    this.isSpeaking = false;
    this.updateStatus('Listening...');
    // recognition will keep running automatically
  };
  this.synthesis.speak(utterance);
}


  updateStatus(message) {
    this.status.textContent = message;
  }
}

new VoiceAgent();
