import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";

function GoogleAuth() {
    return (
        <>
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
        </>
    )
}

export default GoogleAuth