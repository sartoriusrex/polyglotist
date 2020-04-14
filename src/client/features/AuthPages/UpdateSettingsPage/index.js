import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector, updateSettings } from '../../../slices/settings';
import { removeMessage, messageSelector } from '../../../slices/messages';
import { authSelector } from '../../../slices/auth';

const UpdateSettingsPage = () => {
  const dispatch = useDispatch();
  const {
    loading,
    hasErrors,
    readingSpeed,
    themePreference,
    notifications,
    notificationMethod,
    languagePreference,
    languagesLearning
  } = useSelector(settingsSelector);
  const { message } = useSelector(messageSelector);
  const { user } = useSelector(authSelector);
  const { username } = user;

  const [ learning, setLearning ] = useState(languagesLearning)

  function handleChange(e, func) {
    const { value } = e.target;

    func(value);

    console.log(value);
  }

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

    console.log(learning);
  }

  return (
    <section>
      {message && <div>{message}</div>}

      {loading && <h2>Loading User Settings </h2>}

      {hasErrors && (
        <h2>There was a Problem Loading your User Settings. Please try again.</h2>
      )}

      <h1>Create Settings</h1>

      <form
        action={`/api/user/${username}`}
        method='PATCH'
        onSubmit={handleSubmit}
      >
        <div>
          <h4>
            Target Languages
            <span className='required' aria-hidden='true'>*</span>
            <span className='sr-only'> * Required</span>
          </h4>
          <p>Choose at least one language to improve.</p>
          <label htmlFor="french">
            French
            <input
              type="checkbox"
              id='french'
              name='french'
              onChange={(e) => handleLanguageChange('french')}
              checked={ languagesLearning && languagesLearning.includes('french') }
            />
          </label>
          <label htmlFor="spanish">
            Spanish
            <input
              type="checkbox"
              id='spanish'
              name='spanish'
              onChange={(e) => handleLanguageChange('spanish')}
              checked={ languagesLearning && languagesLearning.includes('spanish') }
            />
          </label>
          <label htmlFor="german">
            German
            <input
              type="checkbox"
              id='german'
              name='german'
              onChange={(e) => handleLanguageChange('german')}
              checked={ languagesLearning && languagesLearning.includes('german') }
            />
          </label>
        </div>
        <label htmlFor="themePreference">
          Theme
          <select
            name="themePreference"
            id="themePreference"
          >
            <option value="light" defaultValue>Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <button type='submit'>Update Settings</button>
      </form>
    </section>
  )
}

export default UpdateSettingsPage;