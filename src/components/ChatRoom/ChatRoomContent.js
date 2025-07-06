import { Button, Flex, Input, Form } from "antd";
import { Content } from "antd/es/layout/layout";
import { SendOutlined } from "@ant-design/icons";
import Message from "./Message";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import CreateRoom from "./CreateRoom";
// import { useContext } from "react";
// import { AuthContext } from "../../Context/AuthProvider";

function ChatRoomContent (props) {
  const { borderRadiusLG, colorBgContainer } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useContext(AuthContext);

  // users.forEach(item => {
  //   const date = new Date(Number(item.createdAt)).toLocaleDateString('vi-VN', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     // second: '2-digit',
  //     // hour12: false // AM/PM
  //   });
  // })  
  
  const {selectedRoom} = useContext(AppContext);
  
  const onFinish = values => {
    console.log('Success:', values);
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {selectedRoom ? (
        <Content
          style={{
            margin: '10px',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            position: "relative",
          }}
        >
          <Message/>
          <Form
            name="send-message"
            className='send-message'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Flex justify="flex-end" vertical={false} gap={4}>
              <Form.Item
                name="message"
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Input placeholder="Type your message..." />
              </Form.Item>
              <Button color="pink" variant="solid" htmlType="submit">
                <SendOutlined />
              </Button>
            </Flex>
          </Form>
        </Content>
      ) : (
        <Flex className="welcome" vertical justify="center" align="center">
          <h1 className="welcome__title">Welcome {user.displayName} 👋</h1>
          <Flex justify="center" align="center" vertical>
            <p className="welcome__content">Choose a chat group to start chatting with people!</p>
            <p className="welcome__content-create-room">You can create a new group if you don't have one yet.</p>
            <Button 
              className="button__welcome" 
              size="large" 
              onClick={() => {
                setIsModalOpen(true)
              }} 
            >
              Create Room Chat
            </Button>
            <CreateRoom isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
          </Flex>
        </Flex>
      )}
    </>
  )
}

export default ChatRoomContent;
