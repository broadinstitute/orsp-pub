import { Component } from "react";

const GoogleLoginAuth = hh( class GoogleLoginAuth extends Component {

    onSuccess = (response) => {
        this.props.onSuccess(response.credential);
    }

    componentDidMount = (() => {
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

    render() {
        return (
            <div id="signInDiv"></div>
        )
    }

})

export default GoogleLoginAuth