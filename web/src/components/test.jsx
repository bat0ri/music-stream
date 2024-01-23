import React, { useState, useEffect, useRef } from 'react';
import { MusicStreamingClient } from '../generated/musicstream_grpc_web_pb';
import { StreamRequest } from '../generated/musicstream_pb';

const MusicPlayer = () => {
  const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());
  const bufferRef = useRef(null);
  const [isPlaying, setPlaying] = useState(false);

  const handleData = async (data) => {
    try {
      const uint8Array = new Uint8Array(data);
      const audioBuffer = await audioContextRef.current.decodeAudioData(uint8Array.buffer);
      bufferRef.current = audioBuffer;
      setPlaying(true);
    } catch (error) {
      console.error('Error decoding audio data:', error);
    }
  };

  const handleButtonClick = () => {
    const client = new MusicStreamingClient('http://localhost:8080', null, null);
    const request = new StreamRequest();
    const call = client.streamMusic(request, {});

    call.on('data', (response) => handleData(response.getAudiochunk()));

    call.on('end', () => {
      console.log('Stream is done');
      setPlaying(false); // Завершаем воспроизведение после завершения потока
    });

    call.on('error', (error) => {
      console.error('Error streaming music:', error);
    });
  };

  useEffect(() => {
    // Создаем источник аудио после буферизации
    if (isPlaying && bufferRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = bufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start();
    }
  }, [isPlaying]);

  return (
    <div>
      <button onClick={handleButtonClick} disabled={isPlaying}>
        {isPlaying ? 'Playing...' : 'Go stream'}
      </button>
      {isPlaying && (
        <audio controls autoPlay>
          <source src="data:audio/wav;base64,..." type="audio/wav" /> {/* Добавь правильный MIME-тип и данные */}
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default MusicPlayer;
