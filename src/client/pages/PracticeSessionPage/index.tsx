import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { 
    practiceSelector,
    updatePhraseStrength
} from '../../slices/practice';
import { authSelector } from '../../slices/auth';

import LoadingIndicator from '../../components/LoadingIndicator';

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
    const [progress, setProgress] = useState(() => 0);
    
    function updatePhrase(phraseId: string, result: 1 | -1) {
        dispatch(updatePhraseStrength(id, phraseId, result));

        setProgress(progress => progress + 1);
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
            <LoadingIndicator />
        )
    }

    return (
        <section className={styles.practiceSession}>
            {
                phrases.map( (phrase: phraseInterface, idx: number ) =>
                    <PracticeQuestion 
                        key={phrase.phrase_id}
                        phrase_id={phrase.phrase_id}
                        phrase={phrase.phrase}
                        translation={phrase.translation}
                        article={phrase.article}
                        context_phrase={phrase.context_phrase}
                        submit={updatePhrase}
                        progress={progress}
                        index={idx}
                    />
                )
            }

            {
                progress === phrases.length &&
                showResults()
            }
        </section>
    )
}

export default practiceSessionPage;