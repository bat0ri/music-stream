import grpc
from concurrent import futures
from generated import musicstream_pb2, musicstream_pb2_grpc
from pydub import AudioSegment



class MusicStreamingServicer(musicstream_pb2_grpc.MusicStreamingServicer):
    def StreamMusic(self, request, context):
        with open('aws/TRIVIATTA.mp3', 'rb') as audio_file:
            chunk_size = 10*4096
            while True:
                chunk = audio_file.read(chunk_size)
                if not chunk:
                    break
                yield musicstream_pb2.StreamResponse(audioChunk=chunk)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    musicstream_pb2_grpc.add_MusicStreamingServicer_to_server(MusicStreamingServicer(), server)
    server.add_insecure_port('[::]:9090')
    print("Server started. Listening on port 9090...")
    server.start()
    server.wait_for_termination()



if __name__ == '__main__':
    serve()
