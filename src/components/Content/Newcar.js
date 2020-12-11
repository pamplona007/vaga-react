import { Form, Button, Divider, Input, Upload, message } from 'antd'
import React from 'react'
import { db } from '../../util/firebaseUtils'
import firebase from 'firebase';


const Newcar = () => {

    const [ loading, setLoad ] = React.useState(false);
    const [ imageUrl, setimageUrl ] = React.useState('');
    const [ files, setFiles ] = React.useState([]);

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
            
    const customUpload = ({ onError, onSuccess, file }) => {
        const storage = firebase.storage();
        const metadata = {
            contentType: 'image/jpeg'
        }
        const storageRef = storage.ref();
        const imageName = Math.floor(Math.random() * 1000);
        const imgFile = storageRef.child(`images/${imageName}.png`);
        try {
            const image = imgFile.put(file, metadata);
            onSuccess(null, image);
        } catch(e) {
            onError(e);
        }
    };

    const uploadButton = (
        <div>
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    
    const onFinish = values => {
        console.log(values);
        // files.forEach(file => {
        //     const storage = firebase.storage();
        //     const metadata = {
        //         contentType: 'image/jpeg'
        //     }
        //     const storageRef = storage.ref();
        //     const imageName = Math.floor(Math.random() * 10000000);
        //     const imgFile = storageRef.child(`images/${imageName}.png`);
        //     try {
        //         const image = imgFile.put(file, metadata);
        //     } catch(e) {
        //     }
        // });      
        // db.collection('cars').add(values)
        //     .then((response) => console.log(response))
        //     .catch((error) => console.log(error))
    };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    let storageRef = firebase.storage().ref();
    console.log(storageRef);


    return (
        <>
            <h1>Novo Carro</h1>
            <Divider />
            <Upload
                name="car"
                listType="picture-card"
                className="car-uploader"
                beforeUpload={file => {
                    setFiles(() => [...files, file]);
                    return false;            
                }}
                // onChange={handleChange}
                // customRequest={customUpload}
                >
                {imageUrl ? <img src={imageUrl} alt="car" /> : uploadButton}
            </Upload>
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