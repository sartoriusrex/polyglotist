import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector, updateSettings } from '../../../slices/settings';
import {
  addMessage,
  removeMessage,
  messageSelector,
} from '../../../slices/messages';
import { authSelector } from '../../../slices/auth';

import SourceList, {
  sources as sourcesObject,
} from '../../AuthComponents/SourceList';

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
  const { message } = useSelector(messageSelector);
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
    <section>
      {message && <div>{message}</div>}

      {loading && <h2>Loading User Settings </h2>}

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
        <div>
          <h4>
            What Languages Are you Working On?
            <span className='required' aria-hidden='true'>
              *
            </span>
            <span className='sr-only'> * Required</span>
          </h4>
          <p id='desc-targetLangs'>Choose at least one language to improve.</p>
          <label htmlFor='french'>
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
          <label htmlFor='spanish'>
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
          <label htmlFor='german'>
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
          </label>
        </div>
        <div>
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
        <label htmlFor='themePreference'>
          Theme
          <p id='desc-theme'>
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
        <label htmlFor='readingSpeed'>
          Reading Speed
          <p id='desc-speed'>
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
            <option value='fast'>fast</option>
          </select>
        </label>
        <label htmlFor='practiceMode'>
          Practice Mode
          <p id='desc-practice'>
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
        <label htmlFor='notifyMethod'>
          Notification Method
          <p id='desc-method'>How do you want to be notified?</p>
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
        <label htmlFor='langPref'>
          Language Preference
          <p id='desc-langPref'>Set the language of the application</p>
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
        >
          Update Settings
        </button>
      </form>
    </section>
  );
};

export default SettingsPage;