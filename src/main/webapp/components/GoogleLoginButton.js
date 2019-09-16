import React, { Component } from 'react';
import { h, hh } from 'react-hyperscript-helpers';
import GoogleLogin from 'react-google-login';
import { Storage } from '../util/Storage'

const GoogleLoginButton = hh(class GoogleLoginButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      googleButton: null,
    };
    this.onSuccess = this.onSuccess.bind(this);
  }

  componentDidMount() {
    this.getGoogleConfig();
  }

  async getGoogleConfig() {
    const googleButton = await h(GoogleLogin, {
      clientId: this.props.clientId,
      buttonText: "Sign In",
      onSuccess: this.onSuccess
    });
    this.setState(prev => {
      prev.googleButton = googleButton;
      return prev;
    })
  }
  
  async onSuccess(googleUser) {
    const token = googleUser.getAuthResponse().id_token;
    this.props.onSuccess(token);
  }

  render() {
    return this.state.googleButton;
  }
});
export default GoogleLoginButton;
