import { theme } from "antd";
import "./ChatRoom.scss";
import ChatRoomContent from "../../components/ChatRoom/ChatRoomContent";
import useTitle from "../../hooks/useTitle";

function ChatRoom () {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  useTitle('ChitChat');

  return (
    <>   
      <ChatRoomContent
        colorBgContainer={colorBgContainer}
        borderRadiusLG={borderRadiusLG}
      />
    </>
  )
}

export default ChatRoom;