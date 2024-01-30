import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat } from '@apollo/client';

const httpLink = new HttpLink({ uri: 'http://127.0.0.1:8000/graphql' });

const authMiddleware = new ApolloLink((operation, forward) => {

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || null,
    }
  }));

  return forward(operation);
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});