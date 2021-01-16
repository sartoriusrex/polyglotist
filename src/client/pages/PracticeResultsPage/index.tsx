import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'

import { practiceSelector } from '../../slices/practice';

import styles from './practiceResultsPage.module.scss';

const PracticeResultsPage = () => {
    const { 
        loadingResults, 
        resultsHasErrors, 
        results
    } = useSelector(practiceSelector);

    function displayResults() {
        console.log(results);
        /*
            change: (-1, 0, 1);
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

        /*
            should display some statistics, such as total correct,
            which ones had errors, and their correct answers, and
            for each phrase, whether or not the strength increased,
            decreased, or stayed the same
        */
        // return results.map( result => {
        //     <div>{result}</div>
        // })
    }

    if (loadingResults ) {
        return <div>Loading...</div>
    }

    if ( resultsHasErrors ) {
        return <div>Error displaying the results</div>
    }

    return (
        <section>
            <h1>Results</h1>

            { displayResults() }
        </section>
    )
}

export default PracticeResultsPage;