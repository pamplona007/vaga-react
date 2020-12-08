import { Col, Row } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Nav from './Nav'

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <Row>
                <Col span={4}>
                    <Nav />
                </Col>
                <Col span={20}>
                    <Outlet />
                </Col>
            </Row>
        </>
    )
}

export default Layout
