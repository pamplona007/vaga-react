import { Button, Form, Image, Input } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import loginImg from '../images/login-img.svg'


const Login = () => {
    return (
        <div className='login-page'>
            <div className='login-card'>
                <div className='login-img-wrapper'>
                    <img src={loginImg} />
                </div>
                <div className='login-form-wrapper'>
                    <Form layout="vertical">
                        <Form.Item label="Nome de usuário" name="username">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Senha" name="password">
                            <Input type='password'/>
                        </Form.Item>
                        <Form.Item>
                            <Link to="app"><Button htmlType="submit" type='primary'>Entrar</Button></Link>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Login
