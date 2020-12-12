import React from 'react';
import firebase from 'firebase';
import { Modal, Button, Row, Col, Divider, Input, Form, Upload, Spin } from 'antd'
import { useParams } from 'react-router-dom';
import { db } from '../../util/firebaseUtils';
import { v4 as uuidv4 } from 'uuid';


const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};
  const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};
  
const Editcar = () => {
    const params = useParams();
    const [ car, setCar ] = React.useState(null)
    const [ imageUrl, setimageUrl ] = React.useState('');
    const [ files, setFiles ] = React.useState([]);
    const [ loading, setLoading] = React.useState(false);
    const uploadButton = (
        <div>
            <div className="ant-upload-text">Upload</div>
        </div>
    );
    const [form] = Form.useForm();

    const onFinish = values => {
        values.images = [];
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
        console.log('Salvando dados ' + values);
        db.collection('cars').doc(params.id).update(values)
            .then((response) => console.log(response))
            .catch((error) => console.log(error))
    };

    React.useEffect(() => {
        setLoading(true)
        db.collection('cars').doc(params.id).get()
            .then(response => {
                setCar(response.data())
                setLoading(false)
            })
            .catch(error => {
                console.log('Erro ao recuperar informações '+error);
            })
    }, [])

    if (car) {
        form.setFieldsValue({
            brand: `${car.brand}`,
            model: `${car.model}`,
            year: `${car.year}`,
            color: `${car.color}`,
            plate: `${car.plate}`,
            city: `${car.city}`,
            distance: `${car.distance}`,
            price: `${car.price}`,
        });        
    }

    return (
        <>
            <Row>
                <Col>
                    <h1>Editando carro</h1>
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
                            >
                            {imageUrl ? <img src={imageUrl} alt="car" /> : uploadButton}
                        </Upload>
                        <Divider />
                        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
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
                            <Form.Item label="Preço" name="price" rules={[{ required: true }]}>
                                <Input placeholder="Qual o preço que deste carro?" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Enviar
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </>
    )
}

export default Editcar
