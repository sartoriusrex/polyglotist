import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAllArticles, articlesSelector } from '../../../slices/articles';
import { authSelector } from '../../../slices/auth';

import { Article } from '../../../interfaces';

const ArticlesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { articles } = useSelector(articlesSelector);

  useEffect(() => {
    dispatch(fetchAllArticles(user.id));
  }, [])

  function renderArticlesList(articles: Article[]) {
    return articles.map((article: Article) => {
      return (
        <li key={article.title}>
          {article.title}
        </li>
      )
    })
  }

  return (
    <section>
      <h1>Your Articles</h1>
      <ul>
        {renderArticlesList(articles)}
      </ul>
    </section>
  )
}

export default ArticlesPage;