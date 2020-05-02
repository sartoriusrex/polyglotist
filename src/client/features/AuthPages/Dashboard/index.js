import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { messageSelector } from '../../../slices/messages';
import { authSelector } from '../../../slices/auth';
import { settingsSelector } from '../../../slices/settings';

const Dashboard = () => {
  const { message } = useSelector(messageSelector);
  const { user } = useSelector(authSelector);
  const settings = useSelector(settingsSelector);
  const { sources } = settings;

  useEffect(() => {
    if (sources) {
      async function getSomethinawait() {
        let result = await fetch('/api/crawl/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sources),
        });

        console.log(result);
      }

      getSomethinawait();
    }
  }, [sources]);

  return (
    <section>
      {message && <div>{message}</div>}
      <h1>Dashboard</h1>
      <p>This is the Dashboard </p>
    </section>
  );
};

export default Dashboard;
