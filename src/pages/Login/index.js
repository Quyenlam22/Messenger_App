import { useContext, useEffect } from "react";
import { Flex } from 'antd';
import './Login.scss';
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons'
import { signInWithPopup } from "firebase/auth";
import { auth, fbProvider, googleProvider } from "../../firebase/config";
import { AuthContext } from "../../Context/AuthProvider";
import { addDocument } from "../../firebase/services";
import useTitle from "../../hooks/useTitle";
import { AppContext } from "../../Context/AppProvider";

function Login () {
  const user = useContext(AuthContext);
  const { messageApi } = useContext(AppContext);

  const isLogout = localStorage.getItem("logout");

  useEffect(() => {
    if(isLogout === "true"){
      messageApi.open({
        type: 'success',
        content: 'Logout successfully!',
      });
      localStorage.removeItem("logout");
    }
  })
  
  useTitle('Login');

  const handleFBLogin = async () => {
    try {
      const result = await signInWithPopup(auth, fbProvider);
      // localStorage.setItem("loginSuccess", "true");
      localStorage.setItem("isLogin", "true");

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
      // localStorage.setItem("loginSuccess", "true");
      localStorage.setItem("isLogin", "true");

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