import React from 'react';
import { useSelector } from 'react-redux';
import {
  Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import history from '../../app/history';

import { settingsSelector } from '../../slices/settings';
import { authSelector } from '../../slices/auth';

import Navbar from '../AuthComponents/Navbar';
import Dashboard from '../AuthPages/Dashboard';
import ArticlesPage from '../AuthPages/ArticlesPage';
import WordsPage from '../AuthPages/WordsPage';
import SettingsPage from '../AuthPages/SettingsPage';
import PracticePage from '../AuthPages/PracticePage';
import CreateSettingsPage from '../AuthPages/CreateSettingsPage';
import NoMatchPage from '../../common/components/NoMatchPage';

const AuthenticatedApp = () => {
  const settings = useSelector(settingsSelector);
  const { user } = useSelector(authSelector);
  const { username } = user;

  return(
    <main>
      <Router history={history}>
        <Navbar />

        <Switch>
          <Route exact path='/:username/dashboard'>
            { 
              settings.languagesLearning ?
              <Dashboard /> :
              <Redirect to={`/${username}/create_settings`} />
            }
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
          <Route exact path='/:username/create_settings'>
            <CreateSettingsPage />
          </Route>
          <Route component={ NoMatchPage } />
        </Switch>
      </Router>
    </main>
  );
}

export default AuthenticatedApp;
