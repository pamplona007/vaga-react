import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import notFoundImg from '../../images/404.svg'

const NotFound = () => {
    return (
        <div className='nf-page'>
            <div className='nf-wrapper'>
                <div className='nf-img-wrapper'>
                    <img src={notFoundImg} />
                </div>
                <div className='nf-form-wrapper'>
                    <Link to="/"><Button type='primary'>Me mande de volta!</Button></Link>
                </div>
            </div>
        </div>
    )
}

export default NotFound
