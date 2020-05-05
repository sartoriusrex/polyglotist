import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './navbar.scss';
import LogoLight from '../../../images/logo.svg';
import LogoDark from '../../../images/logo-dark.svg';

const NavBar = () => {
  const [isTop, setIsTop] = useState(true);
  const positionThreshold = 20;

  useEffect(() => {
    document.addEventListener('scroll', () => {
      const scrollCheck = window.scrollY < positionThreshold;
      if (scrollCheck !== scroll) {
        setIsTop(scrollCheck);
      }
    });
  });

  return (
    <nav className={isTop ? 'nav-top' : 'nav-top nav-scroll'}>
      <Link to='/'>
        <div className='logo-container' tabIndex='0'>
          <LogoLight className={isTop ? 'svg-visible' : 'svg-invisible'} />
          <LogoDark className={isTop ? 'svg-invisible' : 'svg-visible'} />
        </div>
      </Link>
      <div className='auth-container'>
        <Link to='/login'>Login</Link>
        <Link to='/signup'>Signup</Link>
      </div>
    </nav>
  );
};

export default NavBar;
