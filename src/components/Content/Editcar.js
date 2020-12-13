import React from 'react';
import firebase from 'firebase';
import { Modal, Button, Row, Col, Divider, Input, Form, Upload, Spin, message, Card } from 'antd'
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../util/firebaseUtils';
import { v4 as uuidv4 } from 'uuid';
import { DeleteOutlined } from '@ant-design/icons'
import ReactInputMask from 'react-input-mask';

const Editcar = () => {
    const params = useParams();
    const [ car, setCar ] = React.useState(null);
    const [ files, setFiles ] = React.useState([]);
    const [ uploadedFiles, setUploadedFiles ] = React.useState([]);
    const [ loading, setLoading ] = React.useState(false);
    const [ reload, setReload ] = React.useState('');
    const [ form ] = Form.useForm();
    const navigate = useNavigate();
    const { confirm } = Modal;
    const uploadButton = (
        <div>
            <div className="ant-upload-text">Upload</div>
        </div>
    );
    
    function showDeleteConfirm(id) {
        confirm({
            title: 'Realmente deseja deletar este arquivo?',
            okText: 'Deletar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                return deleteImg(id);
            },
        });
    }

    function deleteImg(id) {
        return new Promise((resolve, reject) => {
            db.collection("cars").doc(params.id).update({
                images: firebase.firestore.FieldValue.arrayRemove(id)
            }).then(() => {
                console.log("Document successfully deleted!");
                setReload(Math.random())
                resolve(true)
            }).catch((error) => {
                console.error("Error removing document: ", error);
                reject(true)
            });
        }).catch(() => console.log('Oops errors!'));
    }

    async function getImgRef(img) {
        const storageRef = firebase.storage().ref();
        const imgRef = storageRef.child(`images/${img}.png`)
        let link;
        await imgRef.getDownloadURL()
            .then(url => {
                link = url;
            })
        return link;
    }

    async function getImages(imgArray) {
        let uris = []
        for (const img of imgArray) {
            await getImgRef(img).then(result => {
                uris.push({
                    img: img,
                    url:result
                })
            })
        }
        return uris
    }

    const onFinish = values => {
        if (files.length === 0) {
            message.error('Adicione pelo menos uma imagem!');
            return
        }
        setLoading(true)
        files.forEach(file => {
            const storageRef = firebase.storage().ref();
            const imageName = `${values.brand}-${values.model}-${uuidv4()}`;
            const imgFile = storageRef.child(`images/${imageName}.png`);
            try {
                const image = imgFile.put(file);
                db.collection('cars').doc(params.id).update({
                    images: firebase.firestore.FieldValue.arrayUnion(imageName)
                }).then((response) => {
                    console.log(response);
                }).catch((error) => console.log(error))    
            } catch(e) {
            }
        });
        console.log('Salvando dados ' + values);
        db.collection('cars').doc(params.id).update(values)
            .then((response) => {
                console.log(response);
                setLoading(false)
                navigate('/app/admin');
            })
            .catch((error) => console.log(error))
    };
    
    React.useEffect(() => {
        setLoading(true)
        db.collection('cars').doc(params.id).get()
            .then((response) => {
                setCar(response.data())
                getImages(response.data().images).then(result => {
                    setUploadedFiles(result)
                })
                setLoading(false)
            })
            .catch(error => {
                console.log('Erro ao recuperar informações '+error);
            })
    }, [reload, params.id])

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
            <Spin spinning={loading}>
            <Row gutter={16}>
                {uploadedFiles && (
                    uploadedFiles.map((item, index) => (
                        <Col xs={12} sm={12} md={8} lg={6} xl={6}>
                            <Card
                                bodyStyle={{
                                    backgroundImage: `Url(${item.url})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    height: '220px',
                                }}
                                actions={[
                                    <DeleteOutlined key="delete" onClick={() => showDeleteConfirm(item.img)} />,
                                ]}
                            />
                        </Col>
                    ))
                )}
            </Row>
            <Divider />
            <Row>
                <Col span={24}>
                    <Upload
                        name="car"
                        listType="picture-card"
                        className="car-uploader"
                        beforeUpload={file => {
                            setFiles(() => [...files, file]);
                            return false;            
                        }}
                        onRemove= {file => {
                            console.log(file);
                            return new Promise((resolve, reject) => {
                                confirm({
                                    title: 'Tem certeza que deseja deletar este arquivo?',
                                    onOk: () => {
                                        let array = files;
                                        switch (true) {
                                            case (array.indexOf(file) > -1):
                                                array.splice(array.indexOf(file), 1);
                                                setFiles(array);
                                                console.log(files);    
                                                break;
                                            case (array.indexOf(file.originFileObj) > -1):
                                                array.splice(array.indexOf(file.originFileObj), 1);
                                                setFiles(array);
                                                console.log(files);    
                                                break;
                                            default :
                                                resolve(false);
                                                return;
                                        }
                                        resolve(true);
                                    },
                                })
                            })
                        }}

                        >
                        {uploadButton}
                    </Upload>
                    <Divider />
                    <Form 
                        layout='vertical' 
                        form={form} 
                        name="control-hooks" 
                        onFinish={onFinish}
                        requiredMark='optional'
                    >
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item label="Marca" name="brand" rules={[{ required: true }]}>
                                    <Input placeholder="Qual a marca do carro?" />
                                </Form.Item>
                                <Form.Item label="Ano" name="year" rules={[{ required: true }]}>
                                    <Input placeholder="Em que ano ele foi lançado?" />
                                </Form.Item>
                                <Form.Item label="Placa" name="plate" rules={[{ required: true }]}>
                                    <ReactInputMask mask="aaa-*999" maskChar='' alwaysShowMask={false}>
                                        {() => <Input placeholder="Qual a placa do carro?" />}
                                    </ReactInputMask>
                                </Form.Item>
                                <Form.Item label="Quilometragem" name="distance" rules={[{ required: true }]}>
                                    <Input type='number' placeholder="Quantos quimômetros o carro possui?" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Enviar
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item label="Modelo" name="model" rules={[{ required: true }]}>
                                    <Input placeholder="E qual o modelo?" />
                                </Form.Item>
                                <Form.Item label="Cor" name="color" rules={[{ required: true }]}>
                                    <Input placeholder="Qual a cor do carro?" />
                                </Form.Item>
                                <Form.Item label="Cidade" name="city" rules={[{ required: true }]}>
                                    <Input placeholder="Em que cidade ele foi emplacado?" />
                                </Form.Item>
                                <Form.Item label="Preço" name="price" rules={[{ required: true }]}>
                                    <Input type='number' placeholder="Qual o preço que deste carro?" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            </Spin>
        </>
    )
}

export default Editcar
