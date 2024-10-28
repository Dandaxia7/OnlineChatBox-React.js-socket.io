import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home'
import Settings from './Settings'
import Play from './Play'

const { Header, Content, Footer } = Layout;

const items = [
    {key: '', label: 'Home'},
    {key: 'play', label: 'Play'},
    {key: 'settings', label: 'Settings'},
];

function MainLayout() {

    const navigate = useNavigate()

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const onClick = (e) => {
        navigate(e.key, { replace: true })
      }

    return (
        <Layout>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['']}
                    items={items}
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                    onClick={onClick}
                />
            </Header>
            <Content
                style={{
                    padding: '0 48px',
                }}
            >
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 850,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Home/>}></Route>
                        <Route path="/play" element={<Play/>}></Route>
                        <Route path="/settings" element={<Settings/>}></Route>
                    </Routes>
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Liar's Bar ©{new Date().getFullYear()} Created by Sin7
            </Footer>
        </Layout>
    );
}

export default MainLayout;
