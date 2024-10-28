import React from "react";
import socket from "../Socket";
import { Row, Col, Alert, List, Form, Input, Button } from "antd";

export default function Admin() {
    const [selectedUser, setSelectedUser] = React.useState({});
    const uiMessageRef = React.useRef(null);
    const [messages, setMessages] = React.useState([]);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        if(uiMessageRef.current) {
            uiMessageRef.current.scrollBy({
                top: uiMessageRef.current.scrollHeight,
                left: 0,
                behavior: "smooth"
            });
        }
        if(socket){
            socket.on("message", (data) => {
                if(selectedUser.username === data.from) {
                    setMessages([...messages, data]);
                }else{
                    const existUser = users.find(user => user.username === data.from);
                    if(existUser) {
                        setUsers(
                            users.map((user) => 
                                existUser.username ? {...user, unread: true} : user)
                        )
                    }
                }
            })

            socket.on("updateUser",(updatedUser) =>{
                const existUser = users.find(user => user.username === updatedUser.username);
                if(existUser) {
                    setUsers(
                        users.map((user) =>
                            user.username === existUser.username ? updatedUser : user
                        )
                    )
                }else{
                    setUsers([...users, updatedUser])
                }
            })

            socket.on("listUsers", (updatedUsers) => {
                setUsers(updatedUsers);
            })

            socket.on("selectUser", (user) => {
                setMessages(user.messages);
            })
        }
    },[messages, users, setSelectedUser, setMessages, setUsers, selectedUser])

    const selectUser = (user) => {
        //console.log(user);
        setSelectedUser(user);
        const existUser = users.find(x => x.username === user.username);
        if(existUser) {
            setUsers(
                users.map((x) =>
                    x.username === existUser.username ? {...x, unread: false} : x
                )
            )
        }
        socket.emit("onUserSelected", user);
    }

    const submitHandler = (values) => {
        if(!values.message.trim()){
            //alert("Please enter a message");
        }else{
            setMessages([...messages, {body: values.message,from: "Admin", to: selectedUser.username}]);
            setTimeout(() => {
                socket.emit("onMessage",{
                    body: values.message,
                    from: "Admin",
                    to: selectedUser.username
                })
            },1000);
        }
    }

  return (
    <Row>
        <Col sm={3}>
            {users.filter((x)=> x.username !== "Admin").length === 0 && (
                <Alert variant='info'>No User Found</Alert>
            )}
            <List bordered={true} size="small">
                {users.filter((x)=> x.username !== "Admin")
                    .map((user)=>(
                        <List.Item
                        action
                        key={user.username}
                        variant={user.username === selectedUser.username ? "info" : ""}
                        
                        >
                            <Button onClick={()=> selectUser(user)}>
                                <p style={{color: selectedUser.username === user.username 
                                 ? user.online 
                                  ? "green" 
                                  : "gray"
                                 : user.unread
                                 ? "red"
                                 : user.online
                                 ? "green"
                                 : "gray"}}>{
                                selectedUser.username === user.username 
                                ? user.online
                                 ? "Online"
                                 : "Offline"
                                : user.unread
                                ? "New"
                                : user.online
                                ? "Online"
                                : "Offline"
                                }</p>
                                {user.username}</Button>
                        </List.Item>
                    ))}
            </List>
        </Col>
        <Col sm={9}>
            <div className="admin">
                    {!selectedUser.username 
                    ? (<h1>Select a user to start chat</h1>)
                    : (
                        <div>
                            <h1>Chatting with {selectedUser.username}</h1>
                            <List ref={uiMessageRef}>
                                {messages.length === 0 && (
                                    <List.Item>No messages</List.Item>
                                )}
                                {messages.map((msg,index)=>{
                                    //console.log(msg,index);
                                    return <List.Item key={index}>
                                        <strong>{msg.from+': '}</strong> {msg.body}
                                    </List.Item>
                                })}
                            </List>

                            <Form name='messageBox' initialValues={{remember: true}} onFinish={submitHandler}>
                                <Form.Item
                                    name="message"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please input your message!',
                                    },
                                    ]}
                                    >
                                    <Input placeholder="Input Message" allowClear/>
                                </Form.Item>
                                <Form.Item>
                                    <Button block type="primary" htmlType="submit">
                                    Send
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    )
                    }
            </div>
        </Col>
    </Row>
  );
}