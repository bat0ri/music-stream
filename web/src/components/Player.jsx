import React, { useRef, useState } from 'react';
import { MusicStreamingClient } from '../generated/musicstream_grpc_web_pb';
import { StreamRequest } from '../generated/musicstream_pb';

const MusicPlayer = () => {
  const client = new MusicStreamingClient('http://localhost:8080', null, null);

  const audioContextRef = useRef(new window.AudioContext());
  const bufferQueueRef = useRef([]);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const isPlayingRef = useRef(false);

  const [isPaused, setPaused] = useState(false);

  const bufferData = async (data) => {
    const dataUint = new Uint8Array(data);

    // Добавляем данные в очередь буфера
    bufferQueueRef.current.push(dataUint);

    // Если не воспроизводится и не на паузе, начинаем воспроизведение
    if (!isPlayingRef.current && !isPaused) {
      playNextBuffer();
    }
  };

  const playNextBuffer = () => {
    if (bufferQueueRef.current.length > 0) {
      const dataUint = bufferQueueRef.current.shift();

      // Пишем данные в MediaSource SourceBuffer
      sourceBufferRef.current.appendBuffer(dataUint);

      // Устанавливаем состояние воспроизведения
      isPlayingRef.current = true;
    } else {
      isPlayingRef.current = false;
    }
  };

  const handleButtonClick = () => {
    if (!mediaSourceRef.current) {
      // Инициализируем MediaSource и SourceBuffer при первом нажатии
      mediaSourceRef.current = new MediaSource();
      mediaSourceRef.current.addEventListener('sourceopen', handleSourceOpen);
      mediaSourceRef.current.addEventListener('sourceended', handleSourceEnded);
      mediaSourceRef.current.addEventListener('sourceclose', handleSourceClose);

      const audioElement = document.createElement('audio');
      audioElement.src = URL.createObjectURL(mediaSourceRef.current);
      audioElement.controls = true;
      audioElement.autoplay = true;
      document.body.appendChild(audioElement);
    }

    // Начинаем стриминг музыки при нажатии кнопки
    streamMusic();
  };

  const handleSourceOpen = () => {
    // Создаем SourceBuffer при открытии MediaSource
    sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer('audio/mp3');
    sourceBufferRef.current.addEventListener('updateend', () => {
      // Когда SourceBuffer обновлен, начинаем воспроизведение следующего буфера
      playNextBuffer();
    });
  };

  const handleSourceEnded = () => {
    // При окончании потока сигнализируем, что воспроизведение завершено
    isPlayingRef.current = false;
  };

  const handleSourceClose = () => {
    // При закрытии MediaSource, например, при переключении трека, сбрасываем состояние воспроизведения
    isPlayingRef.current = false;
  };

  const handlePauseClick = () => {
    // Переключаем состояние паузы
    setPaused(!isPaused);
  };

  const streamMusic = () => {
    const request = new StreamRequest();
    const call = client.streamMusic(request, {});

    call.on('data', (response) => bufferData(response.getAudiochunk()));
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Go</button>
      <button onClick={handlePauseClick}>{isPaused ? 'Resume' : 'Pause'}</button>
    </div>
  );
};

export default MusicPlayer;
