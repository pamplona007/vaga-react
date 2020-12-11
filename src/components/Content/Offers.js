import React from 'react'
import { Upload, Modal, Button, Row, Col, Divider, Space } from 'antd'
import { Link } from 'react-router-dom'
import { db } from '../../util/firebaseUtils'

const Offers = () => {
    const [cars, setCars] = React.useState(null)
    
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
    }, [])

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
        </>
    )
}

export default Offers

