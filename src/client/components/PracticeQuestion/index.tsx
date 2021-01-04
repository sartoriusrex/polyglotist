import React from 'react';

import styles from './practiceQuestion.module.scss';

const PracticeQuestion = ({ 
        phrase_id,
        phrase,
        translation,
        context_phrase,
        article,
        submit,
        progress,
        index,
    } : {
        phrase_id: string,
        phrase: string,
        translation: string,
        context_phrase: string,
        article: string,
        submit: Function,
        progress: number,
        index: number
    }) => {
        const formats = [
            'multipleChoice',
            'sentenceCompletion'
        ]
        const randomInteger = Math.floor(Math.random() * (formats.length - 1 ));

        return (
            <div 
                key={phrase_id}
                className={ 
                    progress === index ? 
                    styles.questionContainerVisible :
                    styles.questionContainerHidden
                    }>
                <p>{phrase}</p>
                <p>{translation}</p>
                <p>{context_phrase}</p>
                <p>{article}</p>
            </div>
        )
}

export default PracticeQuestion;
