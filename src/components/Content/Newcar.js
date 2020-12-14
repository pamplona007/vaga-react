import React from 'react'
import firebase from 'firebase';
import { Modal, Form, Button, Divider, Input, Upload, message, Row, Col, Spin } from 'antd'
import { db } from '../../util/firebaseUtils'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import ReactInputMask from 'react-input-mask';

const Newcar = () => {
    const [ loading, setLoading ] = React.useState(false);
    const [ files, setFiles ] = React.useState([]);
    const navigate = useNavigate();
    const { confirm } = Modal;
    const uploadButton = (
        <div>
            <div className="ant-upload-text">Upload</div>
        </div>
    );
            

    
    const onFinish = values => {
        if (files.length === 0) {
            message.error('Adicione pelo menos uma imagem!');
            return
        }
        setLoading(true)
        values.images = [];
        values.created = firebase.firestore.FieldValue.serverTimestamp();
        values.views = 0;
        values.plate = values.plate.toUpperCase()
        files.forEach(file => {
            const storageRef = firebase.storage().ref();
            const imageName = `${values.brand}-${values.model}-${uuidv4()}`;
            const imgFile = storageRef.child(`images/${imageName}.png`);
            try {
                const image = imgFile.put(file);
                values.images.push(imageName);
            } catch(e) {
            }
        });      
        db.collection('cars').add(values)
            .then(response => {
                setLoading(false);
                navigate('/app/admin');
            })
            .catch((error) => {
                setLoading(false);
                message.error('Houve um erro, tente novamente mais tarde');
                console.log(error);
            })
    };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };


    return (
        <>
            <Row>
                <Col>
                    <h1>Novo Carro</h1>
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={24}>
                    <Spin spinning={loading}>
                        <Upload
                            name="car"
                            listType="picture-card"
                            className="car-uploader"
                            beforeUpload={file => {
                                setFiles(() => [...files, file]);
                                return false;            
                            }}
                            onRemove= {file => {
                                return new Promise((resolve, reject) => {
                                    confirm({
                                        title: 'Tem certeza que deseja deletar este arquivo?',
                                        onOk: () => {
                                            let array = files;
                                            if (array.indexOf(file.originFileObj) > -1) {
                                                array.splice(array.indexOf(file.originFileObj), 1);
                                                setFiles(array);
                                            }
                                            resolve(true);
                                        },
                                    })
                                })
                            }}
                            // onChange={handleChange}
                            // customRequest={customUpload}
                            >
                            {uploadButton}
                        </Upload>
                        <Divider />
                        <Form 
                            name="newCarForm" 
                            onFinish={onFinish} 
                            onFinishFailed={onFinishFailed} 
                            layout="vertical" 
                            requiredMark='optional'
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item label="Marca" name="brand" rules={[{ required: true }]}>
                                        <Input placeholder="Qual a marca do carro?" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item label="Modelo" name="model" rules={[{ required: true }]}>
                                        <Input placeholder="E qual o modelo?" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item label="Ano" name="year" rules={[{ required: true }]}>
                                        <Input placeholder="Em que ano ele foi lançado?" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item label="Cor" name="color" rules={[{ required: true }]}>
                                        <Input placeholder="Qual a cor do carro?" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item label="Placa" name="plate" rules={[{ required: true }]}>
                                        <ReactInputMask mask="aaa-*999" maskChar='' alwaysShowMask={false}>
                                        {() => <Input placeholder="Qual a placa do carro?" />}
                                        </ReactInputMask>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item label="Cidade" name="city" rules={[{ required: true }]}>
                                        <Input placeholder="Em que cidade ele foi emplacado?" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item label="Quilometragem" name="distance" rules={[{ required: true }]}>
                                        <Input type='number' placeholder="Quantos quimômetros o carro possui?" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item label="Preço" name="price" rules={[{ required: true }]}>
                                        <Input type='number' placeholder="Qual o preço que deste carro?" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Enviar
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </>
    )
}

export default Newcar