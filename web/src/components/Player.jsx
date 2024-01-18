import React, { useState, useEffect } from 'react';
import { MusicStreamingClient } from '../generated/musicstream_grpc_web_pb';
import { StreamRequest, StreamResponse } from '../generated/musicstream_pb';
import ReactPlayer from 'react-player';
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";


function concatenateUint8Arrays(arrays) {
    const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    arrays.forEach((arr) => {
      result.set(arr, offset);
      offset += arr.length;
    });
    return result;
  }
  
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  

  const MusicPlayer = () => {
    const [audioChunks, setAudioChunks] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
  
    const handleButtonClick = () => {
      if (!isStreaming) {
        setIsStreaming(true);
  
        const client = new MusicStreamingClient('http://localhost:8080', null, null);
        const request = new StreamRequest();
  
        const call = client.streamMusic(request, {});
  
        call.on('data', (response) => {
          setAudioChunks((prevChunks) => [...prevChunks, response.getAudiochunk_asU8()]);
        });
  
        call.on('end', () => {
          console.log('Streaming ended');
          setIsStreaming(false);
        });
  
        call.on('error', (error) => {
          console.error('Error:', error);
          setIsStreaming(false);
        });
      } else {
        console.log('Streaming is already in progress.');
      }
    };
  
    return (
      <div>
        <button onClick={handleButtonClick} disabled={isStreaming}>
          {isStreaming ? 'Streaming...' : 'Start Streaming'}
        </button>
            <AudioPlayer
            src={`data:audio/mp3;base64,${arrayBufferToBase64(concatenateUint8Arrays(audioChunks))}`}
            autoPlay
            />
      </div>
    );
  };
  

export default MusicPlayer;
