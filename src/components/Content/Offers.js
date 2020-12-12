import React from 'react'
import firebase from 'firebase'
import { Modal, Button, Row, Col, Divider, Space, Spin, List, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import { db } from '../../util/firebaseUtils'
import { EyeOutlined } from '@ant-design/icons';


const IconText = ({ icon, text }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const Offers = () => {
    const [cars, setCars] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [reload, setReload] = React.useState('')
    
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

    async function getCarData() {
        setLoading(true)
        let data = []
        let rawCars;

        await db.collection('cars').get()
            .then(response => {
                rawCars = response;
        })

        let i = 0
        for (const car of rawCars.docs) {
            let img;
            let carData = car.data()
            await getImgRef(carData.images[0]).then(result => {
                let toTable = {
                    key: `${rawCars.docs[i].id}`,
                    model: `${carData.brand}, ${carData.model}`,
                    year: `${carData.year}`,
                    price: `R$ ${carData.price}`,
                    avatar: result,
                    views: carData.views
                }    
                data.push(toTable);
            })
            i++
        }
        
        setCars(data)
        setLoading(false)
    }

    React.useEffect(() => getCarData(), [reload])



    return (
        <>
            <Row>
                <Col span={24}>
                    <h1>Ofertas</h1>
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={24}>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Spin spinning={loading}>
                        <List 
                            itemLayout="vertical"
                            size="large"
                            dataSource={cars}
                            pagination={{
                                pageSize: 10,
                            }}
                            renderItem={item => (
                                <List.Item 
                                    key={item.key} 
                                    extra={<div className="img-avatar" style={{ backgroundImage: "url(" + item.avatar + ")" }}></div>}
                                    actions={[<IconText icon={EyeOutlined} text={item.views} key="views-number" />]}
                                >
                                    <List.Item.Meta
                                        title={<Link to={`${item.key}`}>{`${item.model}`}</Link>}
                                        description={item.price}
                                    />
                                </List.Item>
                            )}
                        />
                    </Spin>
                </Col>
            </Row>
        </>
    )
}

export default Offers

