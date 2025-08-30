import { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Flex } from "antd";
import './Login.scss';
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons'
import { signInWithPopup } from "firebase/auth";
import { auth, fbProvider, googleProvider } from "../../firebase/config";
import { AuthContext } from "../../Context/AuthProvider";
import { addDocument } from "../../firebase/services";
import useTitle from "../../hooks/useTitle";
import { AppContext } from "../../Context/AppProvider";
import { serverTimestamp } from "firebase/firestore";
import { authWithEmail } from "../../utils/authWithEmail";

function Login () {
  const user = useContext(AuthContext);
  const { messageApi } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register"

  const onFinish = async (values) => {
    const { email, password, displayName } = values;
    setLoading(true);
    try {
      await authWithEmail(email, password, mode, displayName);
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Email is already in the system!',
      });
    } finally {
      setLoading(false);
    }
  };

  const isLogout = localStorage.getItem("logout");

  // const userEmail = authWithEmail("levana@gmail.com", "123456");

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
  const handleLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("isLogin", "true");

      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        await addDocument("users", {
          ...result.user.providerData[0],
          ...result.user.metadata,
          state: "online",
          lastSeen: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(`${provider.providerId} Login error:`, error);
    }
  };

  const handleFBLogin = () => handleLogin(fbProvider);
  const handleGoogleLogin = () => handleLogin(googleProvider);


  return (
    <>
      {!user && (
        <div className="login">
          <Flex className="login__content" vertical align="center">
            <h1 className="login__title">Welcome to ChitChat!</h1>
            <h2 className="login__desc">Connect anytime - Chat anywhere.</h2>
            <div style={{height: 300}}>
              <Form layout="vertical" onFinish={onFinish}>
                {mode === "register" && (
                  <Form.Item
                    label="Display Name"
                    name="displayName"
                    rules={[{ required: true, message: "Please enter your name" }]}
                  >
                    <Input placeholder="Enter your name" />
                  </Form.Item>
                )}

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please enter your email" }]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please enter your password" }]}
                >
                  <Input.Password placeholder="Enter your password" />
                </Form.Item>

                {mode === "register" && (
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      { required: true, message: "Please confirm your password" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Passwords do not match!"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm your password" />
                  </Form.Item>
                )}

                <Form.Item style={{display: "flex", justifyContent: "center"}}>
                  <button 
                    htmlType="submit" 
                    className="button__auth"
                    loading={loading} 
                  >
                    {mode === "login" ? "Login" : "Register"}
                  </button>
                </Form.Item>
              </Form>

              <Flex className="button" justify="center" gap={12}>
                <button 
                  onClick={handleFBLogin} 
                  size="large" 
                  className="button__facebook"
                >
                  <FacebookOutlined />
                </button>
                <button 
                  onClick={handleGoogleLogin} 
                  size="large" 
                  className="button__google"
                >
                  <GoogleOutlined />
                </button>
              </Flex>

              <div style={{ textAlign: "center" }}>
                {mode === "login" ? (
                  <span>
                    Don't have an account?{" "}
                    <Button type="link" onClick={() => setMode("register")}>
                      Register
                    </Button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <Button type="link" onClick={() => setMode("login")}>
                      Login
                    </Button>
                  </span>
                )}
              </div>
            </div>
            
          </Flex>
        </div>
      )}
    </>
  )
}

export default Login;