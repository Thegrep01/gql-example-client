import React, { useState, useEffect } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LoginForm } from "./app/login/Login";
import { RegisterForm } from "./app/register/Register";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql"
});

function ProtectedRoute({ component: Component }: any) {
  const [isLogged, setIsLogged] = useState(true);

  useEffect(() => {
    setIsLogged(!!localStorage.getItem("token"));
  }, []);

  return (
    <Route
      path="/"
      render={routeProps => {
        return isLogged ? <Component {...routeProps} /> : <LoginForm />;
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
