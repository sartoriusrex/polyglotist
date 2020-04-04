import React, { Suspense } from 'react';

import '../styles/index.scss';

const AuthenticatedApp = React.lazy(() => import('../features/AuthenticatedApp'));
const UnauthenticatedApp = React.lazy(() => import('../features/UnauthenticatedApp'));

const App = () => {
  const user = false;
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
