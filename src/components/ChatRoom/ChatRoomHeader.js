import { Avatar, Button, Flex, Tooltip } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserAddOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { AppContext } from "../../Context/AppProvider";

function ChatRoomHeader (props) { 
  const { colorBgContainer, collapsed, setCollapsed } = props;
  const {selectedRoom, members} = useContext(AppContext);

  return (
    <>
      {
        selectedRoom ? (
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
                <p className="info-room__title">{selectedRoom.name}</p>
                <span className="info-room__desc">{selectedRoom.desc}</span>
              </div>  
            </Flex> 
            <Flex align="center">
              <Button 
                type="text"
                size="middle"
              >
                <UserAddOutlined /> Invite
              </Button>
              <Avatar.Group max={{count: 2}}>
                {members && members.map((member) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </Flex>
          </Flex>
        ) : (
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
              <Button
                type="text"
                size="large"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
            </Flex>
          </>
        )
      }
    </>
  )
}

export default ChatRoomHeader;