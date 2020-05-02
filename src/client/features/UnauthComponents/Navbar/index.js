import React from 'react';
import { Link } from 'react-router-dom';

import './navbar.scss';
import logo from '../../../images/logo-medium.png';

const NavBar = () => (
  <nav>
    <Link to="/">
      <div class='logo-container'>
        <img src={logo} alt='Polyglotist' />
      </div>
    </Link>
    <div class='auth-container'>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </div>
  </nav>
);

export default NavBar;
