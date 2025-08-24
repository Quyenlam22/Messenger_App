import { Avatar, Button, Form, Input, Modal, Select } from "antd";
import { useContext, useMemo } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import { addDocument } from "../../firebase/services";
import { AppContext } from "../../Context/AppProvider";

const { Option } = Select;

const rules = [
  { 
    required: true, 
    message: "Please don't leave this field blank!" 
  }
];

function CreateRoom (props) {
  const {isModalOpen, setIsModalOpen} = props;
  const {messageApi} = useContext(AppContext);
  const user = useContext(AuthContext);

  const usersCondition = useMemo(() => {
    if (!user?.uid) return null;
    return {
      fieldName: "uid",
      operator: "!=",
      compareValue: user.uid
    };
  }, [user?.uid])
  const users = useFirestore("users", usersCondition);
  
  const [ form ] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    const dataRoom = { 
      name: values.name,
      desc: values.desc || '',
      members: [
        ...(values.members || []),
        user.uid
      ] ,
      owner: user.uid,
      createdAt: Date.now()
    }
    await addDocument("rooms", dataRoom);
    form.resetFields();
    messageApi.open({
      type: 'success',
      duration: 1.5,
      content: 'Create room successfully!',
    });
    setIsModalOpen(false);
  };
  const onFinishFailed = errorInfo => {
    messageApi.open({
      type: 'error',
      duration: 1.5,
      content: `Failed: ${errorInfo}`,
    });
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Modal
        title="Create Room"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="create-room"
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
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="desc"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Members"
            name="members"
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Add members"
              optionFilterProp="children"
            >
              {users.map((item) => (
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
              ))}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
            <Button 
              size="large" 
              htmlType="submit"
              className="button__create-room"
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default CreateRoom;