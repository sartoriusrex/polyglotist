import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { 
    practiceSelector,
    updatePhraseStrength
} from '../../slices/practice';
import { authSelector } from '../../slices/auth';

import styles from './practiceSessionPage.module.scss';

import { 
    phraseInterface,
    phraseResult
} from '../../interfaces';

import PracticeQuestion from '../../components/PracticeQuestion';

const practiceSessionPage = () => {
    const { id } = useSelector(authSelector).user;
    const { 
        hasErrors,
        loading,
        phrases,
        results
    } = useSelector(practiceSelector);
    const dispatch = useDispatch();
    
    function updatePhrase(phraseId: string, result: 1 | -1) {
        dispatch(updatePhraseStrength(id, phraseId, result));
    }

    function showResults() {
        return (
            <div>
                { results.map( (result: phraseResult) => <p>{result}</p>)}
            </div>
        )
    }

    if( hasErrors ) {
        return (
            <p>
                Error
            </p>
        )
    }

    if( loading ) {
        return (
            <p>
                loading...
            </p>
        )
    }

    return (
        <section className={styles.practiceSession}>
            <h1>Practice Session Page</h1>

            {
                phrases.map( (phrase: phraseInterface) =>
                    <PracticeQuestion 
                        key={phrase.phrase_id}
                        phrase_id={phrase.phrase_id}
                        phrase={phrase.phrase}
                        translation={phrase.translation}
                        article={phrase.article}
                        context_phrase={phrase.context_phrase}
                    />
                )
            }
        </section>
    )
}

export default practiceSessionPage;