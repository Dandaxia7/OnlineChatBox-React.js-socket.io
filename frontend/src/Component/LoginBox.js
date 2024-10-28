import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import socket from '../Socket';

function LoginBox({ onHandleIsLogin }) {

    //Login按钮点击事件
    const onFinishLogin = (values) => {
        //向服务器发送登录请求
        console.log('Received values of login form: ', values);
        if(socket){
            socket.emit('onLogin', {username: values.username});
        }
        //如果成功，则登录信息保持至本地存储
        if(true){
            onHandleIsLogin(true, values.username);
        }
    };

    return (
        //登录界面
        <Form
          name="login"
          initialValues={{
            remember: true,
          }}
          style={{
            maxWidth: 480,
            maxHeight: 400,
            top: '50%',
            left: '50%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgb(148, 178, 234)',
            borderRadius: '10px',
            padding: '20px',
          }}
          onFinish={onFinishLogin}
        >   
          
          <h2 style={{color: 'white', textAlign: 'center', fontSize: '30px', fontWeight: '1000', }}>Login</h2>

          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
            >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Flex>
          </Form.Item>
    
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>

        </Form>
      ) 
}

export default LoginBox;