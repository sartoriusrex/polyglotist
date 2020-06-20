import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Article } from '../../../interfaces';
import styles from './articleDetail.module.scss';

import GoBackButton from '../../../common/components/GoBack';

const ArticleDetailPage = () => {
  const location: {
    state: { article: Article; sourceName: string };
  } = useLocation();
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
      <div className={styles.articleHeader}>
        <GoBackButton text='<' />
        <p className={styles.articleDate}>{articleDate}</p>
        <p>{sourceName}</p>
        <h1>{article.title}</h1>
      </div>
      {renderBody(article.body)}
    </article>
  );
};

export default ArticleDetailPage;
