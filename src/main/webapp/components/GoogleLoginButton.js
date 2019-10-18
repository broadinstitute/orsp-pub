import React, { Component, Fragment } from 'react';
import { hh } from 'react-hyperscript-helpers';
import GoogleLogin from 'react-google-login';

const GoogleLoginButton = hh(class GoogleLoginButton extends Component {

  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess (googleUser) {
    const token = googleUser.getAuthResponse().id_token;
    this.props.onSuccess(token);
  }

  forbidden = (response) => {
    Storage.clearStorage();
  };

  render() {
    return (
      <Fragment>
        <GoogleLogin
          id={'signin'}
          className={'googleButton'}
          clientId={component.clientId}
          buttonText="Sign in"
          onSuccess={this.onSuccess}
          onFailure={this.forbidden}
          cookiePolicy={'single_host_origin'}
          scope={'openid email profile'}
        />
      </Fragment>
    );
  }
});

export default GoogleLoginButton;
