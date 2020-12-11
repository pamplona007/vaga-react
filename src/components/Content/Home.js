import { Table, Modal, Button, Row, Col, Divider, Space } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../util/firebaseUtils'

const { confirm } = Modal;

const Home = () => {

    const [cars, setCars] = React.useState(null)
    const [reload, setReload] = React.useState('')

    function showDeleteConfirm(id, model) {
        confirm({
            title: 'Realmente deseja deletar?',
            content: 'Você está deletando um ' + model,
            okText: 'Deletar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                db.collection("cars").doc(id).delete()
                    .then(function() {
                        console.log("Document successfully deleted!");
                    })
                    .catch(function(error) {
                        console.error("Error removing document: ", error);
                    });
                setReload(Math.random())
            },
            // onCancel() {
            // },
        });
    }
    
    const columns = [
        {
            title: 'Marca, modelo',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'Ano',
            dataIndex: 'year',
            key: 'year',
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

    React.useEffect(() => {
        db.collection('cars').get()
            .then(response => {
                let data = []
                response.docs.forEach((car, index) => {
                    let carData = car.data()
                    let toTable = {
                        key: `${response.docs[index].id}`,
                        model: `${carData.brand}, ${carData.model}`,
                        year: `${carData.year}`,
                        price: `R$ ${carData.price}`
                    }
                    data.push(toTable);
                });
                setCars(data)
            })
    }, [reload])

    return (
        <>
            <Row>
                <Col span={24}>
                    <h1>Administração</h1>
                </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 24]}>
                <Col>
                    <Link to="novo"><Button type="primary">Adicionar Carro</Button></Link>
                </Col>
            </Row>
            <Row gutter={[16, 24]}>
                <Col span={24}>
                    <Table columns={columns} dataSource={cars} />
                </Col>
            </Row>
        </>
    )
}

export default Home