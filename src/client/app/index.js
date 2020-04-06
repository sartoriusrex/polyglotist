import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';

import { authSelector } from '../slices/auth';
import '../styles/index.scss';

const AuthenticatedApp = React.lazy(() => import('../features/AuthenticatedApp'));
const UnauthenticatedApp = React.lazy(() => import('../features/UnauthenticatedApp'));

const App = () => {
  const { user } = useSelector(authSelector);

  return (
    user
      ? (
        <Suspense fallback={<div>loading</div>}>
          <AuthenticatedApp />
        </Suspense>
      ) : (
        <Suspense fallback={<div>loading</div>}>
          <UnauthenticatedApp />
        </Suspense>
      )
  );
};

export default App;
