import React, { useRef } from 'react';
import { MusicStreamingClient } from '../generated/musicstream_grpc_web_pb';
import { StreamRequest } from '../generated/musicstream_pb';

const MusicPlayer = () => {
  const client = new MusicStreamingClient('http://localhost:8080', null, null);

  const audioContextRef = useRef(new window.AudioContext());
  const bufferQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  const bufferData = async (data) => {
    const dataUint = new Uint8Array(data);
    const audioBuffer = await audioContextRef.current.decodeAudioData(dataUint.buffer);
    bufferQueueRef.current.push(audioBuffer);

    if (!isPlayingRef.current) {
      playNextBuffer();
    }
  };

  const playNextBuffer = () => {
    if (bufferQueueRef.current.length > 0) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = bufferQueueRef.current.shift();
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

    call.on('data', (response) => bufferData(response.getAudiochunk()));
  };

  const handleButtonClick = () => {
    streamMusic();
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Go</button>
    </div>
  );
};

export default MusicPlayer;
