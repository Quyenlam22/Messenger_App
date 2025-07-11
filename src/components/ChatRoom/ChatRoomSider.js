import { useContext, useState } from "react";
import { Avatar, Button, Flex, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { LogoutOutlined, PlusCircleOutlined, WechatOutlined } from "@ant-design/icons";
import { AuthContext } from "../../Context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { AppContext } from "../../Context/AppProvider";
import CreateRoom from "./CreateRoom";

function ChatRoomSider (props) { 
  const user = useContext(AuthContext);
  const { colorBgContainer, collapsed, setCollapsed } = props;

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
    },
    {
      key: 'add-room-chat',
      icon: <PlusCircleOutlined />,
      label: 'Add Room Chat',
      title: null,
      onClick: () => showModal()
    }
  ]

  const handleLogout = () => {
    signOut(auth);
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
          <Menu
            className="menu"
            mode="inline"
            defaultSelectedKeys={['list-room-chat']}
            defaultOpenKeys={['list-room-chat']}
            items={items}
          />
          <CreateRoom isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
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