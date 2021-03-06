import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import throttle from 'lodash.throttle';

import { logout, authSelector } from '../../slices/auth';
import { settingsSelector } from '../../slices/settings';

import styles from './navbar.module.scss';
import Logo from '../../images/Logo';
import ChevronUp from '../../images/ChevronUp';

import { AuthNavProps, NavbarProps } from '../../interfaces';

const Nav = (props: any) => {
  const { children, user } = props;
  const positionThreshold = 20;
  const location = useLocation();
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    if (location.pathname === '/') {
      function listenScroll(): void {
        const scrollCheck = window.scrollY < positionThreshold;
        if ((scrollCheck && !isTop) || (!scrollCheck && isTop))
          setIsTop(scrollCheck);
      }

      function throttleScroll(){ 
        throttle(() => listenScroll(), 250); 
      }

      document.addEventListener(
        'scroll',
        throttleScroll
      );

      return () => {
        document.removeEventListener('scroll', throttleScroll);
      };
    }
  }, [isTop, location]);

  return (
    <nav
      className={
        isTop && location.pathname === '/'
          ? styles.navTop
          : `${styles.navTop} ${styles.navGreen}`
      }
    >
      <div className={styles.navTopContent}>
        <Link to={user ? `/${user.username}/dashboard` : '/'}>
          <div className={styles.logoContainer} tabIndex={0}>
            <Logo landingStyle={isTop && location.pathname === '/'} />
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

const AuthNav = ({
  user,
  accountMenuOpen,
  setAccountMenuOpen,
}: AuthNavProps) => {
  const { username } = user;
  const dispatch = useDispatch();
  const settings = useSelector(settingsSelector);

  function onLogoutClick() {
    dispatch(logout());
  }

  function handleButtonClick() {
    setAccountMenuOpen(!accountMenuOpen);
  }

  return (
    <>
      <button
        className={styles.accountButton}
        onClick={handleButtonClick}
        aria-controls='account-menu'
        aria-haspopup={true}
        aria-expanded={accountMenuOpen}
      >
        {username}
      </button>
      <ul
        id='account-menu'
        role='menu'
        className={
          accountMenuOpen ? styles.accountMenuOpen : styles.accountMenu
        }
        onClick={handleButtonClick}
        aria-hidden={accountMenuOpen ? false : true}
      >
        <li>
          <button onClick={onLogoutClick}>Logout</button>
        </li>
        <li role='presentation'>
          {settings.languagesLearning ? (
            <Link role='menu-item' to={`/${username}/settings`}>
              Settings & Preferences
            </Link>
          ) : (
            <Link role='menu-item' to={`/${username}/create_settings`}>
              Create Settings & Preferences
            </Link>
          )}
        </li>
        <li role='presentation'>
          <ChevronUp />
        </li>
      </ul>
    </>
  );
};

const NavBar = ({ accountMenuOpen, setAccountMenuOpen }: NavbarProps) => {
  const { user } = useSelector(authSelector);

  return (
    <Nav user={user}>
      {user && accountMenuOpen !== undefined && setAccountMenuOpen ? (
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
