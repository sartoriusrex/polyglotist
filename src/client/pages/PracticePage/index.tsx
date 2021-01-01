import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector } from '../../slices/settings';
import { createSession } from '../../slices/practice';

import styles from './practicePage.module.scss';

const PracticePage = () => {
  const dispatch = useDispatch();
  const { languagesLearning: languages } = useSelector(settingsSelector);
  const [lang, setLang] = useState(languages[0]);
  const [mode, setMode] = useState('untimed');

  function renderLanguageInputs() {
    return ['all', ...languages].map( (language: string, idx: number) => {
      return (
        <div 
          key={language} 
          className={styles.inputGroup} >
          
          <label 
            htmlFor={language} 
            className={lang === language ? styles.active : styles.inactive}>
            {language[0].toUpperCase() + language.substring(1)}

            <input 
              type="radio" 
              id={language} 
              name='language' 
              value={language}
              onChange={() => setLang(language)}
              defaultChecked={language === lang } />
          </label>
        </div>
      )
    })
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    dispatch(createSession(lang, mode));
  }

  return(
    <form 
      className={styles.practicePage}
      action="post"
      method="POST"
      onSubmit={onSubmit} >
      <h1>Practice Vocabulary</h1>

      <div className={styles.sessionInputGroup}>
        <h2>Languages</h2>
        <div className={styles.inputGroupContainer}>
          {renderLanguageInputs()}
        </div>
      </div>

      <div className={styles.sessionInputGroup}>
        <h2>Mode</h2>

        <div className={styles.inputGroupContainer}>
          <div className={styles.inputGroup}>
              <label 
                htmlFor="untimed"
                className={mode === 'untimed' ? styles.active : styles.inactive}>
                Untimed
                
                <input 
                  type="radio" 
                  id="untimed" 
                  name="mode" 
                  value="untimed" 
                  checked={mode === 'untimed'}
                  onChange={() => setMode('untimed')} />
              </label>
          </div>

          <div className={styles.inputGroup}>
              <label 
                htmlFor="timed"
                className={mode === 'timed' ? styles.active : styles.inactive}>
                Timed

                <input 
                  type="radio" 
                  id="timed" 
                  name="mode" 
                  value="timed"
                  checked={mode === 'timed'}
                  onChange={() => setMode('timed')} />  
              </label>
          </div>
        </div>
      </div>

      <button type="submit">Start</button>
    </form>
  )
}

export default PracticePage;