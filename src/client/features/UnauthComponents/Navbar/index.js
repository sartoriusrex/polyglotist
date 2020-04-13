import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav>
    <div>
      <Link to="/">Logo</Link>
    </div>
    <Link to="/about">About</Link>
    <Link to="/features">Features</Link>
    <Link to="/login">Login</Link>
    <Link to="/signup">Signup</Link>
  </nav>
);

export default NavBar;
