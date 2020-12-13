import { Table, Modal, Button, Row, Col, Divider, Space, Spin } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../util/firebaseUtils'
import { ReloadOutlined } from '@ant-design/icons';


const Home = () => {
    const [cars, setCars] = React.useState(null)
    const [reload, setReload] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const { confirm } = Modal;

    function showDeleteConfirm(id, model) {
        confirm({
            title: 'Realmente deseja deletar?',
            content: 'Você está deletando um ' + model,
            okText: 'Deletar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                return deleteCar(id);
            },
        });
    }

    function deleteCar(id) {
        return new Promise((resolve, reject) => {
            db.collection("cars").doc(id).delete()
                .then(function() {
                    console.log("Document successfully deleted!");
                    setReload(Math.random()) // Reload the table only after delete
                    resolve(true)
                })
                .catch(function(error) {
                    console.error("Error removing document: ", error);
                    setReload(Math.random())
                    reject(true)
                });
        }).catch(() => console.log('Oops errors!'));
    }

    function getCarData() {
        setLoading(true)
        db.collection('cars').get()
        .then(response => {
            let data = []
            response.docs.forEach((car, index) => {
                let carData = car.data()
                let creationDate = new Date(carData.created.toMillis()).toLocaleDateString()
                let toTable = {
                    key: `${response.docs[index].id}`,
                    model: `${carData.brand}, ${carData.model}`,
                    register: `${creationDate}`,
                    price: `R$ ${carData.price}`
                }
                data.push(toTable);
                setLoading(false)
            });
            console.log(data);
            setCars(data)
        })
        .catch(error => console.log(error))
    }
    
    const columns = [
        {
            title: 'Marca, modelo',
            dataIndex: 'model',
            key: 'model',
            render: (text, record) => (
                <Link to={`/app/${record.key}`}>{text}</Link>
            )
        },
        {
            title: 'Criado em',
            dataIndex: 'register',
            key: 'register',
        },
        {
            title: 'Preço',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: "Ações",
            key:"actions",
            render: (text, record) => (
                <>
                    <Space>
                        <Link to={`editar/${record.key}`}><Button type="secondary" >Editar</Button></Link>
                        <Button type="secondary" onClick={() => showDeleteConfirm(record.key, record.model)}>Deletar</Button>
                    </Space>
                </>
            )
        }
    ]    

    React.useEffect(() => getCarData(), [reload])

    return (
        <>
            <Row>
                <Col span={24}>
                    <h1>Administração</h1>
                </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 24]}>
                <Col sm={24} md={12}>
                    <Link to="novo"><Button type="primary">Adicionar Carro</Button></Link>
                </Col>
                <Col sm={24} md={12} className={'controls'}>
                    <Button type="secondary" shape="circle" icon={<ReloadOutlined />} onClick={() => setReload(Math.random())} />
                </Col>
            </Row>
            <Row gutter={[16, 24]}>
                <Col span={24}>
                    <Spin spinning={loading}>
                        <Table columns={columns} dataSource={cars} />
                    </Spin>
                </Col>
            </Row>
        </>
    )
}

export default Home