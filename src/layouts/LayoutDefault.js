import { useContext, useEffect, useState } from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { AppContext } from "../Context/AppProvider";
import ChatRoomSider from "../components/ChatRoom/ChatRoomSider";
import ChatRoomHeader from "../components/ChatRoom/ChatRoomHeader";

function LayoutDefault () {
  const user = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { messageApi } = useContext(AppContext);
  
  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin") === "true";
    const isLogout = localStorage.getItem("logout") === "true";

    if (localStorage.getItem("accessToken") && isLogin) {
      messageApi.success("Login successfully!");
      localStorage.removeItem("isLogin");
    } 
    else if (!localStorage.getItem("accessToken") && !user && !isLogout) {
      messageApi.warning("You must login to continue!");
    }
  }, [messageApi, user]);

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
            <Outlet/>
          </Layout>
        </Layout>
      )}
    </>
  )
}

export default LayoutDefault;