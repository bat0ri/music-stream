import grpc
from generated import hello_pb2, hello_pb2_grpc

def run_client():
    channel = grpc.insecure_channel('localhost:9090')
    stub = hello_pb2_grpc.GreeterStub(channel)
    response = stub.SayHello(hello_pb2.HelloRequest(name='Python gRPC'))
    print("Greeter client received: " + response.message)

if __name__ == '__main__':
    run_client()
