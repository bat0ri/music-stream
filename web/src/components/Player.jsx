import React, { useContext, useRef, useState } from 'react';
import { MusicStreamingClient } from '../generated/musicstream_grpc_web_pb';
import { StreamRequest } from '../generated/musicstream_pb';
import { Context } from '..';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';


const MusicPlayer = () => {

    const {store} = useContext(Context);
    const navigate = useNavigate();

  const client = new MusicStreamingClient('http://localhost:8080', null, null);

  const audioContextRef = useRef(new window.AudioContext());
  const bufferQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const isFirstPlayRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isFirstPlayRef.current) {
      isFirstPlayRef.current = false;
      setIsPlaying(true);
      startStreaming();
    } else {
      togglePausePlay();
    }
  };

  const startStreaming = () => {
    const request = new StreamRequest();
    const call = client.streamMusic(request, {});

    call.on('data', async (response) => {
      await handleData(response);
    });

    call.on('end', () => {
      console.log('Stream ended');
    });

    call.on('error', (err) => {
      console.error('Stream error:', err);
      isPlayingRef.current = false;
    });
  };

  const handleData = async (response) => {
    const dataUint = new Uint8Array(response.getAudiochunk());
    try {
      const decodedData = await audioContextRef.current.decodeAudioData(dataUint.buffer);
      bufferQueueRef.current.push(decodedData);
      if (!isPlayingRef.current) {
        playNextBuffer();
      }
    } catch (error) {
      console.error('Error decoding audio data:', error);
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

  const togglePausePlay = () => {
    if (isPlaying) {
      audioContextRef.current.suspend();
      setIsPlaying(false);
    } else {
      audioContextRef.current.resume();
      setIsPlaying(true);
      if (!isPlayingRef.current) {
        playNextBuffer();
      }
    }
  };

  const handleLogout = async () => {
    try {
        store.logout();
        navigate('/login');
    } catch (e) {
        console.log(e);
    }
};

  return (
    <div>
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        <div className="mt-4 text-center">
            <button onClick={handleLogout} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                Выйти
                </button>
        </div>
    </div>
  );
};

export default observer(MusicPlayer);
