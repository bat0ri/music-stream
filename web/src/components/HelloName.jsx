import React, { useState } from 'react';
import { GreeterClient } from '../proto/hello_grpc_web_pb';
import { HelloRequest } from '../proto/hello_pb';

const GrpcComponent = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const client = new GreeterClient('http://localhost:8080', null, null);
  const request = new HelloRequest();
  request.setName('World');

  const handleSayHello = async () => {
    setLoading(true);

    try {
        client.sayHello(request, {}, (err, response) => {
            if (err) {
              console.log(`Unexpected error for sayHello: code = ${err.code}` +
                          `, message = "${err.message}"`);
            } else {
                const mes = response.getMessage();
                console.log(mes);
                setMessage(mes);
            }
          });
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSayHello} disabled={loading}>
        Say Hello
      </button>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default GrpcComponent;

