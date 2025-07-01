import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { Layout, theme } from "antd";
import "./ChatRoom.scss";
import ChatRoomSider from "../../components/ChatRoom/ChatRoomSider";
import ChatRoomHeader from "../../components/ChatRoom/ChatRoomHeader";
import ChatRoomContent from "../../components/ChatRoom/ChatRoomContent";

function ChatRoom () {
  const user = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = 'ChitChat'
  }, []);

  return (
    <>
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