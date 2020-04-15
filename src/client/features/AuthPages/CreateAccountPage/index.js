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
  const [ noticeMethod, setNoticeMethod ] = useState(notificationMethod);
  const [ practice, setPractice ] = useState(practiceMode);
  const [ step, setStep ] = useState(0);

  function handleLanguageChange(value) {
    let learningArray = learning ? [...learning] : [];

    if (learningArray.indexOf(value) >= 0) {
      learningArray = learningArray.filter( lang => lang !== value )
    } else {
      learningArray.push(value);
    }

    setLearning(learningArray);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if ( !learning || learning.length <= 0 ) return null;
    const settings = {
      readingSpeed,
      themePreference,
      practiceMode: practice,
      notificationMethod: noticeMethod,
      languagePreference,
      languagesLearning: learning
    }

    dispatch(updateSettings(username, settings));
  }

  const nextButton = () => {
    return <button onClick={ () => setStep( step + 1 ) }>Next</button>
  }

  const backButton = () => 
    <button onClick={ () => setStep( step - 1 ) }>Previous</button>

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
        <div 
          className={ step === 0 ? 'current-step' : 'hidden-step' }
        >
          <h3>
            Step 1: What Languages Are you Working On?
          </h3>
          <label htmlFor="french">
            French
            <input
              type="checkbox"
              id='french'
              name='french'
              onChange={() => handleLanguageChange('french')}
              defaultChecked={ languagesLearning && languagesLearning.includes('french') }
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

          {nextButton()}
        </div>

        <div className={ step === 1 ? 'current-step' : 'hidden-step' } >
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

          {backButton()}
        </div>
        <button
          type='submit'
          className={ step === 2 ? 'show-button' : 'hide-button' }
        >
          Create Account
        </button>
      </form>
    </section>
  )
}

export default CreateAccountPage;