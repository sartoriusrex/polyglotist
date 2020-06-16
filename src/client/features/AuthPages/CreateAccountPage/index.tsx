import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector, updateSettings } from '../../../slices/settings';
import { authSelector } from '../../../slices/auth';

import styles from './createAccountPage.module.scss';
import SourceList, { sources } from '../../SourceList';

import LoadingIndicator from '../../../common/components/LoadingIndicator';

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

  const NextButton = () => {
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
        className={styles.nextButton}
        disabled={!learning || learning.length <= 0}
      >
        Next
      </button>
    );
  };

  const BackButton = () => {
    return (
      <button
        type='button'
        onClick={() => setStep(step - 1)}
        className={styles.backButton}
      >
        Previous
      </button>
    );
  };

  const ProgressBar = ({ step }: { step: number }) => {
    return (
      <div role='presentation' className={styles.progressBarContainer}>
        <div className={styles.progressBarLineContainer}>
          <span
            className={
              step > 0
                ? styles.progressBarLineActive
                : styles.progressBarLineInactive
            }
          ></span>
          <span
            className={
              step > 1
                ? styles.progressBarLineActive
                : styles.progressBarLineInactive
            }
          ></span>
        </div>
        <ul className={styles.progressBar}>
          <li
            className={
              step === 0
                ? styles.progressActive
                : step > 0
                ? styles.progressComplete
                : styles.progressInactive
            }
          >
            1
          </li>
          <li
            className={
              step === 1
                ? styles.progressActive
                : step > 1
                ? styles.progressComplete
                : styles.progressInactive
            }
          >
            2
          </li>
          <li
            className={
              step === 2
                ? styles.progressActive
                : step > 2
                ? styles.progressComplete
                : styles.progressInactive
            }
          >
            3
          </li>
        </ul>
      </div>
    );
  };

  return (
    <section className={styles.createAccountSection}>
      {loading && <LoadingIndicator />}

      {hasErrors && (
        <h2>
          There was a Problem Loading your User Settings. Please try again.
        </h2>
      )}

      <ProgressBar step={step} />

      {step === 0 && <h1>Let's get you started</h1>}

      <form
        action={`/api/user/${username}`}
        method='PATCH'
        onSubmit={handleSubmit}
      >
        <div className={step === 0 ? styles.currentStep : styles.hiddenStep}>
          <h3>What languages are you working on?</h3>
          <div className={styles.langChoiceContainer}>
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
                onChange={() =>
                  handleArrayChange('french', learning, setLearning)
                }
                defaultChecked={
                  languagesLearning && languagesLearning.includes('french')
                }
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
                onChange={() =>
                  handleArrayChange('spanish', learning, setLearning)
                }
                defaultChecked={
                  languagesLearning && languagesLearning.includes('spanish')
                }
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
                onChange={() =>
                  handleArrayChange('german', learning, setLearning)
                }
                defaultChecked={
                  languagesLearning && languagesLearning.includes('german')
                }
              />
            </label> */}
          </div>
          <NextButton />
        </div>

        <div className={step === 1 ? styles.currentStep : styles.hiddenStep}>
          <label htmlFor='practiceMode' className={styles.createAcctLabel}>
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

          <label htmlFor='notifyMethod' className={styles.createAcctLabel}>
            <h3>Do you want practice reminders?</h3>
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

          <div className={styles.navButtonContainer}>
            <BackButton />
            <NextButton />
          </div>
        </div>

        <div className={step === 2 ? styles.currentStep : styles.hiddenStep}>
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

          <BackButton />
          <button
            type='submit'
            disabled={!learning || resources.length <= 0 || step !== 2}
            className='form-submit-button'
          >
            Let's Go!
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateAccountPage;
