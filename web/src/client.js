const { HelloRequest } = require('./proto/hello_pb');
const { GreeterClient } = require('./proto/hello_grpc_web_pb');

const client = new GreeterClient('http://localhost:8080');

const request = new HelloRequest();
request.setName('World');

client.sayHello(request, {}, (err, response) => {
  if (err) {
    console.error(`Unexpected error for sayHello: code = ${err.code}, message = "${err.message}"`);
  } else {
    console.log(response.getMessage());
  }
});
