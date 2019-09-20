import React, { Component } from 'react';
import { hh } from 'react-hyperscript-helpers';

const GoogleLoginButton = hh(class GoogleLoginButton extends Component {

  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }

  componentDidMount() {
    window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
    }).then(() => {
        window.gapi.signin2.render('signin', {
          onsuccess: this.onSuccess
        })
      }) 
    })    
  }

  onSuccess (googleUser) {
    const token = googleUser.getAuthResponse().id_token;
    this.props.onSuccess(token);
  }

  render() {
    return (<div id="signin"/>);
  }
});

export default GoogleLoginButton;
