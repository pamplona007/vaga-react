import React from 'react'
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';


const Nav = () => {

  return (
    <Menu mode="inline" style={{ height: '100%', }}>
      <Menu.Item key="2"><NavLink to="">Ofertas</NavLink></Menu.Item>
      <Menu.Item key="1"><NavLink to="admin">Administração</NavLink></Menu.Item>
    </Menu>
  );
};

export default Nav
