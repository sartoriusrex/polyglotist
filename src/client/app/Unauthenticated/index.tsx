import React, { useEffect } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from '../history';

import NavBar from '../../features/Navbar';
import LandingPage from '../../features/UnauthPages/LandingPage';
import AuthPage from '../../features/UnauthPages/AuthPage';
import PrivacyPage from '../../features/UnauthPages/PrivacyPage';
import ContactPage from '../../features/UnauthPages/ContactPage';
import NoMatchPage from '../../common/components/NoMatchPage';
import LoadingIndicator from '../../common/components/LoadingIndicator';

const UnauthenticatedApp = () => {
  return (
    <main className='unauth-main'>
      <NavBar />
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
  );
};

export default UnauthenticatedApp;
