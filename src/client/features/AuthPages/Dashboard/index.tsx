import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { newArticlesSelector } from '../../../slices/newArticles';

import styles from './dashboard.module.scss';

const Dashboard = () => {
  const { articles } = useSelector(newArticlesSelector);

  const ArticleCard = ({ article, source, count }) => {
    const date = new Date(article.date);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      date
    );
    const day = date.getDate();
    const year = date.getFullYear();

    return (
      <div className={styles.ArticleCard} key={article.title}>
        <div className={styles.ArticleCardHeader}>
          <p className={styles.date}>
            {day} {month.slice(0, 3)} '{year.toString().slice(2, 4)}
          </p>
          <p className={styles.source}>{source}</p>
          <p className={styles.language}>
            {article.language.charAt(0).toUpperCase() +
              article.language.slice(1)}
          </p>
          <p className={styles.wordCount}>{count} Words</p>
        </div>
        <p className={styles.ArticleCardTitle}>{article.title}</p>
      </div>
    );
  };

  interface Articles {
    source: {
      name: string;
      url: string;
      language: string;
      id?: string;
    };
    articles: {
      title: string;
      date: string;
      url: string;
      language: string;
      body: string[][];
    }[];
  }

  function renderArticleCards(articles: Articles[]) {
    return articles.map((articleObject) => {
      const { source, articles } = articleObject;

      return articles.map((article) => {
        const { body } = article;
        const bodyLength = body
          .map((bodyArray) => bodyArray[1])
          .join()
          .split(' ').length;

        return (
          <ArticleCard
            key={article.title}
            article={article}
            source={source.url}
            count={bodyLength}
          />
        );
      });
    });
  }

  return (
    <section id={styles.articlesSection}>
      <h2>New Articles</h2>
      {articles && renderArticleCards(articles)}
    </section>
  );
};

export default Dashboard;
