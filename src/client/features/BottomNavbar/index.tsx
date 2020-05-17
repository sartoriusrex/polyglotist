import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './bottomNavbar.module.scss';
import { authSelector } from '../../slices/auth';

const BottomNavbar = () => {
  const { user } = useSelector(authSelector);
  const { username } = user;

  return (
    <div className={styles.bottomNav}>
      <Link to={`/${username}/dashboard`}>Home</Link>
      <Link to={`/${username}/words`}>Words</Link>
      <Link to={`/${username}/articles`}>Articles</Link>
      <Link to={`/${username}/practice`}>Practice</Link>
    </div>
  );
};

export default BottomNavbar;
