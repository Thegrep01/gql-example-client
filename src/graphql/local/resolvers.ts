export const resolvers = {
  Query: {
    isLogged() {
      return !!localStorage.getItem("token");
    }
  }
};
