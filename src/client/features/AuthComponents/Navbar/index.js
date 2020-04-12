import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout, authSelector } from '../../../slices/auth';

const Navbar = () => {
  const { user } = useSelector(authSelector);
  const dispatch = useDispatch();

  function onLogoutClick() {
    dispatch(logout());
  }

  return (
    <nav>
      <ul>
        <li>{user.username}</li>
        <li>
          <button onClick={onLogoutClick}>
            Logout
          </button>
        </li>
        <li>
          <Link to='/dashboard'>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to='/words'>
            Word Bank
          </Link>
        </li>
        <li>
          <Link to='/articles'>
            Articles
          </Link>
        </li>
        <li>
          <Link to='/practice'>
            Practice
          </Link>
        </li>
        <li>
          <Link to='/settings'>
            Settings & Preferences
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;