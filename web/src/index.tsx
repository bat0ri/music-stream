import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { client } from './http';
import { ApolloProvider } from '@apollo/client';
import AuthStore from './store/store';


const store = new AuthStore();
export const Context = createContext( {
    store,
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Context.Provider value={{ store }}>
        <BrowserRouter>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </BrowserRouter>
    </Context.Provider>
  </React.StrictMode>
);

