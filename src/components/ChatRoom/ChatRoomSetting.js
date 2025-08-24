import { Avatar, Button, Flex, Form, Input, Modal, Select } from "antd";
import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../../Context/AppProvider";
import { db } from "../../firebase/config";
import { doc } from "firebase/firestore";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import { ArrowRightOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deleteDocument, editDocument } from "../../firebase/services";

const { Option } = Select;

const rules = [
  { 
    required: true, 
    message: "Please don't leave this field blank!" 
  }
];

function ChatRoomSetting (props) {
  const {modalSetting, setModalSetting} = props;
  const {selectedRoomId, selectedRoom, messageApi} = useContext(AppContext);
  const user = useContext(AuthContext);

  const [ form ] = Form.useForm();

  const usersCondition = useMemo(() => {
    if (!user?.uid) return null;
    return {
      fieldName: "uid",
      operator: "!=",
      compareValue: user.uid
    };
  }, [user?.uid])
  const users = useFirestore("users", usersCondition);
  
  const membersCondition = useMemo(() => {
    if (!selectedRoom?.members || selectedRoom.members.length === 0) return null;
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: selectedRoom.members
    };
  }, [selectedRoom?.members])
  const members = useFirestore("users", membersCondition);

  useEffect(() => {
    if (modalSetting && selectedRoom && user) {
      const ownerDisplayName = members.find(m => m.uid === selectedRoom.owner)?.displayName || "Unknown";
      form.setFieldsValue({
        name: selectedRoom?.name || "",
        desc: selectedRoom?.desc || "",
        owner: ownerDisplayName,
        members: members.map(member => member.uid) || []
      });
    }
  }, [modalSetting, selectedRoom, user, members, form]);  

  const handleCancel = () => {
    form.resetFields();
    setModalSetting(false);
  };

  const onFinish = async (values) => {    
    try {
      const roomRef = doc(db, 'rooms', selectedRoomId);
      await editDocument(roomRef, {
        name: values.name,
        desc: values.desc,
        members: [
          ...values.members,
          selectedRoom.owner
        ]
      });
      // form.resetFields();
      messageApi.open({
        type: 'success',
        duration: 1.5,
        content: 'Edit room successfully!',
      });
      setModalSetting(false);
    } catch (error) {
      messageApi.open({
        type: 'error',
        duration: 1.5,
        content: `Edit room failed: ${error}`,
      });
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    messageApi.open({
      type: 'error',
      duration: 1.5,
      content: `Failed: ${errorInfo}`,
    });
  };

  const handleDelete = async () => {
    try {
      messageApi.open({
        type: 'success',
        content: 'Room deleted!',
      });
      await deleteDocument(doc(db, 'rooms', selectedRoomId));
      setModalSetting(false);
    } catch (e) {
      messageApi.open({
        type: 'error',
        duration: 0.5,
        content: `Delete room failed: ${e}`,
      });
    }
  }

  const handleLeave = () => {
    try {
      messageApi.open({
        type: 'success',
        duration: 0.5,
        content: 'You have left the group!',
      });
      setTimeout(async () => {
        const roomRef = doc(db, 'rooms', selectedRoomId);
        
        const updatedMembers = selectedRoom.members.filter(uid => uid !== user.uid);
        
        await editDocument(roomRef, {
          members: [...updatedMembers]
        });
        setModalSetting(false);
      }, 500);
    } catch (e) {
      messageApi.open({
        type: 'error',
        duration: 0.5,
        content: `Leave room failed: ${e}`,
      });
    }
  }

  const disabled = user.uid === selectedRoom.owner ? false : true;

  return (
    <>
      <Modal
        title="Settings Room"
        open={modalSetting}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="settings-room"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item
            label="Title Room"
            name="name"
            rules={rules}
          >
            <Input disabled={disabled} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="desc"
          >
            <Input.TextArea disabled={disabled} />
          </Form.Item>
          <Form.Item
            label="Owner"
            name="owner"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Members"
            name="members"
          >
            <Select
              mode="multiple"
              placeholder="Add members"
              optionFilterProp="children"
              disabled={disabled}
            >
              {[...users, ...members]
                .filter((value, index, self) =>
                  index === self.findIndex((v) => v.uid === value.uid)
                )
                .map((item) => (
                  <Option 
                    key={item.id} 
                    value={item.uid} 
                  >
                    <Avatar
                      size="small"
                      src={item.photoURL}
                      style={{ marginRight: 5, marginBottom: 5 }}
                    >
                      {item.photoURL ? '' : item.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {item.displayName || item.uid}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
            {
              (selectedRoom.owner === user.uid ? (
                <Flex gap={8} justify="center">
                  <Button 
                    size="large" 
                    htmlType="submit"
                    className="button__edit-room"
                  >
                    <EditOutlined /> Edit
                  </Button>
                  <Button 
                    size="large" 
                    className="button__delete-room"
                    onClick={handleDelete}
                  >
                    <DeleteOutlined /> Delete
                  </Button>
                </Flex>
              ) : (
                <Button 
                  size="large" 
                  className="button__delete-room"
                  onClick={handleLeave}
                >
                  <ArrowRightOutlined /> Leave group
                </Button>
              ))
            }
            
            
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ChatRoomSetting;