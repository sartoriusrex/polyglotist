import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import '../history';

import { settingsSelector } from '../../slices/settings';
import { authSelector } from '../../slices/auth';

import Navbar from '../../components/Navbar';
import BottomNavbar from '../../components/BottomNavbar';
import DefinePhraseButton from '../../components/DefinePhraseButton';
import Dashboard from '../../pages/Dashboard';
import CreateAccountPage from '../../pages/CreateAccountPage';
import ArticlesPage from '../../pages/ArticlesPage';
import ArticleDetailPage from '../../pages/ArticleDetailPage';
import PhrasesPage from '../../pages/PhrasesPage';
import PhraseDetailPage from '../../pages/PhraseDetailPage';
import SettingsPage from '../../pages/SettingsPage';
import PracticePage from '../../pages/PracticePage';
import NoMatchPage from '../../components/NoMatchPage';
import ServerMessage from '../../components/ServerMessage';

import styles from './authIndex.module.scss';

const AuthenticatedApp = () => {
  const settings = useSelector(settingsSelector);
  const { user } = useSelector(authSelector);
  const { username } = user;
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);

  return (
    <main>
      <Navbar
        accountMenuOpen={accountMenuOpen}
        setAccountMenuOpen={setAccountMenuOpen}
      />
      <ServerMessage />
      <div
        aria-hidden={accountMenuOpen ? false : true}
        role='dialog'
        className={accountMenuOpen ? styles.appOverlayOpen : styles.appOverlay}
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
        <Route exact path='/:username/articles/:article'>
          <ArticleDetailPage />
        </Route>
        <Route exact path='/:username/phrases'>
          <PhrasesPage />
        </Route>
        <Route exact path='/:username/phrases/:phrase_id'>
          <PhraseDetailPage />
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

      <DefinePhraseButton />
      <BottomNavbar />
    </main>
  );
};

export default AuthenticatedApp;
