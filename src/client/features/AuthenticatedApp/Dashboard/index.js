import React from 'react';
import { useSelector } from 'react-redux';

import { messageSelector } from '../../../slices/messages';

const Dashboard = () => {
  const { message } = useSelector(messageSelector);

  return (
    <section>
      {message && <h3>{message}</h3>}
      <h1>Dashboard</h1>
      <p>This is the Dashboard </p>
    </section>
  )
}

export default Dashboard;