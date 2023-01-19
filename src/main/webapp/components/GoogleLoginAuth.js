import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

function GoogleAuth() {
    return (
        <div>
            <GoogleOAuthProvider clientId={component.clientId} >
            <GoogleLogin 
                onSuccess={credentialResponse => {
                    this.props.onSuccess(credentialResponse)
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