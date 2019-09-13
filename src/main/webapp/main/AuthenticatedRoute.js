import React from "react";
import { Route, Redirect } from "react-router-dom";
import { } from "./";
import { broadUser, isAdmin } from "../util/UserUtils";

const AuthenticatedRoute = ({ component: Component, props: componentProps, rolesAllowed, ...rest }) => {

  const { path, location, computedMatch } = rest;
  
  return (
    <Route
      path={path}
      location={location}
      render={
        props =>
          verifyUser(admin)
            ? <Component {...props} {...componentProps} />
            : !Storage.userIsLogged() ? <Login {...props} {...componentProps} componentRoles={admin} />
              : <Redirect to={'/about'} />
      }
    />
  );
}

const verifyUser = (admin) => {
 if (broadUser()) {
   // if admin role is required, check if user is admin
    return admin ? isAdmin() : true; 
  }
};

export default AuthenticatedRoute;
