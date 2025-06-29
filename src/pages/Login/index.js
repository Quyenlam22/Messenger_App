import { useEffect } from "react";
import { Flex } from 'antd';
import './Login.scss';
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons'
function Login () {
  useEffect(() => {
    document.title = 'Login'
  }, []);

  return (
    <>
      <div className="login">
        <Flex className="login__content" justify="center" vertical align="center">
          <h1 className="login__title">Welcome to ChitChat!</h1>
          <h2 className="login__desc">Connect anytime - Chat anywhere.</h2>
          <Flex className="button" vertical gap={12}>
              <button size="large" className="button__facebook"><FacebookOutlined /> Login with Facebook</button>
              <button size="large" className="button__google"><GoogleOutlined /> Login with Google</button>
          </Flex>
        </Flex>
      </div>
    </>
  )
}

export default Login;