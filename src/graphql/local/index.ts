import gql from "graphql-tag";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }

  extend type Mutation {
    changeLoggedStatus(status: Boolean!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    isLoggedIn: () => {
      return !!localStorage.getItem("token");
    }
  },
  Mutation: {
    changeLoggedStatus: (_root: any, variables: any, { cache }: any) => {
      const data = { isLoggedIn: variables.status };
      cache.writeData({ data });
      return variables.status;
    }
  }
};

export const CHECK_LOGGED_STATUS = gql`
  query checkIsLoggedIn {
    isLoggedIn @client
  }
`;

export const LOG_IN = gql`
  mutation LogIn($status: Boolean!) {
    changeLoggedStatus(status: $status) @client
  }
`;
