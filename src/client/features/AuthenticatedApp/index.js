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
          <Redirect from='/login' to='/dashboard' />
          <Redirect from='/signup' to='/dashboard' />
          <Route exact path='/dashboard'>
            <Dashboard />
          </Route>
          <Route exact path='/articles'>
            <ArticlesPage />
          </Route>
          <Route exact path='/words'>
            <WordsPage />
          </Route>
          <Route exact path='/practice'>
            <PracticePage />
          </Route>
          <Route exact path='/settings'>
            <SettingsPage />
          </Route>
          <Route component={ NoMatchPage } />
        </Switch>
      </Router>
    </main>
  );
}

export default AuthenticatedApp;
