import grpc
from generated import musicstream_pb2, musicstream_pb2_grpc

def stream_music():
    channel = grpc.insecure_channel('localhost:9090')
    stub = musicstream_pb2_grpc.MusicStreamingStub(channel)

    response = stub.StreamMusic(musicstream_pb2.StreamRequest())

    for chunk in response:
        # Здесь вы можете обрабатывать полученные аудиоданные, например, воспроизводить их или сохранять в файл
        print(f"Received chunk with {len(chunk.audioChunk)} bytes.")

if __name__ == '__main__':
    stream_music()
