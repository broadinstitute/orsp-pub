import { Component, useEffect, useState } from "react";

function GoogleLoginAuth() {

    function onSuccess(response) {
        this.props.onSuccess(response.credential);
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
          client_id: component.client_id,
          callback: onSuccess
        });
    
        google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          { theme: "outline", size: "large" }
        )
      }, [])

      return (
        <div id="signInDiv"></div>
      )

}

export default GoogleLoginAuth