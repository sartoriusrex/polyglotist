import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { authSelector } from '../../../slices/auth';
import { settingsSelector } from '../../../slices/settings';

import './dashboard.scss';

import ServerMessage from '../../../common/components/ServerMessage';

const Dashboard = () => {
  const { user } = useSelector(authSelector);
  const settings = useSelector(settingsSelector);
  const { sources } = settings;

  // useEffect(() => {
  //   if (sources) {
  //     async function getSomethinawait() {
  //       let result = await fetch('/api/crawl/', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(sources),
  //       });

  //       console.log(result);
  //     }

  //     getSomethinawait();
  //   }
  // }, [sources]);

  return (
    <section>
      <ServerMessage />
      <h1>Dashboard</h1>
      <p>This is the Dashboard </p>
    </section>
  );
};

export default Dashboard;
