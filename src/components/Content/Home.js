import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <>
            <h1>Administração</h1>
            <Link to="novo"><button>Novo</button></Link>
        </>
    )
}

export default Home
