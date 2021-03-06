import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './bottomNavbar.module.scss';
import { authSelector } from '../../slices/auth';

import ArticlesIcon from '../../images/Articles';
import HomeIcon from '../../images/Home';
import SandClockIcon from '../../images/SandClock';
import PhrasesIcon from '../../images/Phrases';

const BottomNavbar = () => {
  const { user } = useSelector(authSelector);
  const { username } = user;
  const [location, setLocation] = useState(
    window.location.pathname.split('/')[2]
  );

  useEffect(() => {
    function listenLocation(): void {
      setLocation(window.location.pathname.split('/')[2]);
    }

    document.addEventListener('click', listenLocation);

    return () => {
      document.removeEventListener('click', listenLocation);
    };
  }, [location]);

  return (
    <nav className={styles.bottomNav}>
      <Link to={`/${username}/dashboard`}>
        <HomeIcon active={location === 'dashboard'} />
      </Link>
      <Link to={`/${username}/phrases`}>
        <PhrasesIcon active={location === 'phrases'} />
      </Link>
      <Link to={`/${username}/articles`}>
        <ArticlesIcon active={location === 'articles'} />
      </Link>
      <Link to={`/${username}/practice`}>
        <SandClockIcon active={location === 'practice'} />
      </Link>
    </nav>
  );
};

export default BottomNavbar;
