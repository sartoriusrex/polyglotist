import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { newArticlesSelector } from '../../../slices/newArticles';
import { authSelector } from '../../../slices/auth';
import { sources as sourcesList } from '../../SourceList';
import { Source, Article, ArticleObject } from '../../../interfaces';
import ChevronDown from '../../../images/ChevronDown';

import styles from './dashboard.module.scss';

const Dashboard = () => {
  const { articles } = useSelector(newArticlesSelector);
  const { user } = useSelector(authSelector);
  const startingShow: number = 3;
  const [showNumber, setShowNumber] = useState(startingShow);
  const numArticles: number = articles
    ? articles
      .map((articleObject: ArticleObject) => articleObject.articles)
      .flat().length
    : 0;

  const ArticleCard = (props: {
    article: Article;
    count: number;
    bodyLength: number;
    source: string;
  }) => {
    const { article, count, source, bodyLength } = props;
    const date = new Date(article.date);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      date
    );
    const day = date.getDate();
    const year = date.getFullYear();
    const title = article.title.replace(/[\W_]+/g, '-');

    return (
      <li
        className={
          count <= showNumber ? styles.ArticleCard : styles.ArticleCardHidden
        }
        key={article.url}
      >
        <Link
          to={{
            pathname: `/${user.username}/articles/${title}`,
            state: {
              article,
              sourceName: source,
              wordCount: bodyLength,
            },
          }}
        >
          <div className={styles.ArticleCardHeader}>
            <p className={styles.date}>
              {day} {month.slice(0, 3)} '{year.toString().slice(2, 4)}
            </p>
            <p className={styles.source}>{source}</p>
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

  function onMoreClick() {
    if (numArticles > showNumber) {
      setShowNumber(
        showNumber + Math.min(startingShow, numArticles - showNumber)
      );
    }
  }

  const MoreButton = () => {
    return (
      <button className={styles.MoreButton} onClick={onMoreClick}>
        More
        <ChevronDown />
      </button>
    );
  };

  function renderArticleCards(articles: ArticleObject[]) {
    if (!articles)
      return (
        <div>
          <p>Loading...</p>
        </div>
      );

    let count: number = 0;

    return (
      <ul>
        {articles.map((articleObject: ArticleObject, idx: number) => {
          const { source, articles } = articleObject;
          const sourceObjects = Object.values(sourcesList).flat();
          let sourceName: string;

          sourceObjects.forEach(
            (src: { name: string; id: string; desc: string }) => {
              if (src.id === source.name) {
                sourceName = src.name;
              }
            }
          );

          return articles.map((article, index) => {
            const { body } = article;
            const bodyLength = body
              .map((bodyArray) => bodyArray[1])
              .join()
              .split(' ').length;
            count++;

            return (
              <ArticleCard
                key={article.url}
                article={article}
                source={sourceName}
                count={count}
                bodyLength={bodyLength}
              />
            );
          });
        })}
      </ul>
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id={styles.articlesSection}>
      <h1>New Articles</h1>
      {renderArticleCards(articles)}
      {numArticles !== showNumber && <MoreButton />}
    </section>
  );
};

export default Dashboard;
