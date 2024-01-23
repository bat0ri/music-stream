import grpc
from concurrent import futures
from generated import hello_pb2_grpc, hello_pb2


class Greeter(hello_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        print(request.name)
        return hello_pb2.HelloReply(message=f"Hello, {request.name}!")


def serve():
    port = "9090"
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    hello_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
    server.add_insecure_port("[::]:" + port)
    server.start()
    print("Server started, listening on " + port)
    server.wait_for_termination()


