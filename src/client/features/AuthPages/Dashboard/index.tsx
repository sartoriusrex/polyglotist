import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { newArticlesSelector } from '../../../slices/newArticles';

import styles from './dashboard.module.scss';

const Dashboard = () => {
  const { articles } = useSelector(newArticlesSelector);
  const startingShow: number = 3;
  const [showNumber, setShowNumber] = useState(startingShow);
  const numArticles: number = articles
    ? articles
        .map((articleObject: ArticleObject) => articleObject.articles)
        .flat().length
    : 0;

  interface Source {
    name: string;
    url: string;
    language: string;
    id?: string;
  }

  interface Article {
    title: string;
    date: string;
    url: string;
    language: string;
    body: string[][];
  }

  interface ArticleObject {
    source: Source;
    articles: Article[];
  }

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

    return (
      <li
        className={
          count <= showNumber ? styles.ArticleCard : styles.ArticleCardHidden
        }
        key={article.title}
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
      </button>
    );
  };

  function renderArticleCards(articles: ArticleObject[]) {
    let count: number = 0;

    return (
      <ul>
        {articles.map((articleObject: ArticleObject, idx: number) => {
          const { source, articles } = articleObject;

          return articles.map((article, index) => {
            const { body } = article;
            const bodyLength = body
              .map((bodyArray) => bodyArray[1])
              .join()
              .split(' ').length;
            count++;

            return (
              <ArticleCard
                key={article.title}
                article={article}
                source={source.url}
                count={count}
                bodyLength={bodyLength}
              />
            );
          });
        })}
      </ul>
    );
  }

  return (
    <section id={styles.articlesSection}>
      <h2>New Articles</h2>
      {articles && renderArticleCards(articles)}
      {numArticles !== showNumber && <MoreButton />}
    </section>
  );
};

export default Dashboard;
