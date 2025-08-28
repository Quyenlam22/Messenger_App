import { Avatar, List, Badge, Carousel, Image, Button, Col, Row } from "antd";
import "./User.scss";
import { useContext } from "react";
import { AppContext } from "../../Context/AppProvider";
import { MessageOutlined } from "@ant-design/icons";
import useWindowSize from "../../hooks/useWindowSize";
import { AuthContext } from "../../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

function sliceArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function User() {
  const { friends, setSelectedRoomId } = useContext(AppContext);
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  const { width } = useWindowSize();

  let userSlice = [];

  if(width > 576) {
    if(width >= 1200) {
      userSlice = sliceArray(friends, 4);
    }
    if(width < 1200 && width >= 992) {
      userSlice = sliceArray(friends, 3);
    }
    if(width < 992 && width >= 768) {
      userSlice = sliceArray(friends, 2);
    }
    if(width < 768 && width >= 576) {
      userSlice = sliceArray(friends, 2);
    }
  }

  const handleCreateRoom = async (values) => {
    const newRoomRef = doc(collection(db, "rooms")); 
    const dataRoom = { 
      id: newRoomRef.id,
      name: `${values.displayName} & ${user.displayName}`,
        desc: '',
        members: [values.uid, user.uid],
        owner: user.uid,
        createdAt: Date.now()
      };

      await setDoc(newRoomRef, dataRoom); 

      setSelectedRoomId(newRoomRef.id); 
      console.log("Created room:", newRoomRef.id);
      navigate("/");
  }

  return (
    <div className="user-list">
      {width > 576 ? (
        <Carousel 
          autoplay
          arrows 
          infinite={false}
        >
          {userSlice.map((users, rowIndex) => (
            <div>
              <Row
                gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
                key={rowIndex}
                style={{ marginBottom: 24 }}
              >
                {users.map((item) => (
                  <Col key={item.id} sm={12} md={12} lg={8} xl={6}>
                    <div className="user-list__box">
                      <Badge
                        dot
                        status={item.state === "online" ? "success" : "default"}
                        offset={[-8, 8]}
                      >
                        {item.photoURL ? (
                          <Image
                            preview={false}
                            style={{ width: "100%", height: 200, objectFit: "cover" }}
                            src={item.photoURL}
                          />
                        ) : (
                          <Avatar
                            shape="square"
                            style={{
                              width: "100%",
                              height: 200,
                              fontSize: 64,
                            }}
                          >
                            {item.displayName?.charAt(0).toUpperCase()}
                          </Avatar>
                        )}
                      </Badge>
                      <div className="user-list__content">
                        <h3>{item.displayName}</h3>
                        <Button type="primary" onClick={() => handleCreateRoom(item)}>
                          <MessageOutlined /> Send Message
                        </Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Carousel>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={friends}
          renderItem={(item) => (
            <List.Item
              key={item.uid}
              className="user-list__item"
              onClick={() => handleCreateRoom(item)}
            >
              <List.Item.Meta
                avatar={
                  <div className="user-list__avatar">
                    <Badge
                      dot
                      status={item.state === "online" ? "success" : "default"}
                      offset={[-5, 35]}
                    >
                      <Avatar src={item.photoURL}>
                        {item.photoURL
                          ? ""
                          : item.displayName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </Badge>
                  </div>
                }
                title={<span className="user-list__name">{item.displayName}</span>}
                description={
                  <span
                    className={`user-list__status ${
                      item.state === "online" ? "online" : "offline"
                    }`}
                  >
                    {item.state === "online" ? "online" : "offline"}
                  </span>
                }
              />
            </List.Item>
        )}
      />
      )}    
    </div>
  );
}

export default User;
