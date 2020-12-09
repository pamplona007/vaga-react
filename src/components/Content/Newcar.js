import { Form, Button, Divider, Input, InputNumber } from 'antd'
import React from 'react'
import { db } from '../../util/firebaseUtils'


const Newcar = () => {
    
    const onFinish = values => {
        console.log('Salvando dados ' + values);
        db.collection('cars').add(values)
            .then((response) => console.log(response))
            .catch((error) => console.log(error))
    };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <h1>Novo Carro</h1>
            <Divider />
            <Form name="newCarForm" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Form.Item label="Marca" name="brand" rules={[{ required: true }]}>
                    <Input placeholder="Qual a marca do carro?" />
                </Form.Item>
                <Form.Item label="Modelo" name="model" rules={[{ required: true }]}>
                    <Input placeholder="E qual o modelo?" />
                </Form.Item>
                <Form.Item label="Ano" name="year" rules={[{ required: true }]}>
                    <Input placeholder="Em que ano ele foi lançado?" />
                </Form.Item>
                <Divider />
                <Form.Item label="Cor" name="color" rules={[{ required: true }]}>
                    <Input placeholder="Qual a cor do carro?" />
                </Form.Item>
                <Form.Item label="Placa" name="plate" rules={[{ required: true }]}>
                    <Input placeholder="Qual a placa do carro?" />
                </Form.Item>
                <Form.Item label="Cidade" name="city" rules={[{ required: true }]}>
                    <Input placeholder="Em que cidade ele foi emplacado?" />
                </Form.Item>
                <Divider />
                <Form.Item label="Quilometragem" name="distance" rules={[{ required: true }]}>
                    <Input placeholder="Quantos quimômetros o carro possui?" />
                </Form.Item>
                <Form.Item label="Data de cadastro" name="register-date" rules={[{ required: true }]}>
                    <Input placeholder="Data de cadastro no sistema, tornar automático" />
                </Form.Item>
                <Form.Item label="Preço" name="price" rules={[{ required: true }]}>
                    <Input placeholder="Qual o preço que deste carro?" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Enviar
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default Newcar
