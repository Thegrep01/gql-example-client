import React from "react";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import ApolloClient, { InMemoryCache } from "apollo-boost";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LoginForm } from "./app/login/Login";
import { RegisterForm } from "./app/register/Register";

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache
});

function ProtectedRoute({ component: Component }: any) {
  return (
    <Route
      path="/"
      render={routeProps => {
        return !localStorage.getItem("token") ? (
          <LoginForm />
        ) : (
          <Component {...routeProps} />
        );
      }}
    />
  );
}

const Tmp = () => <h1>A</h1>;

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/register" component={RegisterForm} />
          <ProtectedRoute component={Tmp} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default App;
