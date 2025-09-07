import { Avatar, Flex } from "antd";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { AppContext } from "../../Context/AppProvider";
import ChatBotPng from "../../assets/ChatBot.png";
function ChatWithAI() {
  const user = useContext(AuthContext);
  const messageContainerRef = useRef(null);

  const { selectedRoomBot } = useContext(AppContext);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedRoomBot]);

  return (
    <div className="message" ref={messageContainerRef}>
      {selectedRoomBot?.content &&
        selectedRoomBot.content.map((message) =>
          message.uid === user.uid ? (
            <div key={message.id} className="message__box message__box--me">
              <p className="message__content message__content--me">
                {message.text}
              </p>
            </div>
          ) : (
            <div className="message__box" key={message.id}>
              <Flex align="center">
                <Avatar
                  className="message__avatar"
                  src={ChatBotPng}
                />
                {/* <span className="message__name">AI</span> */}
              </Flex>
              <p className="message__content">{message.text}</p>
            </div>
          )
        )}
    </div>
  );
}

export default ChatWithAI;