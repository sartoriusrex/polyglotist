import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { IPhraseUnit } from '../../interfaces';
import styles from './phrasePage.module.scss';
import { fetchAllPhrases, phrasesSelector } from '../../slices/phrases';
import { authSelector } from '../../slices/auth';

const PhrasesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { phrases } = useSelector(phrasesSelector);

  useEffect(() => {
    dispatch(fetchAllPhrases(user.id))
  }, [dispatch, fetchAllPhrases])

  const PhraseUnit = ({ phraseObject }: { phraseObject: IPhraseUnit }) => {
    const { phrase_id, phrase, translation, strength, created_at: created } = phraseObject;
    const dateObject = new Date(created);
    const day = dateObject.getDay();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();

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
        <td className={styles.strength}>{strength}</td>
        <td>{day}/{month}/{year}</td>
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
            <th>Created</th>
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