import { useContext, useEffect } from "react";
import { AuthContext } from "../../Context/AuthProvider";

function ChatRoom () {
  const user = useContext(AuthContext);

  useEffect(() => {
    document.title = 'ChitChat'
  }, []);

  console.log(user);

  return (
    <>
      ChatRoom
    </>
  )
}

export default ChatRoom;