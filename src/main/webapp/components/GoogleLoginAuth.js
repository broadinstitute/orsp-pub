import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import React, { Component } from "react";

function GoogleAuth(props) {
    return (
        <div>
            <GoogleOAuthProvider clientId={component.clientId} >
            <GoogleLogin 
                onSuccess={response => {
                    props.onSuccess(response.credential)
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