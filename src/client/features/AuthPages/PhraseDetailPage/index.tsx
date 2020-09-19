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
        const { phrase_id, phrase, created_at, strength, translation, language, article, context_phrase } = location.state.phrase;

        const timestamp = new Date(created_at);
        const createdDate = timestamp.toLocaleDateString();
        const createdTime = timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        phraseObject = {
            phrase_id,
            phrase,
            createdDate,
            createdTime,
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
            <ul>
                <li>
                    <span>Defintion</span>
                    {phraseObject.translation}
                </li>
                <li>
                    <span>Language</span>
                    {phraseObject.language}
                </li>
                <li>
                    <span>Strength</span>
                    {phraseObject.strength}
                </li>
                <li>
                    <span>Context Phrase</span>
                    {phraseObject.context_phrase}
                </li>
                <li>
                    <span>Article Source</span>
                    {phraseObject.article}
                </li>
                <li>
                    <span>Created</span>
                    {phraseObject.createdDate}, {phraseObject.createdTime}
                </li>
            </ul>
        </section>
    )
}

export default PhraseDetailPage;