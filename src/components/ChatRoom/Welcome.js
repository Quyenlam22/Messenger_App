import { Button, Flex } from "antd"
import CreateRoom from "./CreateRoom"
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthProvider";

function Welcome (props) {
  const { isModalOpen, setIsModalOpen } = props
  const user = useContext(AuthContext);
  
  return (
    <>
      <Flex className="welcome res-des" vertical justify="center" align="center">
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
    </>
  )
}

export default Welcome;