import React from 'react';
import {
  Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import history from '../../app/history';

import Navbar from '../AuthComponents/Navbar';
import Dashboard from '../AuthPages/Dashboard';
import ArticlesPage from '../AuthPages/ArticlesPage';
import WordsPage from '../AuthPages/WordsPage';
import SettingsPage from '../AuthPages/SettingsPage';
import PracticePage from '../AuthPages/PracticePage';
import NoMatchPage from '../../common/components/NoMatchPage';

const AuthenticatedApp = () => {
  return(
    <main>
      <Router history={history}>
        <Navbar />

        <Switch>
          <Route exact path='/:username/dashboard'>
            <Dashboard />
          </Route>
          <Route exact path='/:username/articles'>
            <ArticlesPage />
          </Route>
          <Route exact path='/:username/words'>
            <WordsPage />
          </Route>
          <Route exact path='/:username/practice'>
            <PracticePage />
          </Route>
          <Route exact path='/:username/settings'>
            <SettingsPage />
          </Route>
          <Redirect from='/login' to='/:username/dashboard' />
          <Redirect from='/signup' to='/:username/dashboard' />
          <Route component={ NoMatchPage } />
        </Switch>
      </Router>
    </main>
  );
}

export default AuthenticatedApp;
