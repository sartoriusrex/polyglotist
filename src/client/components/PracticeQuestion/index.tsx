import React from 'react';

import { phraseInterface } from '../../interfaces';

import styles from './practiceQuestion.module.scss';

const PracticeQuestion = (
    { 
        phrase_id,
        phrase,
        translation,
        context_phrase,
        article
    } : {
        phrase_id: string,
        phrase: string,
        translation: string,
        context_phrase: string,
        article: string
    }
    ) => {
    return (
        <div 
            key={phrase_id}
            className={styles.questionContainer}>
            <p>{phrase}</p>
            <p>{translation}</p>
            <p>{context_phrase}</p>
            <p>{article}</p>
        </div>
    )
}

export default PracticeQuestion;
