import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'

import { practiceSelector } from '../../slices/practice';
import { authSelector } from '../../slices/auth';

import styles from './practiceResultsPage.module.scss';
import { PhraseResult } from 'client/interfaces';

import Strength from '../../components/Strength';
import ChevronUp from '../../images/ChevronUp';

const PracticeResultsPage = () => {
    const { 
        loadingResults, 
        resultsHasErrors, 
        results
    } = useSelector(practiceSelector);
    const { username } = useSelector(authSelector).user;

    function displayChange(change: number) {
        if (change === 0 ) {
            return '--';
        }

        return (
            <div className={change === -1 ? styles.negativeChange : ''}>
               <ChevronUp change={change} />
            </div>
        )
    }

    function displayResults() {
        const total = results.length;
        const totalCorrect = results
            .map( (resultItem: PhraseResult ) => resultItem.result )
            .filter( (result: number ) => result === 1 )
            .length;

        const percentageCorrect = total !== 0 ? parseFloat((totalCorrect / total * 100).toFixed(2)) : 0;
        const passingGrade = percentageCorrect > 70;

        if (total <= 0 ) {
            return (
                <div className={styles.resultsContainer}>
                    <h2>None</h2>
                </div>
            )
        }

        return (
            <div className={styles.resultsContainer}>
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
                            <td>Change</td>
                        </tr>
                    </thead>

                    <tbody>
                        { results.map( (resultItem: PhraseResult) => {
                            const correct = resultItem.result === 1;
                            const { 
                                phrase, 
                                phrase_id, 
                                translation, 
                                strength 
                            } = resultItem.phrase;
                            

                            return (
                                <tr 
                                    key={phrase_id}
                                    className={ correct ? styles.correct : styles.incorrect }
                                >
                                    <td>{phrase}</td>
                                    <td>{translation}</td>
                                    <td><Strength strength={strength} /></td>
                                    <td>{ displayChange(resultItem.change) }</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )
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