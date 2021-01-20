import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { IPhraseUnit } from '../../interfaces';
import styles from './phrasePage.module.scss';
import { 
  fetchAllPhrases, 
  phrasesSelector,
  fetchPhrasesSuccess
} from '../../slices/phrases';
import { authSelector } from '../../slices/auth';

const PhrasesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { phrases } = useSelector(phrasesSelector);
  let phrasesToDisplay: IPhraseUnit[] = sortPhrases('AtoZ');

  function sortPhrases(order:string) {
    if( order === "Practiced") {
      return phrases
        .map( (phrase: IPhraseUnit) => phrase )
        .sort( (a: IPhraseUnit, b: IPhraseUnit ) => new Date(a.last_practiced).getTime() - new Date(b.last_practiced).getTime() );
    } else if ( order === "Strength" ) {
      return phrases
        .map( (phrase: IPhraseUnit) => phrase )
        .sort( (a: IPhraseUnit, b: IPhraseUnit ) => a.strength - b.strength );
    } else {
      return phrases
        .map( (phrase: IPhraseUnit) => phrase )
        .sort( (a: IPhraseUnit, b: IPhraseUnit ) => a.phrase.localeCompare(b.phrase) );
    }
  }

  useEffect(() => {
    dispatch(fetchAllPhrases(user.id))
  }, [dispatch, fetchAllPhrases])

  const PhraseUnit = ({ phraseObject }: { phraseObject: IPhraseUnit }) => {
    const { phrase_id, phrase, translation, strength, last_practiced } = phraseObject;
    const dateObject = new Date(last_practiced);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    const today = new Date();
    const differenceInDays = Math.floor((today.getTime() - dateObject.getTime()) / (1000 * 3600 * 24));    
    let lastPracticeDisplay;

    if( differenceInDays < 4 ) {
      let days;

      if( differenceInDays === 1 ) {
        days = 'day';
      } else {
        days = 'days';
      }

      if( differenceInDays === 0 ) {
        lastPracticeDisplay = 'Today';
      } else {
        lastPracticeDisplay = `${differenceInDays} ${days} ago`;
      }
    } else {
      lastPracticeDisplay = `${day}/${month}/${year}`
    }
    

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
        <td>{lastPracticeDisplay}</td>
      </tr>
    )
  }

  function renderVocabulary(phrases: IPhraseUnit[]) {
    return phrases.map((phrase: IPhraseUnit) => {
      return <PhraseUnit key={phrase.phrase} phraseObject={phrase} />
    })
  }

  function handleSort(e: ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    phrasesToDisplay = sortPhrases(e.target.value);

    dispatch(fetchPhrasesSuccess(phrasesToDisplay));
  }

  return (
    <section className={styles.vocabPage}>
      <h1>Vocabulary</h1>

      <label htmlFor="sort">
        Sort By: 
        <select 
          name="sort" 
          id="sort" 
          onChange={ (e) => handleSort(e)}
        >
          <option value="-">-</option>
          <option value="AtoZ">A - Z</option>
          <option value="Strength">Strength Asc</option>
          <option value="Practiced">Last Practiced Oldest</option>
        </select>
      </label>

      <table className={styles.vocabTable}>
        <thead>
          <tr>
            <th>Phrase</th>
            <th>Definition</th>
            <th>Strength</th>
            <th>Last Practiced</th>
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