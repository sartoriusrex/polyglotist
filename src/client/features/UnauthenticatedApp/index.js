import React, { useEffect } from 'react';
import {
  Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import history from '../../app/history';

import { fetchUsers, usersSelector } from '../../slices/users';

import NavBar from '../UnauthComponents/Navbar';
import LandingPage from '../UnauthPages/LandingPage';
import AboutPage from '../UnauthPages/AboutPage';
import FeaturesPage from '../UnauthPages/FeaturesPage';
import AuthPage from '../UnauthPages/AuthPage';
import NoMatchPage from '../../common/components/NoMatchPage';

const UnauthenticatedApp = () => {
  const dispatch = useDispatch();
  const {
    users, loading, hasErrors
  } = useSelector(usersSelector);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  function renderUsers() {
    if (loading) return <h1>Loading</h1>;
    if (hasErrors) return <h1>Errors!</h1>;

    return users.map((user) => (
      <div key={user.id}>
        <h2>{user.id}</h2>
        <h2>{user.username}</h2>
        <h3>{user.email}</h3>
      </div>
    ));
  }

  return (
    <main>
      <Router history={history}>
        <NavBar />

        <Switch>
          <Route exact path='/'>
            <LandingPage />
          </Route>
          <Route exact path='/about'>
            <AboutPage />
          </Route>
          <Route exact path='/features'>
            <FeaturesPage />
          </Route>
          <Route exact path='/login'>
            <AuthPage />
          </Route>
          <Route exact path='/signup'>
            <AuthPage newUser />
          </Route>
          <Redirect from='/:username/dashboard' to='/login' />
          <Redirect from='/:username/articles' to='/login' />
          <Redirect from='/:username/words' to='/login' />
          <Redirect from='/:username/practice' to='/login' />
          <Redirect from='/:username/settings' to='/login' />
          <Redirect from='/:username/create_settings' to='/login' />
          <Route component={ NoMatchPage } />
        </Switch>
      </Router>

      {renderUsers()}
    </main>
  );
};

export default UnauthenticatedApp;
