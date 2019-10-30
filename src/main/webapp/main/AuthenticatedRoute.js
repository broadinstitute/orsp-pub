import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Storage } from '../util/Storage';
import { handleUnauthorized } from '../util/Utils';

const AuthenticatedRoute = ({ component: Component, props: componentProps, admin, ...rest }) => {

  const { path, location } = rest;

  return (
    <Route
      path={path}
      location={location}
      render={
        props =>
          verifyUser(admin, props)
            ? <Component {...props} {...componentProps} />
            : <Redirect to={'/'} />
      }
    />
  );
};

const verifyUser = (admin, props) => {
  let hasAccess = admin ? Storage.getCurrentUser() != null && Storage.getCurrentUser().isAdmin : Storage.userIsLogged();
  if (!hasAccess) {
    Storage.setLocationFrom(props.history.location);
  }
  return hasAccess
};

export default AuthenticatedRoute;
