import { Avatar, Button, Flex, Tooltip } from "antd";
import { LeftOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, UserAddOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import InviteMembers from "./InviteMembers";
import ChatRoomSetting from "./ChatRoomSetting";
import SearchBar from "./SearchBar";

function ChatRoomHeader (props) { 
  const { colorBgContainer, collapsed, setCollapsed } = props;
  const {selectedRoom, members, setSelectedRoomId} = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const [modalSetting, setModalSetting] = useState(false);
  const showModalSetting = () => {
    setModalSetting(true);
  };

  return (
    <div className="header">
      {
        selectedRoom ? (
          <Flex 
            style={{ 
              height: 64,
              padding: "0 15px 0 15px", 
              background: colorBgContainer,
              overflow: "hidden"
            }}
            align="center" 
            vertical={false} 
            justify="space-between"
          >
            <Flex vertical={false} align="center" gap={4}>
              <Button
                type="text"
                size="large"
                className="res-des"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
              <Button
                type="text"
                size="large"
                icon={<LeftOutlined />}
                onClick={() => setSelectedRoomId("")}
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
                onClick={showModal}
              >
                <UserAddOutlined /> Invite
              </Button>
              <InviteMembers isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
              <Avatar.Group max={{count: 2}}>
                {members && members.map((member) => (
                  <Tooltip placement="bottom" title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
              <Button
                type="text"
                size="large"
                onClick={showModalSetting}
              >
                <SettingOutlined />
              </Button>
              <ChatRoomSetting modalSetting={modalSetting} setModalSetting={setModalSetting}/>
            </Flex>
          </Flex>
        ) : (
          <>
            <Flex 
              style={{ 
                height: 64,
                padding: "0 15px 0 15px", 
                background: colorBgContainer,
                overflow: "hidden"
              }}
              align="center" 
              vertical={false} 
              gap={4}
            >
              <Button
                type="text"
                size="large"
                className="res-des"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
              <SearchBar/>
            </Flex>
          </>
        )
      }
    </div>
  )
}

export default ChatRoomHeader;