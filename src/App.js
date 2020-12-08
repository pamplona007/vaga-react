import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Content/Home'
import Newcar from './components/Content/Newcar'
import Offers from './components/Content/Offers';
import Singlecar from './components/Content/Singlecar';
import Layout from './components/Layout/Layout';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="app/*" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="novo" element={<Newcar />} />
          <Route path="ofertas">
            <Route path="/" element={<Offers />} />
            <Route path="/:id" element={<Singlecar />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>      
  )
}

export default App