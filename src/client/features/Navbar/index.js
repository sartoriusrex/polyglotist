import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout, authSelector } from '../../slices/auth';

import './navbar.scss';
import Logo from '../../images/Logo';

const Nav = ({children}) => {
  const positionThreshold = 20;
  const root = window.location.pathname === '/';
  const [isHome, setIsHome] = useState(root);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    if( isHome ) {
      document.addEventListener('scroll', () => {
        const scrollCheck = window.scrollY < positionThreshold;
        if (scrollCheck !== scroll) {
          setIsTop(scrollCheck);
        }
      });
    }

    document.addEventListener('click', () => {
      const { pathname } = window.location;

      if (pathname !== '/' && isHome === true) setIsHome(false);
      if (pathname === '/' && isHome === false) setIsHome(true);
    });
  });

  return (
    <nav className={(isTop && isHome) ? 'nav-top' : 'nav-top nav-green'}>
      <Link to='/'>
        <div className='logo-container' tabIndex='0'>
          <Logo landingStyle={isTop && isHome} />
        </div>
      </Link>
      {children}
    </nav>
  )
}

const UnAuthNav = () => {
  return(
    <div className='auth-container'>
      <Link to='/login'>Login</Link>
      <Link to='/signup'>Signup</Link>
    </div>
  )
}

const AuthNav = (user) => {
  const { username } = user;
  const dispatch = useDispatch();

  function onLogoutClick() {
    dispatch(logout());
  }

  return (
    <ul>
      <li>{username}</li>
      <li>
        <button onClick={onLogoutClick}>
          Logout
        </button>
      </li>
      <li>
        <Link to={`/${username}/dashboard`}>
          Dashboard
        </Link>
      </li>
      <li>
        <Link to={`/${username}/words`}>
          Word Bank
        </Link>
      </li>
      <li>
        <Link to={`/${username}/articles`}>
          Articles
        </Link>
      </li>
      <li>
        <Link to={`/${username}/practice`}>
          Practice
        </Link>
      </li>
      <li>
        <Link to={`/${username}/settings`}>
          Settings & Preferences
        </Link>
      </li>
      <li>
        <Link to={`/${username}/create_settings`}>
          Create Settings & Preferences
        </Link>
      </li>
    </ul>
  )
}

const NavBar = () => {
  const { user } = useSelector(authSelector);

  return(
    <Nav >
      { user ? <AuthNav user={user} /> : <UnAuthNav /> }
    </Nav>
  )
};

export default NavBar;
