import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { LocationState, Article } from '../../../interfaces';
import styles from './phrasesDetailPage.module.scss';
import { authSelector } from '../../../slices/auth';
import { articlesSelector } from '../../../slices/articles';
import GoBackButton from '../../../common/components/GoBackButton';

const PhraseDetailPage = () => {
    const location: {
        state: LocationState
    } = useLocation();

    const { user } = useSelector(authSelector);
    const { articles } = useSelector(articlesSelector);

    let phraseObject: {
        phrase_id: string;
        phrase: string;
        createdDate: string;
        createdTime: string;
        strength: number;
        translation: string;
        language: string;
        article: string;
        context_phrase: string;
    };

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

    let selectedArticle = articles.filter((storeArticle: Article) => storeArticle.title === phraseObject.article)[0];
    selectedArticle = {
        ...selectedArticle,
        source: selectedArticle.source.split('').map((el: string, idx: number) => idx === 0 ? el[idx].toUpperCase() : el).join('')
    }
    const title = selectedArticle.title.replace(/[\W_]+/g, '-');
    const bodyLength = selectedArticle.body
        .map((bodyArray: string[]) => bodyArray[1])
        .join()
        .split(' ').length;

    return (
        <section className={styles.phraseDetailPageSection}>
            <div>
                <GoBackButton />
                <h1>{phraseObject.phrase}</h1>
            </div>
            <ul>
                <li>
                    <span>Defintion</span>
                    <p>{phraseObject.translation}</p>
                </li>
                <li>
                    <span>Language</span>
                    <p>{phraseObject.language.split('').map((el: string, idx: number) => idx === 0 ? el[idx].toUpperCase() : el).join('')}</p>
                </li>
                <li>
                    <span>Strength</span>
                    <p>{phraseObject.strength}</p>
                </li>
                <li>
                    <span>Context Phrase</span>
                    <p>{phraseObject.context_phrase}</p>
                </li>
                <li>
                    <span>Article Source</span>
                    <Link
                        to={{
                            pathname: `/${user.username}/articles/${title}`,
                            state: {
                                article: selectedArticle,
                                sourceName: selectedArticle.source,
                                wordCount: bodyLength,
                            }
                        }}
                    >
                        {phraseObject.article}
                    </Link>
                </li>
                <li>
                    <span>Created</span>
                    <p>{phraseObject.createdDate}, {phraseObject.createdTime}</p>
                </li>
            </ul>
        </section >
    )
}

export default PhraseDetailPage;