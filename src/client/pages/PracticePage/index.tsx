import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector } from '../../slices/settings';
import { createSession } from '../../slices/practice';
import { authSelector } from '../../slices/auth';
import { phrasesSelector } from '../../slices/phrases';

import { Phrase } from '../../interfaces';

import styles from './practicePage.module.scss';

const PracticePage = () => {
  const dispatch = useDispatch();
  const { languagesLearning: languages } = useSelector(settingsSelector);
  const { user } = useSelector(authSelector);
  const { phrases } = useSelector(phrasesSelector)
  const [lang, setLang] = useState(languages[0]);
  const [mode, setMode] = useState('untimed');

  const numPhrasesSaved = phrases.reduce( (
    accumulator: {[lang: string]: number}, 
    currentPhrase: Phrase, 
    idx: number, 
    phrases: Phrase[]) => {

      if( !accumulator[currentPhrase.language] ) {
        accumulator[currentPhrase.language] = phrases.filter( (phrase: Phrase) => {
          return currentPhrase.language === phrase.language;
        }).length;
      }

      return accumulator;
  }, { all: phrases.length});

  const zeroPhrases = numPhrasesSaved['all'] === 0;

  function renderLanguageInputs() {
    return ['all', ...languages].map( (language: string, idx: number) => {
      let zeroPhrases = numPhrasesSaved[language] === 0 || numPhrasesSaved[language] === undefined;

      return (
        <div 
          key={language} 
          className={styles.inputGroup} >
          
          <label 
            htmlFor={language} 
            className={lang === language ? styles.active : styles.inactive}
            data-disabled={zeroPhrases}>
            {language[0].toUpperCase() + language.substring(1)}

            <input 
              type="radio" 
              id={language} 
              name='language' 
              value={language}
              onChange={() => setLang(language)}
              defaultChecked={language === lang } 
              disabled={zeroPhrases}
              />
          </label>
        </div>
      )
    })
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    const { username, id } = user;

    dispatch(createSession(lang, mode, username, id));
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
                className={mode === 'untimed' ? styles.active : styles.inactive}
                data-disabled={zeroPhrases}>
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
                className={mode === 'timed' ? styles.active : styles.inactive}
                data-disabled={zeroPhrases}>
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

      <button 
        type="submit" 
        disabled={zeroPhrases}
      >
        { 
          zeroPhrases ?
          'Saved some phrases to practice first' :
          'Start'
        }
      </button>
    </form>
  )
}

export default PracticePage;