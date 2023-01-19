import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import React, { Component } from "react";

function GoogleAuth(props) {
    return (
        <div>
            <GoogleOAuthProvider clientId={component.clientId} >
            <GoogleLogin 
                onSuccess={credentialResponse => {
                    props.onSuccess(credentialResponse)
                  }}
                  onError={(err) => {
                    console.log(err, 'Login Failed');
                  }}
            />
            </GoogleOAuthProvider>
        </div>
    )
}

export default GoogleAuth