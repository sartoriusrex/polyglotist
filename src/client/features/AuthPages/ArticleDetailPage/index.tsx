import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './articleDetail.module.scss';

const ArticleDetailPage = () => {
  const location = useLocation();
  const { article, sourceName } = location.state;
  const articleDate = new Date(article.date).toLocaleDateString();

  function renderBody(bodyArray: string[][]) {
    return bodyArray.map((bodyElement: string[]) => {
      let element = bodyElement[0].toLowerCase();

      return React.createElement(
        element,
        { className: styles.bodyElement, key: bodyElement[1] },
        bodyElement[1]
      );
    });
  }

  return (
    <article className={styles.article}>
      <div>
        <p>{articleDate}</p>
        <p>{sourceName}</p>
      </div>
      <h1>{article.title}</h1>
      {renderBody(article.body)}
    </article>
  );
};

export default ArticleDetailPage;
