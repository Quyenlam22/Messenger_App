import { Button, Flex, Input, Form } from "antd";
import { Content } from "antd/es/layout/layout";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import Message from "./Message";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { addDocument, editDocument } from "../../firebase/services";
import Welcome from "./Welcome";
import WelcomeMobile from "./WelcomeMobile";
import EmojiPicker from 'emoji-picker-react';
import { MdCancel } from "react-icons/md";
import { useLocation } from "react-router-dom";
import ChatWithAI from "./ChatWithAI";
import { db } from "../../firebase/config";
import { doc } from "firebase/firestore";
import { sendMessageToAI } from "../../utils/openai";

function ChatRoomContent (props) {
  const { borderRadiusLG, colorBgContainer } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [showPicker, setShowPicker] = useState(false);
  const location = useLocation();
  const user = useContext(AuthContext);
  
  const {selectedRoom, selectedRoomBot, selectedRoomId} = useContext(AppContext);
  
  const onFinish = async (values) => {
    form.resetFields();
    if(location.pathname === "/") {
      await addDocument('messages', {
        text: values.message,
        uid: user.uid,
        photoURL: user.photoURL,
        roomId: selectedRoom.id,
        displayName: user.displayName,
        createdAt: Date.now()
      });
    }
    else {
      const userMessage = {
        id: Date.now().toString(),
        uid: user.uid,
        // displayName: user.displayName,
        // photoURL: user.photoURL || null,
        text: values.message,
        createdAt: Date.now(),
      };
      const roomBotRef = doc(db, 'bots', selectedRoomId);
      const updatedContent = [...selectedRoomBot.content, userMessage];
      await editDocument(roomBotRef, { content: updatedContent });

      try {
        const data = await sendMessageToAI(values.message);
        
        const botMessage = {
          id: Date.now().toString() + "-bot",
          uid: "bot",
          // displayName: "AI",
          // photoURL: "/bot-avatar.png",
          text: data.reply,
          createdAt: Date.now(),
        };

        await editDocument(roomBotRef, {
          content: [...updatedContent, botMessage]
        });
      } catch (err) {
        console.error("Error when calling AI:", err);
      }
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {(selectedRoom || selectedRoomBot) ? (
        <Content
          style={{
            margin: '10px',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            position: "relative",
          }}
        >
          {location.pathname === "/" ? <Message/> : <ChatWithAI/>}
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
              <Form.Item>
                <div className="emoji-picker">
                <Button onClick={() => setShowPicker(!showPicker)}><SmileOutlined /></Button>
                
                {showPicker && (
                  <div
                    className="emoji-picker__container"
                  >
                    <Button 
                      type="text" 
                      onClick={() => setShowPicker(false)}
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        zIndex: 1000
                      }}
                      icon={<MdCancel size={24} />}
                    />
                    <EmojiPicker
                      onEmojiClick={(emojiObject) => {
                        form.setFieldsValue({
                          message: (form.getFieldValue("message") || "") + emojiObject.emoji,
                        });
                        // setShowPicker(false); 
                      }}
                    />
                  </div>
                )}
              </div>
              </Form.Item>
              <Button color="pink" variant="solid" htmlType="submit">
                <SendOutlined />
              </Button>
            </Flex>
          </Form>
        </Content>
      ) : (
        <>
          <Welcome
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
          <WelcomeMobile/>
        </>  
      )}
    </>
  )
}

export default ChatRoomContent;