import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector, updateSettings } from '../../../slices/settings';
import { addMessage, removeMessage, messageSelector } from '../../../slices/messages';
import { authSelector } from '../../../slices/auth';

const CreateAccountPage = () => {
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
    languagesLearning
  } = settings;
  const { message } = useSelector(messageSelector);
  const { user } = useSelector(authSelector);
  const { username } = user;

  const [ learning, setLearning ] = useState(languagesLearning);
  const [ speed, setSpeed ] = useState(readingSpeed);
  const [ theme, setTheme ] = useState(themePreference);
  const [ noticeMethod, setNoticeMethod ] = useState(notificationMethod);
  const [ langPreference, setLangPreference ] = useState(languagePreference);
  const [ practice, setPractice ] = useState(practiceMode);
  const [ step, setStep ] = useState(0);

  function handleLanguageChange(value) {
    let learningArray = learning ? [...learning] : [];

    if (learningArray.indexOf(value) > 0) {
      learningArray = learningArray.filter( lang => lang !== value )
    } else {
      learningArray.push(value);
    }

    setLearning(learningArray);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!learning) return null;
    const settings = {
      readingSpeed: speed,
      themePreference: theme,
      practiceMode: practice,
      notificationMethod: noticeMethod,
      languagePreference: langPreference,
      languagesLearning: learning
    }

    dispatch(updateSettings(username, settings));
  }

  return (
    <section>
      {message && <div>{message}</div>}

      {loading && <h2>Loading User Settings </h2>}

      {hasErrors && (
        <h2>There was a Problem Loading your User Settings. Please try again.</h2>
      )}

      <h1>Create Account</h1>

      <form
        action={`/api/user/${username}`}
        method='PATCH'
        onSubmit={handleSubmit}
      >
        <div>
          <h3>
            Target Languages
            <span className='required' aria-hidden='true'>*</span>
            <span className='sr-only'> * Required</span>
          </h3>
          <p id='desc-targetLangs'>Choose at least one language to improve.</p>
          <label htmlFor="french">
            French
            <input
              type="checkbox"
              id='french'
              name='french'
              onChange={() => handleLanguageChange('french')}
              defaultChecked={ languagesLearning && languagesLearning.includes('french') }
              aria-describedby='desc-targetLangs'
            />
          </label>
          <label htmlFor="spanish">
            Spanish
            <input
              type="checkbox"
              id='spanish'
              name='spanish'
              onChange={() => handleLanguageChange('spanish')}
              defaultChecked={ languagesLearning && languagesLearning.includes('spanish') }
              aria-describedby='desc-targetLangs'
            />
          </label>
          <label htmlFor="german">
            German
            <input
              type="checkbox"
              id='german'
              name='german'
              onChange={() => handleLanguageChange('german')}
              defaultChecked={ languagesLearning && languagesLearning.includes('german') }
              aria-describedby='desc-targetLangs'
            />
          </label>

          <button onClick={() => setStep(1)}>Next</button>
        </div>
        <div>
          <label htmlFor="themePreference">
            Theme
            <p id='desc-theme'>Select a Theme. Nightowls often prefer the Dark Theme</p>
            <select
              name="themePreference"
              id="themePreference"
              defaultValue={ theme }
              onChange={ e => setTheme(e.target.value) }
              aria-describedby='desc-theme'
            >
              <option value="light">
                Light
              </option>
              <option value="dark" >
                Dark
              </option>
            </select>
          </label>

          <button onClick={() => setStep(-1)}>Next</button>
          <button onClick={() => setStep(2)}>Next</button>
        </div>
        <label htmlFor="readingSpeed">
          Reading Speed
          <p id='desc-speed'>How quickly do you typically read a news article?</p>
          <select
            name="readingSpeed"
            id="readingSpeed"
            defaultValue={ speed }
            onChange={ e => setSpeed(e.target.value) }
            aria-describedby='desc-speed'
          >
            <option value="slow">
              Slow
            </option>
            <option value="normal" >
              Normal
            </option>
            <option value="fast" >
              fast
            </option>
          </select>
        </label>
        <label htmlFor="practiceMode">
          Practice Mode
          <p id='desc-practice'>Do you want to enable Practice Mode to better retain vocabulary you've learned?</p>
          <select
            name="practiceMode"
            id="practiceMode"
            defaultValue={ practice }
            onChange={ e => setPractice(e.target.value) }
            aria-describedby='desc-practice'
          >
            <option value="true">
              Enabled
            </option>
            <option value="false" >
              Disabled
            </option>
          </select>
        </label>
        <label htmlFor="notifyMethod">
          Notification Method
          <p id='desc-method'>How do you want to be notified?</p>
          <select
            name="notifyMethod"
            id="notifyMethod"
            value={ noticeMethod }
            onChange={ e => setNoticeMethod(e.target.value) }
            aria-describedby='desc-method'
          >
            <option value="none">
              None
            </option>
            <option value="push">
              Push Notifications
            </option>
            <option value="text" >
              Text Alerts
            </option>
            <option value="email" >
              Email Alerts
            </option>
          </select>
        </label>
        <label htmlFor="langPref">
          Language Preference
          <p id='desc-langPref'>Set the language of the application</p>
          <select
            name="langPref"
            id="langPref"
            defaultValue={ langPreference }
            onChange={ e => setLangPreference(e.target.value) }
            aria-describedby='desc-langPref'
          >
            <option value="english">
              English
            </option>
          </select>
        </label>
        <button type='submit'>Update Settings</button>
      </form>
    </section>
  )
}

export default CreateAccountPage;