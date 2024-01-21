import React, { useRef } from 'react';
import { MusicStreamingClient } from '../generated/musicstream_grpc_web_pb';
import { StreamRequest } from '../generated/musicstream_pb';



const MusicPlayer = () => {
  const client = new MusicStreamingClient('http://localhost:8080', null, null);

  

  const audioContextRef = useRef(new window.AudioContext());
  const bufferQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  const playNextBuffer = () => {
    if (bufferQueueRef.current.length > 0) {
      const source = audioContextRef.current.createBufferSource();
      const { audioBuffer, data } = bufferQueueRef.current.shift();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = playNextBuffer;
      source.start();
      isPlayingRef.current = true;
    } else {
      isPlayingRef.current = false;
    }
  };

  const streamMusic = () => {
    const request = new StreamRequest();
    const call = client.streamMusic(request, {});

    call.on('data', (response) => {
      const data = response.getAudiochunk();
      const dataUint = new Uint8Array(data);

      audioContextRef.current.decodeAudioData(dataUint.buffer, (audioBuffer) => {
        bufferQueueRef.current.push({ audioBuffer, data });
        
        if (!isPlayingRef.current) {
          playNextBuffer();
        }
      }, (error) => {
        console.error('Error decoding audio data:', error);
      });
    });
  };

  const handleButtonClick = () => {
    streamMusic();
  };


  const pauseClick = () => {
    audioContextRef.current.suspend();
  };

  const playClick = () => {
    audioContextRef.current.resume();
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Go</button>
      <button onClick={pauseClick}>Pause</button>
      <button onClick={playClick}>Play</button>
    </div>
  );
};

export default MusicPlayer;
