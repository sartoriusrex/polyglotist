import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'

import { practiceSelector } from '../../slices/practice';
import { authSelector } from '../../slices/auth';

import styles from './practiceResultsPage.module.scss';
import { phraseResult } from 'client/interfaces';

const PracticeResultsPage = () => {
    const { 
        loadingResults, 
        resultsHasErrors, 
        results
    } = useSelector(practiceSelector);
    const { username } = useSelector(authSelector).user;

    function displayResults() {
        const total = results.length;
        const totalCorrect = results
            .map( (resultItem: phraseResult ) => resultItem.result )
            .filter( (result: number ) => result === 1 )
            .length;

        const percentageCorrect = parseFloat((totalCorrect / total * 100).toFixed(2));
        const passingGrade = percentageCorrect > 70;

        return (
            <div>
                <div className={styles.summaryContainer}>
                    <h2>{totalCorrect} Correct Out Of {total}</h2>
                    <h3 className={ passingGrade ? styles.percentPass : styles.percentFail }>{percentageCorrect} %</h3>
                    { 
                        passingGrade ?
                        <p className={styles.passingMessage}>Good Job!</p> :
                        <p className={styles.failingMessage}>Keep practicing!</p>
                    }

                    <Link to={`/${username}/practice`}>Practice Again</Link>
                </div>

                <table>
                    <thead>
                        <tr>
                            <td>Phrase</td>
                            <td>Answer</td>
                            <td>Strength</td>
                            <td>Strength Change</td>
                        </tr>
                    </thead>

                    <tbody>
                        { results.map( (resultItem: phraseResult) => {
                            const changeDisplay = resultItem.change === 1 ?
                                "Increase" :
                                resultItem.change === -1 ?
                                "Decrease" :
                                "No Change"

                            return (
                                <tr key={resultItem.phrase.phrase_id}>
                                    <td>{resultItem.phrase.phrase}</td>
                                    <td>{resultItem.phrase.translation}</td>
                                    <td>{resultItem.phrase.strength}</td>
                                    <td>{ changeDisplay }</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )
        /*
            change: (-1, 0, 1);
            result: (1, -1);
            phrase: {
                article title,
                context,
                created at (needs to change to last practiced),
                language,
                phrase,
                phrase id,
                strength,
                translation
            }
        */
    }

    if (loadingResults ) {
        return <div>Loading...</div>
    }

    if ( resultsHasErrors ) {
        return <div>Error displaying the results</div>
    }

    return (
        <section className={styles.resultsPageSection}>
            <h1>Results</h1>

            { displayResults() }
        </section>
    )
}

export default PracticeResultsPage;