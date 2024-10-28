import React from 'react';
import { Button } from 'antd';

function Settings() {
    const clickHandler = () => {
        let newUsername = '';
        newUsername = prompt("Enter a new username");
        localStorage.setItem("userInfo", JSON.stringify({username: newUsername}));
    }

    return (
        <div>
            <h1>Settings</h1>
            <Button onClick={clickHandler}>Reset the username</Button>
        </div>
    )
}

export default Settings;