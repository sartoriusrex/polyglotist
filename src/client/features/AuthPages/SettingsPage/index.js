import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { authSelector } from '../../../slices/auth';

const SettingsPage = () => {
  const { user } = useSelector(authSelector);
  const { username } = user;

  return(
    <section>
      <h1>Settings Page</h1>
      <Link to={`/${username}/update_settings`}>
        Update Settings
      </Link >
    </section>
  )
}

export default SettingsPage;