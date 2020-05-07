import React, { useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { login, authSelector } from '../slices/auth';
import '../styles/index.scss';

const AuthenticatedApp = React.lazy(
  () => import('./Authenticated')
);
const UnauthenticatedApp = React.lazy(
  () => import('./Unauthenticated')
);

const App = () => {
  const { user } = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(login());
  }, []);

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
