import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import '../history';

import NavBar from '../../components/Navbar';
import LandingPage from '../../pages/LandingPage';
import AuthPage from '../../pages/AuthPage';
import PrivacyPage from '../../pages/PrivacyPage';
import ContactPage from '../../pages/ContactPage';
import NoMatchPage from '../../components/NoMatchPage';

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
