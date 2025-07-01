import { useContext } from "react";
import { Avatar, Button, Flex, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { LogoutOutlined, PlusCircleOutlined, WechatOutlined } from "@ant-design/icons";
import { AuthContext } from "../../Context/AuthProvider";

const items =
[
  {
    key: 'list-room-chat',
    icon: <WechatOutlined />,
    label: 'List Room Chat',
    children: [
      {
        key: 'room-chat-1',
        icon: <WechatOutlined />,
        label: 'Room Chat 1',
      },
      {
        key: 'room-chat-2',
        icon: <WechatOutlined />,
        label: 'Room Chat 2',
      }
    ]
  },
  {
    key: 'add-room-chat',
    icon: <PlusCircleOutlined />,
    label: 'Add Room Chat',
  }
]

function ChatRoomSider (props) { 
  const user = useContext(AuthContext);
  const { colorBgContainer, collapsed, setCollapsed } = props;

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
            <Avatar className="info-user__avatar" src={user.photoURL} />
            <h3 className={`info-user__display-name ${collapsed ? "collapsed" : ""}`} >{user.displayName}</h3>
          </Flex>
        </Header>
        <Flex 
          style={{ height: 'calc(100vh - 64px)' }}
          justify="space-between" 
          vertical 
        >
          <Menu
            className="menu"
            mode="inline"
            defaultSelectedKeys={['room-chat-1']}
            defaultOpenKeys={['list-room-chat']}
            items={items}
          />
          <Button 
            className="button__logout"
            size="large"
            type="text"
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