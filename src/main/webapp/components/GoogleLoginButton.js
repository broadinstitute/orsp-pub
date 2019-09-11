import React, { Component } from 'react';
import { h, hh } from 'react-hyperscript-helpers';
import GoogleLogin from 'react-google-login';

const GoogleLoginButton = hh(class GoogleLoginButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      googleButton: null,
      toDashBoard: false,
      loading: true
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
      onSuccess: this.onSuccess,
      onFailure: this.onFailure
    });

    this.setState(prev => {
      prev.googleButton = googleButton;
      prev.loading = false;
      return prev;
    })
  }


  
  async onSuccess(googleUser) {
    const token = googleUser.getAuthResponse().id_token;
    this.props.onSuccess(token);
  }

  onFailure(googleUser) {    
    console.log("error" + googleUser);
  }

  render() {
    return this.state.googleButton;
  }
});
export default GoogleLoginButton;
