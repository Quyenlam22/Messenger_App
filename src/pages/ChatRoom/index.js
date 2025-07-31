import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { Layout, message, theme } from "antd";
import "./ChatRoom.scss";
import ChatRoomSider from "../../components/ChatRoom/ChatRoomSider";
import ChatRoomHeader from "../../components/ChatRoom/ChatRoomHeader";
import ChatRoomContent from "../../components/ChatRoom/ChatRoomContent";
import useTitle from "../../hooks/useTitle";

function ChatRoom () {
  const user = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  useTitle('ChitChat');

  useEffect(() => {
    if (sessionStorage.getItem("loginSuccess") === "true") {
      messageApi.open({
        type: 'success',
        duration: 1.5,
        content: 'Login successfully!',
      });
      sessionStorage.removeItem("loginSuccess");
    }
  }, [messageApi]);

  return (
    <>
      {contextHolder}
      {user && (
        <Layout className="chat-room">
          <ChatRoomSider 
            colorBgContainer={colorBgContainer}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
          <Layout>
            <ChatRoomHeader 
              colorBgContainer={colorBgContainer}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
            <ChatRoomContent
              colorBgContainer={colorBgContainer}
              borderRadiusLG={borderRadiusLG}
            />
          </Layout>
        </Layout>
      )}
    </>
  )
}

export default ChatRoom;