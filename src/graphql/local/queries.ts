import gql from "graphql-tag";

export const GET_IS_LOGGED = gql`
  query GetIsLogged {
    isLogged @client
  }
`;
