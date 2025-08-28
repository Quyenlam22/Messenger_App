import { useContext, useState } from "react";
import { Avatar, Button, Flex, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { HomeOutlined, LogoutOutlined, PlusCircleOutlined, UserOutlined, WechatOutlined } from "@ant-design/icons";
import { AuthContext } from "../../Context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { AppContext } from "../../Context/AppProvider";
import CreateRoom from "./CreateRoom";
import { useNavigate } from "react-router-dom";
import { doc, serverTimestamp } from "firebase/firestore";
import { editDocument } from "../../firebase/services";

function ChatRoomSider (props) { 
  const user = useContext(AuthContext);
  const { colorBgContainer, collapsed, setCollapsed } = props;
  const navigate = useNavigate();

  const {rooms, setSelectedRoomId} = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  
  const items =
  [
    {
      key: 'list-room-chat',
      icon: <WechatOutlined />,
      label: 'List Room Chat',
      children:
        rooms.map((room) => {
          return {
            key: room.id,
            label: room.name,
            onClick: () => setSelectedRoomId(room.id)
          }
        })
    }
  ]

  const handleLogout = async () => {
    const userRef = doc(db, 'users', user.id);
    await editDocument(userRef, {
      state: "offline",
      lastSeen: serverTimestamp(),
    })
    
    localStorage.setItem("logout", "true");
    localStorage.removeItem("accessToken");
    setSelectedRoomId(null);
    await signOut(auth);
  }

  const handleHomePage = () => {
    navigate("/");
    setSelectedRoomId("");
  }

  return (
    <>
      <Sider 
        theme="light" 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        onBreakpoint={(broken) => setCollapsed(broken)}
        breakpoint="md"
      >
        <Header 
          style={{ 
            padding: 0, 
            background: colorBgContainer 
          }}
        >
          <Flex 
            className="info-user" 
            justify="center" 
            align="center" 
            vertical={false}
          >
            <Avatar referrerPolicy="no-referrer" className="info-user__avatar" src={user.photoURL} >
              {user.photoURL ? '' : user.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
            <h3 className={`info-user__display-name ${collapsed ? "collapsed" : ""}`} >{user.displayName}</h3>
          </Flex>
        </Header>
        <Flex 
          style={{ height: 'calc(100vh - 64px - 25px)' }}
          justify="space-between" 
          vertical 
        >
          <Button 
            type="text"
            icon={<HomeOutlined />} 
            style={{width: '100%', justifyContent: 'center'}}
            onClick={handleHomePage}
          >
            {!collapsed && "Home"}
          </Button>
          <div 
            style={{ overflowY: 'auto', flex: 1 }}
            className="res-des"
          >
            <Menu
              style={{width: '100%', justifyContent: 'center'}}
              mode="inline"
              defaultSelectedKeys={['list-room-chat']}
              defaultOpenKeys={['list-room-chat']}
              items={items}
            />
          </div>
          <Button 
            type="text"
            icon={<PlusCircleOutlined />} 
            onClick={showModal}
            style={{width: '100%', justifyContent: 'center'}}
          >
            {!collapsed && "Add Room Chat"}
          </Button>
          <CreateRoom isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
          <Button 
            type="text"
            icon={<UserOutlined />} 
            onClick={() => navigate("/users")}
            style={{width: '100%', justifyContent: 'center'}}
          >
            {!collapsed && "Users"}
          </Button>
          <Button 
            className="button__logout"
            size="large"
            type="text"
            onClick={handleLogout}
          >
            {collapsed ? 
              <LogoutOutlined /> : 
              <><LogoutOutlined /> Logout</>
            }
          </Button>
        </Flex>
      </Sider>
    </>
  )
}

export default ChatRoomSider;