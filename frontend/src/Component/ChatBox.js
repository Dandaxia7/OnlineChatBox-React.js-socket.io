import React from 'react';
import { Button, Card, List, Form, Input } from 'antd';
import socket from '../Socket';

function ChatBox({username}) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [messages, setMessages] = React.useState([{from: 'System', body: "Welcome to the chat room!"}, {from: 'System', body: "Let's have some chat!"}]);

    const uiMessageRef = React.useRef(null);

    React.useEffect(() => {
        if(uiMessageRef.current) {
            uiMessageRef.current.scrollBy({
                top: uiMessageRef.current.scrollHeight,
                left: 0,
                behavior: 'smooth',
            })
        }
        if(socket){
            socket.on('onLogin',{usrname: username});
            socket.on('message', (data) => {
                setMessages([...messages, data]);
            })
        }
    },[messages, username])

    const supportHandler = () => {
        setIsOpen(true);
        if(!username){
            setIsOpen(false);
            alert("Please login first!")
        }

    }

    const closeHandler = () => {
        setIsOpen(false)
    }

    const submitHandler = (values) => {
        if(!values){
            
        } else {
            setMessages([...messages, {body: values.message, from: username, to: 'Admin'}]);
            setTimeout(() => {
                socket.emit('onMessage',{
                    body: values.message,
                    from: username,
                    to: 'Admin'
                })
            }, 1000);
        }
    }

    return (
        <div>
            {!isOpen ?
            <Button onClick={supportHandler} className='chatbox-btn'>Chat With Us!</Button>
            :
            <div>
                <Card title="Let's Chat!">
                    <List ref={uiMessageRef}>
                        {messages.map((msg, index) => (
                            <List.Item key={index}>
                                <strong>{msg.from +": "}</strong> {msg.body}
                            </List.Item>
                        ))}
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
                </Card>
                <Button onClick={closeHandler} className='chatbox-btn'><strong>Close</strong>x</Button>
            </div>
            }
        </div>
    )
}

export default ChatBox;