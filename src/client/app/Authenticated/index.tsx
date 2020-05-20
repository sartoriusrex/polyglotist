import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from '../history';

import { settingsSelector } from '../../slices/settings';
import { authSelector } from '../../slices/auth';

import Navbar from '../../features/Navbar';
import BottomNavbar from '../../features/BottomNavbar';
import Dashboard from '../../features/AuthPages/Dashboard';
import CreateAccountPage from '../../features/AuthPages/CreateAccountPage';
import ArticlesPage from '../../features/AuthPages/ArticlesPage';
import WordsPage from '../../features/AuthPages/WordsPage';
import SettingsPage from '../../features/AuthPages/SettingsPage';
import PracticePage from '../../features/AuthPages/PracticePage';
import NoMatchPage from '../../common/components/NoMatchPage';
import ServerMessage from '../../common/components/ServerMessage';

import styles from './authIndex.module.scss';

const AuthenticatedApp = () => {
  const settings = useSelector(settingsSelector);
  const { user } = useSelector(authSelector);
  const { username } = user;
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);

  return (
    <main>
      <Router history={history}>
        <Navbar
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
        />
        <ServerMessage />
        <div
          className={
            accountMenuOpen ? styles.appOverlayOpen : styles.appOverlay
          }
          onClick={() => setAccountMenuOpen(!accountMenuOpen)}
        ></div>

        <Switch>
          <Route exact path='/:username/dashboard'>
            {settings.languagesLearning ? (
              <Dashboard />
            ) : (
              <Redirect to={`/${username}/create_account`} />
            )}
          </Route>
          <Route exact path='/:username/create_account'>
            {settings.languagesLearning ? (
              <Redirect to={`/${username}/settings`} />
            ) : (
              <CreateAccountPage />
            )}
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
            {settings.languagesLearning ? (
              <SettingsPage />
            ) : (
              <Redirect to={`/${username}/create_account`} />
            )}
          </Route>
          <Route component={NoMatchPage} />
        </Switch>

        <BottomNavbar />
      </Router>
    </main>
  );
};

export default AuthenticatedApp;
