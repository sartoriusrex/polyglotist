import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector, updateSettings } from '../../../slices/settings';
import { authSelector } from '../../../slices/auth';

import './createAccountPage.scss';
import SourceList, { sources } from '../../AuthComponents/SourceList';

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
    languagesLearning,
  } = settings;
  const { user } = useSelector(authSelector);
  const { username } = user;

  const [learning, setLearning] = useState(languagesLearning);
  const [noticeMethod, setNoticeMethod] = useState(notificationMethod);
  const [practice, setPractice] = useState(practiceMode);
  const [resources, setResources] = useState([]);
  const [step, setStep] = useState(0);

  const languageList = Object.keys(sources);

  function handleArrayChange(value: string, arr: string[], func: Function) {
    let newArray = arr ? [...arr] : [];

    if (newArray.indexOf(value) >= 0) {
      newArray = newArray.filter((lang) => lang !== value);
    } else {
      newArray.push(value);
    }

    func(newArray);
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    if (!learning || learning.length <= 0) return null;

    const settings = {
      readingSpeed,
      themePreference,
      practiceMode: practice,
      notificationMethod: noticeMethod,
      languagePreference,
      languagesLearning: learning,
      sources: resources,
      loading: false,
      hasErrors: false,
    };

    dispatch(updateSettings(username, settings));
  }

  const nextButton = () => {
    function handleNextClick() {
      // if the User has added sources and gone back to choose languages, we check that they haven't added sources that are no longer available in the languages they've selected. i.e. if they selected German and German sources, but go back and remove German and add French, we filter out all German sources.
      if (step === 1 && resources.length > 0) {
        const filteredResources = resources.filter((resource) => {
          const availableSources = learning
            .map((lang: string) => {
              const ids = sources[lang].map(
                (source: { id: string }) => source.id
              );
              return ids;
            })
            .flat(Infinity);

          return availableSources.includes(resource);
        });

        setResources(filteredResources);
      }
      setStep(step + 1);
    }

    return (
      <button
        type='button'
        onClick={handleNextClick}
        className='next-button'
        disabled={!learning || learning.length <= 0}
      >
        Next
      </button>
    );
  };

  const backButton = () => {
    return (
      <button
        type='button'
        onClick={() => setStep(step - 1)}
        className='back-button'
      >
        Previous
      </button>
    );
  };

  return (
    <section>
      {loading && <h2>Loading User Settings </h2>}

      {hasErrors && (
        <h2>
          There was a Problem Loading your User Settings. Please try again.
        </h2>
      )}

      <h1>Create Account</h1>

      <form
        action={`/api/user/${username}`}
        method='PATCH'
        onSubmit={handleSubmit}
      >
        <div className={step === 0 ? 'current-step' : 'hidden-step'}>
          <h3>Step 1: What Languages Are you Working On?</h3>
          <label htmlFor='french'>
            French
            <input
              type='checkbox'
              id='french'
              name='french'
              onChange={() =>
                handleArrayChange('french', learning, setLearning)
              }
              defaultChecked={
                languagesLearning && languagesLearning.includes('french')
              }
            />
          </label>
          <label htmlFor='spanish'>
            Spanish
            <input
              type='checkbox'
              id='spanish'
              name='spanish'
              onChange={() =>
                handleArrayChange('spanish', learning, setLearning)
              }
              defaultChecked={
                languagesLearning && languagesLearning.includes('spanish')
              }
            />
          </label>
          <label htmlFor='german'>
            German
            <input
              type='checkbox'
              id='german'
              name='german'
              onChange={() =>
                handleArrayChange('german', learning, setLearning)
              }
              defaultChecked={
                languagesLearning && languagesLearning.includes('german')
              }
            />
          </label>

          {nextButton()}
        </div>

        <div className={step === 1 ? 'current-step' : 'hidden-step'}>
          <label htmlFor='practiceMode'>
            <h3>
              Do you want to enable Practice Mode to better retain vocabulary
              you've learned?
            </h3>
            <select
              name='practiceMode'
              id='practiceMode'
              defaultValue={practice}
              onChange={(e) => setPractice(e.target.value)}
            >
              <option value='true'>Enabled</option>
              <option value='false'>Disabled</option>
            </select>
          </label>

          <label htmlFor='notifyMethod'>
            <h3>Do you want reminders to practice?</h3>
            <select
              name='notifyMethod'
              id='notifyMethod'
              value={noticeMethod}
              onChange={(e) => setNoticeMethod(e.target.value)}
            >
              <option value='none'>No, Thank You</option>
              <option value='push'>Push Notifications</option>
              <option value='text'>Text Alerts</option>
              <option value='email'>Email Alerts</option>
            </select>
          </label>

          {nextButton()}
          {backButton()}
        </div>

        <div className={step === 2 ? 'current-step' : 'hidden-step'}>
          <h3>
            From which sources would you like to read and improve your
            vocabulary?
          </h3>

          {languageList.map((lang: string) => {
            if (learning && learning.includes(lang)) {
              return (
                <SourceList
                  key={lang}
                  lang={lang}
                  setResources={setResources}
                  resources={resources}
                  handleChange={handleArrayChange}
                />
              );
            }
          })}

          {backButton()}
          <button
            type='submit'
            disabled={!learning || resources.length <= 0 || step !== 2}
          >
            Create Account
          </button>
        </div>

        <div className={step === 3 ? 'current-step' : 'hidden-step'}>
          <h3>You're all set! Let's continue</h3>
        </div>
      </form>
    </section>
  );
};

export default CreateAccountPage;
