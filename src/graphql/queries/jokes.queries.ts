import gql from "graphql-tag";

export const GET_JOKES = gql`
  query GetAllJokes {
    allJokes {
      id
      joke
      author {
        login
      }
    }
  }
`;
