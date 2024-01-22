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

    
  
    const handleData = (response) => {
        return new Promise(async (resolve, reject) => {
          const dataUint = new Uint8Array(response.getAudiochunk());
      
          try {
            const decodedData = await audioContextRef.current.decodeAudioData(dataUint.buffer);
            bufferQueueRef.current.push(decodedData);
            if (!isPlayingRef.current) {
              playNextBuffer();
            }
            resolve(); 
          } catch (error) {
            console.error('Error decoding audio data:', error);
            reject(error);
          }
        });
      };
       
      
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

  const handleButtonClick = () => {
    streamMusic();
  };

  const pauseClick = () => {
    audioContextRef.current.suspend();
  };

  const playClick = () => {
    audioContextRef.current.resume();    
    if (!isPlayingRef.current) {
        playNextBuffer();
      }
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