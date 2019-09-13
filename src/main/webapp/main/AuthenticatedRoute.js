import React from "react";
import { Route, Redirect } from "react-router-dom";
import { broadUser, isAdmin } from "../util/UserUtils";
import { Storage } from "../util/Storage";

const AuthenticatedRoute = ({ component: Component, props: componentProps, admin, ...rest }) => {

  const { path, location, computedMatch } = rest;
  
  return (
    <Route
      path={path}
      location={location}
      render={
        props =>
          verifyUser(admin)
            ? <Component {...props} {...componentProps} />
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
