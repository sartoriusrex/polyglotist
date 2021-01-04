import React, { useState } from 'react';

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
        last
    } : {
        phrase_id: string,
        phrase: string,
        translation: string,
        context_phrase: string,
        article: string,
        submit: Function,
        updateProgress: Function,
        current: boolean,
        last: boolean
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
                
                <p>{phrase}</p>
                <button 
                    title="Toggle Hint"
                    onClick={ () => setShowHint(showHint => !showHint)}
                >
                    Show Hint
                </button>
                <p className={ showHint ? styles.hintShown : styles.hintHidden } >
                    hint: {context_phrase}
                </p>
                <input 
                    type="text"
                    placeholder="Answer"
                    onChange={ (e) => setAnswer(e.target.value) } 
                    value={answer} />
                { 
                    answered ?
                    <div>
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

                        <button 
                            title={ last ? "See Results" : "Next Question"}
                            onClick={ () => updateProgress() }
                        >
                            { last ? "Results" : "Next" }
                        </button>
                    </div> :
                    <button 
                        title="Submit Answer" 
                        onClick={ () => handleAnswer() }
                    >Answer</button>
                }
            </div>
        )
}

export default PracticeQuestion;
