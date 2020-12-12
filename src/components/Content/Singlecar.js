import React from 'react'
import firebase from 'firebase';
import { useParams } from 'react-router-dom';
import { db } from '../../util/firebaseUtils';
import { Carousel, Col, Descriptions, Image, Row, Typography } from 'antd';

const { Title } = Typography;


const Singlecar = () => {
    const params = useParams();
    const [ car, setCar ] = React.useState(null)
    const [ images, setImages ] = React.useState([]);
    const [ loading, setLoading] = React.useState(false);
    const uploadButton = (
        <div>
            <div className="ant-upload-text">Upload</div>
        </div>
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
            
    async function getImages(imgArray) {
        let uris = []
        for (const img of imgArray) {
            await getImgRef(img).then(result => {
                uris.push(result)
            })
        }
        setImages(uris)
    }

    React.useEffect(() => {
        setLoading(true)
        db.collection('cars').doc(params.id).get()
            .then(response => {
                setCar(response.data())
                getImages(response.data().images)
                db.collection('cars').doc(params.id).update({
                    views: response.data().views + 1
                })
            })
            .catch(error => {
                console.log('Erro ao recuperar informações '+error);
            })
    }, [])

    const contentStyle = {
        height: '450px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
    };

    return (
        <> 
            <Row gutter={[30, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col span={24}>
                    <Carousel autoplay>
                        {images.map((item, index) => (
                            <div className='car-carrousel'><Image width='100%' className='car-img' src={item} /></div>
                        ))}
                    </Carousel>
                </Col>
            </Row>
            <Row gutter={[30, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
                <Col>
                    {car && (
                        <>
                            <Title>{car && car.brand}, {car && car.model}</Title>
                            <Descriptions title={`R$ ${car.price}`}>
                                <Descriptions.Item label="Ano">{car.year}</Descriptions.Item>
                                <Descriptions.Item label="Cor">{car.color}</Descriptions.Item>
                                <Descriptions.Item label="Cidade">{car.city}</Descriptions.Item>
                                <Descriptions.Item label="Quilometragem">{car.distance}</Descriptions.Item>
                            </Descriptions>
                        </>    
                    )}
                </Col>
            </Row>
        </>
  )
}

export default Singlecar

