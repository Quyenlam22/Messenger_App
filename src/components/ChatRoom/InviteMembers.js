import { Avatar, Button, Form, Modal, Select } from "antd";
import { useContext } from "react";
import { AppContext } from "../../Context/AppProvider";
import { db } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";

const { Option } = Select;

function InviteMembers (props) {
  const {isModalOpen, setIsModalOpen} = props;
  const {selectedRoomId, selectedRoom, membersInvite} = useContext(AppContext);

  const [ form ] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    if (values && values.members?.length > 0) {
      try {
        const roomRef = doc(db, 'rooms', selectedRoomId);
        await updateDoc(roomRef, {
          members: [...selectedRoom.members, ...values.members]
        });
        form.resetFields();
        setIsModalOpen(false);
      } catch (error) {
        console.error("Update failed:", error);
      }
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Modal
        title="Invite Members"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="invite-members"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          labelAlign="left"
        >
          <Form.Item
            wrapperCol={{ span: 24 }}
            name="members"
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Add members"
              optionFilterProp="children"
            >
              {membersInvite.length > 0 ? (
                membersInvite.map((item) => (
                  <Option key={item.id} value={item.uid}>
                    <Avatar 
                      size="small" 
                      src={item.photoURL}
                      style={{
                        marginRight: 5,
                        marginBottom: 5,
                      }}
                    >
                      {item.photoURL ? '' : item.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {item.displayName}
                  </Option>
                ))
              ) : (
                <Option disabled>All members are already in the group!</Option>
              )} 
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
            <Button 
              size="large" 
              htmlType="submit"
              className="button__invite-members"
            >
              Invite
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default InviteMembers;