import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import "./App.css";
// import Users from "./user/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

function App() {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userID/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new">
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userID/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        userID: userId,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div>
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;