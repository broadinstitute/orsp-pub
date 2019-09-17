import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { User } from '../util/ajax';

const AuthenticatedRoute = ({ component: Component, props: componentProps, admin, ...rest }) => {

  const { path, location } = rest;

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

const verifyUser = async (admin) => {
  try {
    let user = await User.getUserSession();
    return admin ? user.isAdmin : true
  } catch (error) {
    return false;
  }
};


export default AuthenticatedRoute;
