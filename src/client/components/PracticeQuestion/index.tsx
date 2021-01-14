import React, { useState } from 'react';
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

        function handleAnswer() {
            submit(phrase_id, result);
            setAnswered(true);
        }

        return (
            <div 
                key={phrase_id}
                className={ 
                    current ? 
                    styles.questionContainerVisible :
                    styles.questionContainerHidden
                    }>
                
                <p className={styles.phrase}>{phrase}</p>
                <button 
                    title="Toggle Hint"
                    className={ showHint ? styles.hintBtn : styles.hintBtnHide }
                    onClick={ () => setShowHint(showHint => !showHint)}
                >
                    { showHint ? "Hide Hint" : "Show Hint"}
                </button>
                <p className={ showHint ? styles.hintShown : styles.hintHidden } >
                    {context_phrase}
                </p>
                <input 
                    type="text"
                    placeholder="Answer"
                    onChange={ (e) => setAnswer(e.target.value) } 
                    value={answer} 
                    disabled={ answered }    
                />
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
                            >
                                See Results
                            </Link> :
                            <button 
                                title={ "Next Question" }
                                className={styles.nextBtn}
                                onClick={ () => updateProgress() }
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
