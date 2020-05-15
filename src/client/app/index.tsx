import React, { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { login, authSelector } from '../slices/auth';
import '../styles/index.scss';

import LoadingIndicator from '../common/components/LoadingIndicator';

const AuthenticatedApp = React.lazy(() => import('./Authenticated'));
const UnauthenticatedApp = React.lazy(() => import('./Unauthenticated'));

const App = () => {
  const { user } = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    dispatch(login());

    return () => {
      abortController.abort();
      console.log('\naborted fetch\n');
    };
  }, []);

  return user ? (
    <Suspense fallback={<LoadingIndicator />}>
      <AuthenticatedApp />
    </Suspense>
  ) : (
    <Suspense fallback={<LoadingIndicator />}>
      <UnauthenticatedApp />
    </Suspense>
  );
};

export default App;
