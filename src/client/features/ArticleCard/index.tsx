import React from 'react';
import { Link } from 'react-router-dom';

import { Article } from '../../interfaces';
import { sources } from '../SourceList';

import styles from './articleCard.module.scss';

const ArticleCard = (props: {
    article: Article;
    count: number;
    sourceId: string;
    showNumber: number;
    username: string;
}) => {
    const { article, count, sourceId, showNumber, username } = props;
    const date = new Date(article.date);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
        date
    );
    const day = date.getDate();
    const year = date.getFullYear();
    const title = article.title.replace(/[\W_]+/g, '-');

    const bodyLength = article.body
        .map((bodyArray) => bodyArray[1])
        .join()
        .split(' ').length;

    const sourceObjects = Object.values(sources).flat();
    let sourceName: string = sourceObjects.filter((src: { name: string; id: string; desc: string }) => src.id === sourceId)[0].name;

    return (
        <li
            className={
                count <= showNumber ? styles.ArticleCard : styles.ArticleCardHidden
            }
            key={article.url}
        >
            <Link
                to={{
                    pathname: `/${username}/articles/${title}`,
                    state: {
                        article,
                        sourceName: sourceName,
                        wordCount: bodyLength,
                    },
                }}
            >
                <div className={styles.ArticleCardHeader}>
                    <p className={styles.date}>
                        {day} {month.slice(0, 3)} '{year.toString().slice(2, 4)}
                    </p>
                    <p className={styles.source}>{sourceName}</p>
                    <p className={styles.language}>
                        {article.language.charAt(0).toUpperCase() +
                            article.language.slice(1)}
                    </p>
                    <p className={styles.wordCount}>{bodyLength} Words</p>
                </div>
                <p className={styles.ArticleCardTitle}>{article.title}</p>
            </Link>
        </li>
    );
};

export default ArticleCard;