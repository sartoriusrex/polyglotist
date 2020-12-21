import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { newArticlesSelector } from '../../slices/newArticles';
import { authSelector } from '../../slices/auth';
import { ArticleObject } from '../../interfaces';
import ChevronDown from '../../images/ChevronDown';
import ArticleCard from '../../components/ArticleCard';

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

          return articles.map((article, index) => {
            count++;

            return (
              <ArticleCard
                key={article.url}
                article={article}
                sourceId={source.name}
                count={count}
                showNumber={showNumber}
                username={user.username}
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
