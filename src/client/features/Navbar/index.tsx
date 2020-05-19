import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import throttle from 'lodash.throttle';

import { logout, authSelector } from '../../slices/auth';

import styles from './navbar.module.scss';
import Logo from '../../images/Logo';
import ChevronUp from '../../images/ChevronUp';

const Nav = (props: any) => {
  const { children } = props;
  const { user } = props;
  const positionThreshold = 20;
  const root = window.location.pathname === '/';
  const [isHome, setIsHome] = useState(root);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    function listenScroll(): void {
      const scrollCheck = window.scrollY < positionThreshold;
      if ((scrollCheck && !isTop) || (!scrollCheck && isTop))
        setIsTop(scrollCheck);
    }

    function listenLocation(): void {
      const { pathname } = window.location;
      if (
        (pathname !== '/' && isHome === true) ||
        (pathname === '/' && isHome === false)
      )
        setIsHome(!isHome);
    }

    if (isHome)
      document.addEventListener(
        'scroll',
        throttle(() => listenScroll(), 250)
      );

    document.addEventListener('click', listenLocation);

    return () => {
      if (isHome) document.removeEventListener('scroll', listenScroll);
      document.removeEventListener('click', listenLocation);
    };
  }, [isTop, isHome]);

  return (
    <nav
      className={
        isTop && isHome ? styles.navTop : `${styles.navTop} ${styles.navGreen}`
      }
    >
      <div className={styles.navTopContent}>
        <Link to={user ? `/${user.username}/dashboard` : '/'}>
          <div className={styles.logoContainer} tabIndex={0}>
            <Logo landingStyle={isTop && isHome} />
          </div>
        </Link>
        {children}
      </div>
    </nav>
  );
};

const UnAuthNav = () => {
  return (
    <div className={styles.authContainer}>
      <Link to='/login'>Login</Link>
      <Link to='/signup'>Signup</Link>
    </div>
  );
};

type AuthNavProps = {
  user: { username: string };
  accountMenuOpen: boolean;
  setAccountMenuOpen: (value: boolean) => void;
};

const AuthNav = ({
  user,
  accountMenuOpen,
  setAccountMenuOpen,
}: AuthNavProps) => {
  const { username } = user;
  const dispatch = useDispatch();

  function onLogoutClick() {
    dispatch(logout());
  }

  function handleButtonClick() {
    setAccountMenuOpen(!accountMenuOpen);
  }

  return (
    <>
      <button className={styles.accountButton} onClick={handleButtonClick}>
        {username}
      </button>
      <ul
        className={
          accountMenuOpen ? styles.accountMenuOpen : styles.accountMenu
        }
        onClick={handleButtonClick}
      >
        <li>
          <button onClick={onLogoutClick}>Logout</button>
        </li>
        <li>
          <Link to={`/${username}/settings`}>Settings & Preferences</Link>
        </li>
        <li>
          <Link to={`/${username}/create_settings`}>
            Create Settings & Preferences
          </Link>
        </li>
        <li>
          <ChevronUp />
        </li>
      </ul>
    </>
  );
};

type NavbarProps = {
  accountMenuOpen?: boolean;
  setAccountMenuOpen?: (value: boolean) => void;
};

const NavBar = ({ accountMenuOpen, setAccountMenuOpen }: NavbarProps) => {
  const { user } = useSelector(authSelector);

  return (
    <Nav user={user}>
      {user && accountMenuOpen && setAccountMenuOpen ? (
        <AuthNav
          user={user}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
        />
      ) : (
        <UnAuthNav />
      )}
    </Nav>
  );
};

export default NavBar;
