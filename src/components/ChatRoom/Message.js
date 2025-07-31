import { Avatar, Flex } from "antd";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { AppContext } from "../../Context/AppProvider";

function Message() {
  const user = useContext(AuthContext);
  const messageContainerRef = useRef(null);

  const { messages } = useContext(AppContext);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div className="message" ref={messageContainerRef}> 
      {messages && messages.map(message => (
        (message.uid === user.uid) ? (
          <div key={message.id} className="message__box message__box--me">
            <p className="message__content message__content--me">{message.text}</p>
          </div>
        ) : (
          <div className="message__box" key={message.id}>
            <Flex align="center">
              <Avatar className="message__avatar" src={message.photoURL} >
                {message.photoURL ? '' : message.displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <span className="message__name">{message.displayName}</span>
              <span className="message__time">
                {(() => {
                  const created = new Date(Number(message.createdAt));
                  const now = new Date();

                  const isToday =
                    created.getDate() === now.getDate() &&
                    created.getMonth() === now.getMonth() &&
                    created.getFullYear() === now.getFullYear();

                  const datePart = created.toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });

                  const timePart = created.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  });

                  return  isToday
                    ? `Today at ${timePart}`
                    : `${datePart} ${timePart}`
                })()}
              </span>
            </Flex>
            <p className="message__content">{message.text}</p>
          </div>
        )       
      ))}
    </div>
  );
}

export default Message;
