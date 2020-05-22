import React, { useEffect } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import history from '../history';

import { fetchUsers, usersSelector } from '../../slices/users';

import NavBar from '../../features/Navbar';
import LandingPage from '../../features/UnauthPages/LandingPage';
import AuthPage from '../../features/UnauthPages/AuthPage';
import PrivacyPage from '../../features/UnauthPages/PrivacyPage';
import ContactPage from '../../features/UnauthPages/ContactPage';
import NoMatchPage from '../../common/components/NoMatchPage';
import LoadingIndicator from '../../common/components/LoadingIndicator';

const UnauthenticatedApp = () => {
  const dispatch = useDispatch();
  const { users, loading, hasErrors } = useSelector(usersSelector);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  function renderUsers() {
    if (loading) return <LoadingIndicator />;
    if (hasErrors) return <h1>Errors!</h1>;

    return users.map(
      (user: { id: string; username: string; email: string }) => (
        <div key={user.id}>
          <h2>{user.id}</h2>
          <h2>{user.username}</h2>
          <h3>{user.email}</h3>
        </div>
      )
    );
  }

  return (
    <Router history={history}>
      <NavBar />
      <main className='unauth-main'>
        <Switch>
          <Route exact path='/'>
            <LandingPage />
          </Route>
          <Route exact path='/login'>
            <AuthPage newUser={false} />
          </Route>
          <Route exact path='/signup'>
            <AuthPage newUser={true} />
          </Route>
          <Route exact path='/privacy'>
            <PrivacyPage />
          </Route>
          <Route exact path='/contact'>
            <ContactPage />
          </Route>
          <Redirect from='/:username/dashboard' to='/login' />
          <Redirect from='/:username/articles' to='/login' />
          <Redirect from='/:username/words' to='/login' />
          <Redirect from='/:username/practice' to='/login' />
          <Redirect from='/:username/settings' to='/login' />
          <Redirect from='/:username/create_settings' to='/login' />
          <Route component={NoMatchPage} />
        </Switch>
      </main>
    </Router>
  );
};

export default UnauthenticatedApp;
