import { Col, Row } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Nav from './Nav'

const Layout = ({ children }) => {
    return (
        <>
            <Row>
                <Col span={4} className="main-menu">
                    <Nav />
                </Col>
                <Col span={20} offset={4} className="main-content">
                    <Header />
                    <Outlet />
                </Col>
            </Row>
        </>
    )
}

export default Layout
