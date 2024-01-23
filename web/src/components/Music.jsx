const streamSong = () => {
    const stream = client.streamSong();
    const audio = new AudioContext();
    let source = null;
    let startTime = 0;
  
    stream.on('data', (chunk) => {
      if (!source) {
        source = audio.createBufferSource();
        source.connect(audio.destination);
        source.start();
        startTime = audio.currentTime - (chunk.startTimeSeconds || 0);
      }
  
      const buffer = audio.createBuffer(1, chunk.audioChunk.length, audio.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < chunk.audioChunk.length; i++) {
        data[i] = chunk.audioChunk[i] / 128.0 - 1.0;
      }
  
      const audioBuffer = audio.createBufferSource();
      audioBuffer.buffer = buffer;
      audioBuffer.connect(audio.destination);
      audioBuffer.start(startTime + chunk.startTimeSeconds);
    });
  
    stream.on('end', () => {
      console.log('Stream ended');
    });
  
    stream.on('error', (err) => {
      console.error('Stream error:', err);
    });
  };
  