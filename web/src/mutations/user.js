import { gql } from "@apollo/client";


export const CREATE_USER = gql`
  mutation RegisterUser($email: String!, $password: String!) {
    register(data: { email: $email, password: $password })
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      email
      token
    }
  }
`;