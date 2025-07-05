import { Button, Flex, Input, Form } from "antd";
import { Content } from "antd/es/layout/layout";
import { SendOutlined } from "@ant-design/icons";
import Message from "./Message";
// import { useContext } from "react";
// import { AuthContext } from "../../Context/AuthProvider";

function ChatRoomContent (props) {
  const { borderRadiusLG, colorBgContainer } = props;
  // const users = useContext(AuthContext);

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

  const onFinish = values => {
    console.log('Success:', values);
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
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
    </>
  )
}

export default ChatRoomContent;
