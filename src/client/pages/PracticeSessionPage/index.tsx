import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';

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
    const location: { pathname: string; state: { mode: string }} = useLocation();
    const mode = location?.state?.mode;
    const path = location.pathname;
    const practiceHomePath = path.split('/').slice(0,3).join('/');
    const [progress, setProgress] = useState(() => 0);
    const finishedSession = progress === phrases.length;
    
    function updatePhrase(phraseId: string, result: 1 | -1) {
        dispatch(updatePhraseStrength(id, phraseId, result));
    }

    function showResults() {
        return (
            <div className={styles.resultsContainer}>
                {/* { results.map( (result: phraseResult) => <p>{result}</p>)} */}
                results!
                <Link to={practiceHomePath}>Practice Again</Link>
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
                mode === 'timed' &&
                <div>Timed Mode</div>
            }
            {
                phrases.map( (phrase: phraseInterface, idx: number ) => {
                    let current = progress === idx;
                    let last = progress === phrases.length - 1;
    
                    return (
                        <PracticeQuestion 
                            key={phrase.phrase_id}
                            phrase_id={phrase.phrase_id}
                            phrase={phrase.phrase}
                            translation={phrase.translation}
                            article={phrase.article}
                            context_phrase={phrase.context_phrase}
                            submit={updatePhrase}
                            updateProgress={ () => setProgress(progress => progress + 1)}
                            current={current}
                            last={last}
                        />
                    )
                })
            }

            {
                finishedSession &&
                showResults()
            }
        </section>
    )
}

export default practiceSessionPage;