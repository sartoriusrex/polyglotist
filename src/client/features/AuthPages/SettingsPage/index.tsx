import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector, updateSettings } from '../../../slices/settings';
import { authSelector } from '../../../slices/auth';

import SourceList, { sources as sourcesObject } from '../../SourceList';
import LoadingIndicator from '../../../common/components/LoadingIndicator';

import styles from './settingsPage.module.scss';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector(settingsSelector);
  const {
    loading,
    hasErrors,
    readingSpeed,
    themePreference,
    practiceMode,
    notificationMethod,
    languagePreference,
    languagesLearning,
    sources,
  } = settings;
  const { user } = useSelector(authSelector);
  const { username } = user;

  const [learning, setLearning] = useState(languagesLearning);
  const [speed, setSpeed] = useState(readingSpeed);
  const [theme, setTheme] = useState(themePreference);
  const [noticeMethod, setNoticeMethod] = useState(notificationMethod);
  const [langPreference, setLangPreference] = useState(languagePreference);
  const [practice, setPractice] = useState(practiceMode);
  const [resources, setResources] = useState(sources);

  function handleChange(e: any, func: Function) {
    const { value } = e.target;

    func(value);
  }

  function handleArrayChange(
    value: string,
    arr: string[],
    func: Function,
    ...args: any[]
  ) {
    let newArray = arr ? [...arr] : [];

    if (newArray.indexOf(value) >= 0) {
      newArray = newArray.filter((lang: string) => lang !== value);
    } else {
      newArray.push(value);
    }

    func(newArray);

    if (args && resources.length > 0) {
      const filteredResources = resources.filter((resource: string) => {
        const availableSources = newArray
          .map((lang: string) => {
            const ids = sourcesObject[lang].map(
              (source: { id: string }) => source.id
            );
            return ids;
          })
          .flat(Infinity);

        return availableSources.includes(resource);
      });

      setResources(filteredResources);
    }
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    if (!learning || learning.length <= 0) return null;

    const newSettings = {
      readingSpeed: speed,
      themePreference: theme,
      practiceMode: practice,
      notificationMethod: noticeMethod,
      languagePreference: langPreference,
      languagesLearning: learning,
      sources: resources,
      loading: false,
      hasErrors: false,
    };

    dispatch(updateSettings(username, newSettings));
  }

  return (
    <section className={styles.settingsSection}>
      {loading && <LoadingIndicator />}

      {hasErrors && (
        <h2>
          There was a Problem Loading your User Settings. Please try again.
        </h2>
      )}

      <h1>Settings</h1>

      <form
        action={`/api/user/${username}`}
        method='PATCH'
        onSubmit={handleSubmit}
      >
        <div className={styles.sectionDiv}>
          <h4>
            What Languages Are you Working On?
            <span aria-hidden='true'>*</span>
            <span className='sr-only'> * Required</span>
          </h4>
          <p id='desc-targetLangs'>Choose at least one language.</p>
          <label
            htmlFor='french'
            className={
              learning && learning.includes('french')
                ? styles.labelActive
                : styles.labelInactive
            }
          >
            French
            <input
              type='checkbox'
              id='french'
              name='french'
              onChange={(e) =>
                handleArrayChange('french', learning, setLearning, 'lang')
              }
              defaultChecked={
                languagesLearning && languagesLearning.includes('french')
              }
              aria-describedby='desc-targetLangs'
            />
          </label>
          <label
            htmlFor='spanish'
            className={
              learning && learning.includes('spanish')
                ? styles.labelActive
                : styles.labelInactive
            }
          >
            Spanish
            <input
              type='checkbox'
              id='spanish'
              name='spanish'
              onChange={(e) =>
                handleArrayChange('spanish', learning, setLearning, 'lang')
              }
              defaultChecked={
                languagesLearning && languagesLearning.includes('spanish')
              }
              aria-describedby='desc-targetLangs'
            />
          </label>
          {/* <label
            htmlFor='german'
            className={
              learning && learning.includes('german')
                ? styles.labelActive
                : styles.labelInactive
            }
          >
            German
            <input
              type='checkbox'
              id='german'
              name='german'
              onChange={(e) =>
                handleArrayChange('german', learning, setLearning, 'lang')
              }
              defaultChecked={
                languagesLearning && languagesLearning.includes('german')
              }
              aria-describedby='desc-targetLangs'
            />
          </label> */}
        </div>
        <div className={styles.sectionDiv}>
          {learning.map((lang: string) => {
            return (
              <SourceList
                key={lang}
                lang={lang}
                setResources={setResources}
                resources={resources}
                handleChange={handleArrayChange}
              />
            );
          })}
        </div>
        <label className={styles.sectionSetting} htmlFor='themePreference'>
          Theme
          <p id='desc-theme' className='sr-only'>
            Select a Theme. Nightowls often prefer the Dark Theme
          </p>
          <select
            name='themePreference'
            id='themePreference'
            defaultValue={theme}
            onChange={(e) => handleChange(e, setTheme)}
            aria-describedby='desc-theme'
          >
            <option value='light'>Light</option>
            <option value='dark'>Dark</option>
          </select>
        </label>
        <label className={styles.sectionSetting} htmlFor='readingSpeed'>
          Reading Speed
          <p id='desc-speed' className='sr-only'>
            How quickly do you typically read a news article?
          </p>
          <select
            name='readingSpeed'
            id='readingSpeed'
            defaultValue={speed}
            onChange={(e) => handleChange(e, setSpeed)}
            aria-describedby='desc-speed'
          >
            <option value='slow'>Slow</option>
            <option value='normal'>Normal</option>
            <option value='fast'>Fast</option>
          </select>
        </label>
        <label className={styles.sectionSetting} htmlFor='practiceMode'>
          Practice Mode
          <p id='desc-practice' className='sr-only'>
            Do you want to enable Practice Mode to better retain vocabulary
            you've learned?
          </p>
          <select
            name='practiceMode'
            id='practiceMode'
            defaultValue={practice}
            onChange={(e) => handleChange(e, setPractice)}
            aria-describedby='desc-practice'
          >
            <option value='true'>Enabled</option>
            <option value='false'>Disabled</option>
          </select>
        </label>
        <label className={styles.sectionSetting} htmlFor='notifyMethod'>
          Notifications
          <p id='desc-method' className='sr-only'>
            How do you want to be notified?
          </p>
          <select
            name='notifyMethod'
            id='notifyMethod'
            value={noticeMethod}
            onChange={(e) => handleChange(e, setNoticeMethod)}
            aria-describedby='desc-method'
          >
            <option value='none'>None</option>
            <option value='push'>Push Notifications</option>
            <option value='text'>Text Alerts</option>
            <option value='email'>Email Alerts</option>
          </select>
        </label>
        <label className={styles.sectionSetting} htmlFor='langPref'>
          Application Language
          <p id='desc-langPref' className='sr-only'>
            Set the language of the application
          </p>
          <select
            name='langPref'
            id='langPref'
            defaultValue={langPreference}
            onChange={(e) => handleChange(e, setLangPreference)}
            aria-describedby='desc-langPref'
          >
            <option value='english'>English</option>
          </select>
        </label>
        <button
          type='submit'
          disabled={!learning || learning.length <= 0 || resources.length <= 0}
          className={`form-submit-button ${styles.submitButton}`}
        >
          Update Settings
        </button>
      </form>
    </section>
  );
};

export default SettingsPage;
