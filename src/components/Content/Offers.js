import React from 'react'
import firebase from 'firebase'
import { Button, Row, Col, Divider, Space, Spin, List, Card, Radio } from 'antd'
import { Link } from 'react-router-dom'
import { db } from '../../util/firebaseUtils'
import { EyeOutlined, ReloadOutlined, UnorderedListOutlined, TableOutlined } from '@ant-design/icons';

const Offers = () => {
    const [ cars, setCars ] = React.useState([])
    const [ loading, setLoading ] = React.useState(false)
    const [ reload, setReload ] = React.useState('')
    const [ layout, setLayout ] = React.useState(0)
    const { Meta } = Card;
    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );
    
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

    function changeLayout(e) {
        switch (e.target.value) {
            case 'list':
                setLayout(0)
                localStorage.setItem('layout', 0)
                break;
            case 'grid':
                setLayout(1)               
                localStorage.setItem('layout', 1)
                break;
            default :
                console.log('Não temos esse layout ;v');
                break;
        }
    }

    React.useEffect(() => {
        getCarData()
        if (localStorage.getItem('layout')) {
            setLayout(Number(localStorage.getItem('layout')))
        }
    }, [reload])

    const grid = layout ? {
        grid: {
            gutter: 0,
            column: 4,
        }
    } : ''

    return (
        <>
            <Row>
                <Col span={24}>
                    <h1>Ofertas</h1>
                </Col>
            </Row>
            <Divider />
            <Row gutter={[0,16]}>
                <Col span={24} className={'controls'}>
                    <Space>
                        <Radio.Group onChange={changeLayout} value={layout ? 'grid' : 'list'}>
                            <Radio.Button value='grid'><TableOutlined /></Radio.Button>
                            <Radio.Button value='list'><UnorderedListOutlined /></Radio.Button>
                        </Radio.Group>

                        <Button type="secondary" shape="circle" icon={<ReloadOutlined />} onClick={() => setReload(Math.random())} />
                    </Space>
                </Col>
                <Col span={24}>
                    <Spin spinning={loading}>
                        <List 
                            itemLayout="vertical"
                            size="large"
                            {...grid}
                            dataSource={cars}
                            pagination={{
                                pageSize: 10,
                            }}
                            renderItem={item => (
                                <List.Item 
                                    key={item.key}
                                    extra={layout ? '' : <Link to={`${item.key}`}><div className={layout ? 'img-avatar grid' : 'img-avatar'} style={{ backgroundImage: "url(" + item.avatar + ")" }}></div></Link>}
                                    actions={layout ? [] : [<IconText icon={EyeOutlined} text={item.views} key="views-number" />]}
                                >
                                    {layout ? (
                                        <Link to={`${item.key}`}>
                                            <Card 
                                                size='small'
                                                hoverable
                                                cover={<img alt="example" src={item.avatar} />}
                                                actions={[<IconText icon={EyeOutlined} text={item.views} key="views-number" />]}
                                            >
                                                <Meta title={item.model} description={item.price} />
                                                <p></p>
                                            </Card>
                                        </Link>
                                    ) : (
                                        <List.Item.Meta title={<Link to={`${item.key}`}>{`${item.model}`}</Link>} description={item.price}/>
                                    )}
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

