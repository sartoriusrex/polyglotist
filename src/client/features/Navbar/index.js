import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout, authSelector } from '../../slices/auth';

import './navbar.scss';
import Logo from '../../images/Logo';

const Nav = (props) => {
  const { landingPage, children } = props;
  const [isTop, setIsTop] = useState(true);
  const positionThreshold = 20;

  useEffect(() => {
    if( landingPage ) {
      document.addEventListener('scroll', () => {
        const scrollCheck = window.scrollY < positionThreshold;
        if (scrollCheck !== scroll) {
          setIsTop(scrollCheck);
        }
      });
    }
  });

  if (landingPage ) {
    return (
      <nav className={isTop ? 'nav-top' : 'nav-top nav-green'}>
        <Link to='/'>
          <div className='logo-container' tabIndex='0'>
            <Logo landingStyle={isTop} />
          </div>
        </Link>
        {children}
      </nav>
    )
  }

  return (
    <nav className='nav-top nav-green'>
      <Link to='/'>
        <div className='logo-container' tabIndex='0'>
          <Logo />
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

const NavBar = ({history}) => {
  const { user } = useSelector(authSelector);
  const isHome = history.location.pathname === '/';

  if (user) {
    return(
      <Nav>
        <AuthNav user={user}/>
      </Nav>
    )
  } else if (isHome) {
    return (
      <Nav landingPage>
        <UnAuthNav />
      </Nav>
    )
  } else {
    return (
      <Nav>
        <UnAuthNav />
      </Nav>
    )
  }
};

export default NavBar;
