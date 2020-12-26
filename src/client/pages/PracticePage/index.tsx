import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { settingsSelector } from '../../slices/settings';

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
          className="input-group" >
          <input 
            type="radio" 
            id={language} 
            name='language' 
            value={language}
            onChange={() => setLang(language)}
            defaultChecked={language === lang } />
          <label htmlFor={language}>
            {language[0].toUpperCase() + language.substring(1)}
          </label>
        </div>
      )
    })
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    console.log(lang);
    console.log(mode);
  }

  return(
    <form 
      className={styles.practicePage}
      action="post"
      method="POST"
      onSubmit={onSubmit} >
      <h1>Practice Vocabulary</h1>

      <div className="languageSection">
        <h2>Languages</h2>
        {renderLanguageInputs()}
      </div>

      <div className="modeSection">
        <h2>Mode</h2>
        <div className="input-group">
            <input 
              type="radio" 
              id="untimed" 
              name="mode" 
              value="untimed" 
              checked={mode === 'untimed'}
              onChange={() => setMode('untimed')} />
            <label htmlFor="untimed">Untimed</label>
        </div>
        <div className="input-group">
            <input 
              type="radio" 
              id="timed" 
              name="mode" 
              value="timed"
              checked={mode === 'timed'}
              onChange={() => setMode('timed')} />
            <label htmlFor="timed">Timed</label>
        </div>
      </div>

      <button type="submit">Start</button>
    </form>
  )
}

export default PracticePage;