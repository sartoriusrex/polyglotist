import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { IPhraseUnit } from '../../../interfaces';
import styles from './phrasePage.module.scss';
import { fetchAllPhrases, phrasesSelector } from '../../../slices/phrases';
import { authSelector } from '../../../slices/auth';

const PhrasesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { phrases } = useSelector(phrasesSelector);

  useEffect(() => {
    dispatch(fetchAllPhrases(user.id))
  }, [dispatch, fetchAllPhrases])


  const PhraseUnit = ({ phraseObject }: { phraseObject: IPhraseUnit }) => {
    const { phrase_id, phrase, translation, created_at, language } = phraseObject;
    const ts = new Date(created_at)
    const createdDate = ts.toLocaleDateString();
    const createdTime = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <tr>
        <td>
          <Link
            to={{
              pathname: `/${user.username}/phrases/${phrase_id}`,
              state: {
                phrase: phraseObject
              }
            }}
          >
            {phrase}
          </Link>
        </td>
        <td>{translation}</td>
        <td>{language}</td>
      </tr>
    )
  }

  function renderVocabulary(phrases: IPhraseUnit[]) {
    return phrases.map((phrase: IPhraseUnit) => {
      return <PhraseUnit key={phrase.phrase} phraseObject={phrase} />
    })
  }

  return (
    <section className={styles.vocabPage}>
      <h1>Vocabulary</h1>
      <table className={styles.vocabTable}>
        <thead>
          <tr>
            <th>Phrase</th>
            <th>Definition</th>
            <th>Strength</th>
          </tr>
        </thead>
        <tbody>
          {renderVocabulary(phrases)}
        </tbody>
      </table>
    </section>
  )
}

export default PhrasesPage;