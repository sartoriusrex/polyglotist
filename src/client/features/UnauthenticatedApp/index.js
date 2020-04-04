import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUsers, usersSelector } from '../../slices/users';

import NavBar from './NavBar';
import LandingPage from './LandingPage';
import AboutPage from './AboutPage';
import FeaturesPage from './FeaturesPage';
import AuthPage from './AuthPage';

const UnauthenticatedApp = () => {
  const dispatch = useDispatch();
  const { users, loading, hasErrors } = useSelector(usersSelector);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  function renderUsers() {
    if (loading) return <h1>Loading</h1>;
    if (hasErrors) return <h1>Errors!</h1>;

    return users.map((user) => (
      <div key={user.id}>
        <h2>{user.id}</h2>
        <h2>{user.name}</h2>
        <h3>{user.email}</h3>
      </div>
    ));
  }

  return (
    <main>
      <Router>
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
            <AuthPage signup />
          </Route>
        </Switch>
      </Router>

      {renderUsers()}
    </main>
  );
};

export default UnauthenticatedApp;
