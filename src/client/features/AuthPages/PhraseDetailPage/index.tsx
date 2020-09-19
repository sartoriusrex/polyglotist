import React from 'react';
import { useLocation } from 'react-router-dom';

import { LocationState } from '../../../interfaces';

const PhraseDetailPage = () => {
    const location: {
        state: LocationState
    } = useLocation();

    let phraseObject;

    if (location.state !== null &&
        location.state !== undefined &&
        location.state.phrase) {
        const { phrase, created_at, strength, translation, language, article, context_phrase } = location.state.phrase;

        phraseObject = {
            phrase,
            created_at,
            strength,
            translation,
            language,
            article,
            context_phrase
        }
    } else {
        return <></>
    }

    return (
        <section>
            <h1>{phraseObject.phrase}</h1>
        </section>
    )
}

export default PhraseDetailPage;