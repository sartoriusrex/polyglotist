import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout, authSelector } from '../../../slices/auth';

const Navbar = () => {
  const { user } = useSelector(authSelector);
  const { username } = user;

  const dispatch = useDispatch();

  function onLogoutClick() {
    dispatch(logout());
  }

  return (
    <nav>
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
    </nav>
  );
}

export default Navbar;