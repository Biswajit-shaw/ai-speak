class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.chunkSize = 800; // 50ms at 16kHz
  }

  process(inputs) {
    const samples = inputs[0]?.[0];
    if (!samples) return true;

    for (const s of samples) {
      // Clamp and convert to 16-bit PCM
      this.buffer.push(Math.max(-1, Math.min(1, s)) * 32767 | 0);

      if (this.buffer.length >= this.chunkSize) {
        this.port.postMessage(new Int16Array(this.buffer));
        this.buffer = [];
      }
    }
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
