import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './phrasePage.module.scss';
import { fetchAllPhrases, phrasesSelector } from '../../../slices/phrases';
import { authSelector } from '../../../slices/auth';

const PhrasesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { phrases } = useSelector(phrasesSelector);

  function fetchPhrases() {
    dispatch(fetchAllPhrases(user.id));
  }

  useEffect(() => {
    dispatch(fetchAllPhrases(user.id))
  }, [dispatch, fetchAllPhrases])

  interface IPhraseUnit {
    phrase: string;
    created_at: string;
    translation: string;
    language: string;
    article: string;
    context_phrase: string;
    strength: number;
  }

  const PhraseUnit = ({ phraseObject }: { phraseObject: IPhraseUnit }) => {
    const { phrase, translation, created_at, strength } = phraseObject;
    const ts = new Date(created_at)
    const createdDate = ts.toLocaleDateString();
    const createdTime = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <tr>
        <td>{phrase}</td>
        <td>{translation}</td>
        <td>{strength}</td>
      </tr>
    )
  }

  function renderVocabulary(phrases: IPhraseUnit[]) {
    return phrases.map((phrase: IPhraseUnit) => {
      return <PhraseUnit key={phrase.phrase} phraseObject={phrase} />
    })
  }

  return (
    <section>
      <h1>Vocabulary</h1>
      <button onClick={() => fetchPhrases()}>Fetch phrases</button>
      <table className={styles.vocabTable}>
        <thead>
          <tr>
            <th>Phrase</th>
            <th>Definition</th>
            <th>Created</th>
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