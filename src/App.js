import React from 'react'
import { Row, Col } from 'antd';
import Header from './components/Layout/Header'
import Nav from './components/Layout/Nav'

const App = () => {
  return (
    <>
      <Header />
      <Row>
        <Col span={6} className={'main-menu'}>
          <Nav />
        </Col>
        <Col span={18}>
          
        </Col>
      </Row>
    </>
  )
}

export default App