import React from 'react';
import { useSelector } from 'react-redux';

import { messageSelector } from '../../../slices/messages';

const Dashboard = () => {
  const { message } = useSelector(messageSelector);

  return (
    <section>
      {message && <div>{message}</div>}
      <h1>Dashboard</h1>
      <p>This is the Dashboard </p>
    </section>
  )
}

export default Dashboard;