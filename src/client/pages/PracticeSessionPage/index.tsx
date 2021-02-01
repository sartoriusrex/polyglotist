import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { 
    practiceSelector,
    updatePhraseStrength,
    clearResults
} from '../../slices/practice';
import { authSelector } from '../../slices/auth';

import LoadingIndicator from '../../components/LoadingIndicator';
import Timer from '../../components/Timer';

import styles from './practiceSessionPage.module.scss';

import { Phrase } from '../../interfaces';

import PracticeQuestion from '../../components/PracticeQuestion';

const practiceSessionPage = () => {
    const { id, username } = useSelector(authSelector).user;
    const { 
        questionsHasErrors,
        loadingQuestions,
        phrases,
    } = useSelector(practiceSelector);
    const dispatch = useDispatch();
    const location: { pathname: string; state: { mode: string }} = useLocation();
    const mode = location?.state?.mode;
    const [progress, setProgress] = useState(() => 0);
    const [time, setTime]  = useState(60);
    const timeUp = time === 0;
    
    function updatePhrase(phraseId: string, result: 1 | -1) {
        dispatch(updatePhraseStrength(id, phraseId, result));
    }

    useEffect(() => {
        dispatch(clearResults())
    }, [])

    // Timer
    useEffect(() => {
        if (mode === 'timed' && time > 0 ) {
            const timer = setTimeout(() => {
                setTime((time) => time - 1);
            }, 1000)
            
            return () => clearTimeout(timer);
        }
    })

    if( questionsHasErrors ) {
        return (
            <p>
                Error
            </p>
        )
    }

    if( loadingQuestions ) {
        return (
            <LoadingIndicator />
        )
    }

    if( phrases.length < 1 ) {
        return (
            <section>
                <h1>No Phrases to practice!</h1>
            </section>
        )
    }

    return (
        <section className={styles.practiceSession}>
            {
                mode === 'timed' &&
                <Timer time={time} />
            }
            {
                phrases.map( (phrase: Phrase, idx: number ) => {
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
                            username={ username }
                            timeUp={ timeUp }
                        />
                    )
                })
            }
        </section>
    )
}

export default practiceSessionPage;