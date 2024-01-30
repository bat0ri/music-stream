import { gql } from "@apollo/client";


export const CREATE_USER = gql`
  mutation RegisterUser($email: String!, $password: String!) {
    register(data: { email: $email, password: $password })
  }
`;