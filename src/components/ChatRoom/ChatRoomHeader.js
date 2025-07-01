import { Avatar, Button, Flex, Tooltip } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserAddOutlined } from "@ant-design/icons";

function ChatRoomHeader (props) { 
  const { colorBgContainer, collapsed, setCollapsed } = props;

  return (
    <>
      <Flex 
        style={{ 
          height: 64,
          padding: "0 15px 0 15px", 
          background: colorBgContainer ,
        }}
        align="center" 
        vertical={false} 
        justify="space-between"
      >
        <Flex vertical={false} align="center" gap={4}>
          <Button
            type="text"
            size="large"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div className="info-room">
            <p className="info-room__title">Title Room</p>
            <span className="info-room__desc">This is the description of chat room</span>
          </div>  
        </Flex> 
        <Flex align="center">
          <Button 
            type="text"
            size="middle"
          >
            <UserAddOutlined /> Invite
          </Button>
          <Avatar.Group maxCount={2}>
            <Tooltip title='A'>
              <Avatar>A</Avatar>
            </Tooltip>
            <Tooltip title='A'>
              <Avatar>A</Avatar>
            </Tooltip>
            <Tooltip title='A'>
              <Avatar>A</Avatar>
            </Tooltip>
            <Tooltip title='A'>
              <Avatar>A</Avatar>
            </Tooltip>
          </Avatar.Group>
        </Flex>
      </Flex>
    </>
  )
}

export default ChatRoomHeader;