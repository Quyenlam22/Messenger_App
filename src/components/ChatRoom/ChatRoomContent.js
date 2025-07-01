import { Button, Flex, Input, Form } from "antd";
import { Content } from "antd/es/layout/layout";
import { SendOutlined } from "@ant-design/icons";
import Message from "./Message";

function ChatRoomContent (props) {
  const { borderRadiusLG, colorBgContainer } = props;

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
