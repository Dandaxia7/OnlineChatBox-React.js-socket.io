import React, { useState, useEffect } from 'react';
import LoginBox from '../Component/LoginBox';
import socket from '../Socket';
import ChatBox from '../Component/ChatBox.js';
import Admin from './Admin.js';

function Home() {

    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState('');
    const handleIsLogin = (flag, name) => {
        setIsLogin(flag);
        setUsername(name);
    }

    useEffect(() => {
        if(socket && username){
            socket.emit('onLogin', {username: username });
            setIsLogin(true);
        }else{//如果不存在，则显示登录界面
            setIsLogin(false);
        }
    },[username]);

    return (!isLogin) ? (
        <LoginBox onHandleIsLogin={handleIsLogin} />
    ) : (
        <div>
            <h1>{`Welcome to ChatBox, ${username}!`}</h1>
            {username !== "Admin" 
            ? <ChatBox username={username}></ChatBox>
            : <Admin></Admin>
            }
            
        </div>
    )
}

export default Home;