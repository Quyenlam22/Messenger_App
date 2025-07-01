import { Avatar, Flex } from "antd";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../Context/AuthProvider";

function Message() {
  const user = useContext(AuthContext);
  const messageContainerRef = useRef(null);
  

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []); 
  
  return (
    <div className="message" ref={messageContainerRef}> 
      <div className="message__box message__box--me">
        <p className="message__content message__content--me">Message 1</p>
      </div>
      <div className="message__box message__box--me">
        <p className="message__content message__content--me">Message 2</p>
      </div>
      <div className="message__box">
        <Flex align="center">
          <Avatar className="message__avatar" src={user.photoURL} />
          <span className="message__name">{user.displayName}</span>
          <span className="message__time">Today at 11:00 PM</span>
        </Flex>
        <p className="message__content">Message 3</p>
      </div>
      <div className="message__box">
        <Flex align="center">
          <Avatar className="message__avatar" src={user.photoURL} />
          <span className="message__name">{user.displayName}</span>
          <span className="message__time">Today at 11:00 PM</span>
        </Flex>
        <p className="message__content">Message 4</p>
      </div>
    </div>
  );
}

export default Message;
