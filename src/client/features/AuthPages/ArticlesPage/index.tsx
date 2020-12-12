import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAllArticles, articlesSelector } from '../../../slices/articles';
import { authSelector } from '../../../slices/auth';

import { Article } from '../../../interfaces';

import ArticleCard from '../../ArticleCard';

import styles from './articlePage.module.scss';

const ArticlesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { articles } = useSelector(articlesSelector);

  useEffect(() => {
    dispatch(fetchAllArticles(user.id));
  }, [])

  function renderArticlesList(articles: Article[]) {
    if (articles.length === 0) {
      return <h2>No saved articles.</h2>
    }

    let count = articles.length;
    let showNumber = articles.length;

    return articles.map((article: Article) => {
      return (
        <ArticleCard
          key={article.title}
          article={article}
          sourceId={article.source}
          count={count}
          showNumber={showNumber}
          username={user.username}
        />
      )
    })
  }

  return (
    <section className={styles.articlePage}>
      <h1>Your Articles</h1>
      <ul>
        {renderArticlesList(articles)}
      </ul>
    </section>
  )
}

export default ArticlesPage;