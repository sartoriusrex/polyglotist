import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector, updateSettings } from '../../../slices/settings';
import { addMessage, removeMessage, messageSelector } from '../../../slices/messages';
import { authSelector } from '../../../slices/auth';

import './createAccountPage.scss';
import LanguageList from './LanguageList';

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
  const [ sources, setSources ] = useState([]);
  const [ step, setStep ] = useState(0);

  function handleArrayChange(value, arr, func) {
    let newArray = arr ? [...arr] : [];

    if (newArray.indexOf(value) >= 0) {
      newArray = newArray.filter( lang => lang !== value )
    } else {
      newArray.push(value);
    }

    func(newArray);
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
      languagesLearning: learning,
      sources
    }

    dispatch(updateSettings(username, settings));
  }

  const nextButton = () => {
    return (
      <button
        type='button'
        onClick={ () => setStep( step + 1 ) }
        className='next-button'
        disabled={ !learning || learning.length <= 0 }
      >
        Next
      </button>
    );
  }

  const backButton = () => {
    return (
      <button
        type='button'
        onClick={ () => setStep( step - 1 ) }
        className='back-button'
      >
        Previous
      </button>
    );
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
              onChange={() => handleArrayChange('french', learning, setLearning)}
              defaultChecked={ languagesLearning && languagesLearning.includes('french') }
            />
          </label>
          <label htmlFor="spanish">
            Spanish
            <input
              type="checkbox"
              id='spanish'
              name='spanish'
              onChange={() => handleArrayChange('spanish', learning, setLearning)}
              defaultChecked={ languagesLearning && languagesLearning.includes('spanish') }
            />
          </label>
          <label htmlFor="german">
            German
            <input
              type="checkbox"
              id='german'
              name='german'
              onChange={() => handleArrayChange('german', learning, setLearning)}
              defaultChecked={ languagesLearning && languagesLearning.includes('german') }
            />
          </label>

          {nextButton()}
        </div>

        <div className={ step === 1 ? 'current-step' : 'hidden-step' } >
          <label htmlFor="practiceMode">
            <h3>
              Do you want to enable Practice Mode to better retain vocabulary you've learned?
            </h3>
            <select
              name="practiceMode"
              id="practiceMode"
              defaultValue={ practice }
              onChange={ e => setPractice(e.target.value) }
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
            <h3>
              Do you want reminders to practice?
            </h3>
            <select
              name="notifyMethod"
              id="notifyMethod"
              value={ noticeMethod }
              onChange={ e => setNoticeMethod(e.target.value) }
            >
              <option value="none">
                No, Thank You
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

          {nextButton()}
          {backButton()}
        </div>

        <div
          className={ step === 2 ? 'current-step' : 'hidden-step' }
        >
          <h3>
            From which sources would you like to read and improve your vocabulary?
          </h3>
          {(step === 2) && learning && learning.includes('french') && 
            <LanguageList
              lang='french'
              func={setSources}
              arr={sources}
              handleChange={handleArrayChange}
            />
          }
          {(step === 2) && learning && learning.includes('spanish') &&
            <LanguageList
              lang='spanish'
              func={setSources}
              arr={sources}
              handleChange={handleArrayChange}
            />
          }
          {(step === 2) && learning && learning.includes('german') &&
            <LanguageList
              lang='german'
              func={setSources}
              arr={sources}
              handleChange={handleArrayChange}
            />
          }

          {nextButton()}
          {backButton()}
        </div>

        <div 
          className={ step === 3 ? 'current-step' : 'hidden-step' }
        >
          <h3>You're all set! Let's continue</h3>
          <button
            type='submit'
          >
            Create Account
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreateAccountPage;