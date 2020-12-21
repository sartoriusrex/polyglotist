import React, { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Router } from 'react-router-dom';
import history from './history';

import { login, authSelector } from '../slices/auth';
import '../styles/index.scss';

import LoadingIndicator from '../components/LoadingIndicator';

const AuthenticatedApp = React.lazy(() => import('./Authenticated'));
const UnauthenticatedApp = React.lazy(() => import('./Unauthenticated'));

const App = () => {
  const { user } = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(login());
  }, []);

  return (
    <Router history={history}>
      {user ? (
        <Suspense fallback={<LoadingIndicator />}>
          <AuthenticatedApp />
        </Suspense>
      ) : (
        <Suspense fallback={<LoadingIndicator />}>
          <UnauthenticatedApp />
        </Suspense>
      )}
    </Router>
  );
};

export default App;
