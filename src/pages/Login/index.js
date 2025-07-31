import { useContext } from "react";
import { Flex } from 'antd';
import './Login.scss';
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons'
import { signInWithPopup } from "firebase/auth";
import { auth, fbProvider, googleProvider } from "../../firebase/config";
import { AuthContext } from "../../Context/AuthProvider";
import { addDocument } from "../../firebase/services";
import useTitle from "../../hooks/useTitle";

function Login () {
  const user = useContext(AuthContext);
  
  useTitle('Login');

  const handleFBLogin = async () => {
    try {
      const result = await signInWithPopup(auth, fbProvider);
      sessionStorage.setItem("loginSuccess", "true");

      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        await addDocument("users", {
          ...result.user.providerData[0],
          ...result.user.metadata
        });
      }
    } catch (error) {
      console.error("FB Login error:", error);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      sessionStorage.setItem("loginSuccess", "true");

      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        await addDocument("users", {
          ...result.user.providerData[0],
          ...result.user.metadata
        });
      }
    } catch (error) {
      console.error("Google Login error:", error);
    }
  };

  return (
    <>
      {!user && (
        <div className="login">
          <Flex className="login__content" justify="center" vertical align="center">
            <h1 className="login__title">Welcome to ChitChat!</h1>
            <h2 className="login__desc">Connect anytime - Chat anywhere.</h2>
            <Flex className="button" vertical gap={12}>
                <button 
                  onClick={handleFBLogin} 
                  size="large" 
                  className="button__facebook"
                >
                  <FacebookOutlined /> Login with Facebook
                </button>
                <button 
                  onClick={handleGoogleLogin} 
                  size="large" 
                  className="button__google"
                >
                  <GoogleOutlined /> Login with Google
                </button>
            </Flex>
          </Flex>
        </div>
      )}
    </>
  )
}

export default Login;