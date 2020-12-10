import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAllArticles, articlesSelector } from '../../../slices/articles';
import { authSelector } from '../../../slices/auth';

import { Article } from '../../../interfaces';

import styles from './articlePage.module.scss';

const ArticlesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { articles } = useSelector(articlesSelector);

  useEffect(() => {
    dispatch(fetchAllArticles(user.id));
  }, [])

  function renderArticlesList(articles: Article[]) {
    return articles.map((article: Article) => {
      console.log(article);
      return (
        <li key={article.title}>
          <h2>
            {article.title}
          </h2>
          <time>{article.date}</time>
          <p>{article.language}</p>
          <p>{article.source}</p>
        </li>
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