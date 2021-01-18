import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import styles from './practiceQuestion.module.scss';

const PracticeQuestion = ({ 
        phrase_id,
        phrase,
        translation,
        context_phrase,
        article,
        submit,
        updateProgress,
        current,
        last,
        username
    } : {
        phrase_id: string,
        phrase: string,
        translation: string,
        context_phrase: string,
        article: string,
        submit: Function,
        updateProgress: Function,
        current: boolean,
        last: boolean,
        username: string
    }) => {
        const [ answer, setAnswer ] = useState('');
        const [ answered, setAnswered ] = useState(false);
        const [ showHint, setShowHint ] = useState(false);
        const result = answer.toLocaleLowerCase().includes(translation) ? 1 : -1;
        const inputRef = useRef<HTMLInputElement >(null);
        const nextBtn = useRef<HTMLButtonElement>(null);
        const resultsBtn = useRef<HTMLAnchorElement>(null);

        function handleAnswer() {
            submit(phrase_id, result);
            setAnswered(true);
        }

        function onEnterPress(e: React.KeyboardEvent<HTMLElement>) {
            if (e.key === 'Enter' ) {
                handleAnswer();
            }
        }

        useEffect(() => {
            if (current) {
                inputRef?.current?.focus();
            }
        }, [current])

        useEffect(() => {
            if (current) {
                nextBtn?.current?.focus();
            }

            if (last) {
                resultsBtn?.current?.focus();
            }
        }, [answered])

        return (
            <div 
                key={phrase_id}
                className={ 
                    current ? 
                    styles.questionContainerVisible :
                    styles.questionContainerHidden
                    }>
                
                <p className={styles.phrase}>{phrase}</p>
                
                <input 
                    type="text"
                    placeholder="Answer"
                    onChange={ (e) => setAnswer(e.target.value) } 
                    value={ answer } 
                    disabled={ answered } 
                    ref={ inputRef }
                    onKeyPress={ (e) => onEnterPress(e) }
                />
                
                {
                    !answered &&
                    <button 
                        title="Toggle Hint"
                        className={ showHint ? styles.hintBtn : styles.hintBtnHide }
                        onClick={ () => setShowHint(showHint => !showHint)}
                    >
                        { showHint ? "Hide Hint" : "Show Hint"}
                    </button>
                }
                

                <p className={ showHint && !answered ? styles.hintShown : styles.hintHidden } >
                    {context_phrase}
                </p>

                { 
                    answered ?
                    <div className={styles.resultContainer}>
                        { 
                            result === 1 ?
                            <p>Correct!</p> :
                            <>
                                <p>Incorrect.</p>
                                <p>Answer: {translation}</p>
                                <p>From sentence: {context_phrase}</p>
                                <p>Found in {article}</p>
                            </>
                        }

                        {
                            last ?
                            <Link 
                                to={`/${username}/practice/results`}
                                className={styles.resultsLink}
                                ref={ resultsBtn }
                            >
                                See Results
                            </Link> :
                            <button 
                                title={ "Next Question" }
                                className={styles.nextBtn}
                                onClick={ () => updateProgress() }
                                ref={ nextBtn }
                            >
                                Next
                            </button>
                        }

                    </div> :
                    <button 
                        title="Submit Answer" 
                        className={styles.answerBtn}
                        onClick={ () => handleAnswer() }
                    >Answer</button>
                }
            </div>
        )
}

export default PracticeQuestion;
