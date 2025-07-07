import { Button, Flex, Input, Form } from "antd";
import { Content } from "antd/es/layout/layout";
import { SendOutlined } from "@ant-design/icons";
import Message from "./Message";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import CreateRoom from "./CreateRoom";
import { addDocument } from "../../firebase/services";

function ChatRoomContent (props) {
  const { borderRadiusLG, colorBgContainer } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const user = useContext(AuthContext);
  
  const {selectedRoom} = useContext(AppContext);
  
  const onFinish = async (values) => {
    await addDocument('messages', {
      text: values.message,
      uid: user.uid,
      photoURL: user.photoURL,
      roomId: selectedRoom.id,
      displayName: user.displayName,
      createdAt: Date.now()
    });
    form.resetFields();
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
            form={form}
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
