import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Article } from '../../../interfaces';
import { authSelector } from '../../../slices/auth';
import { addOneArticle, articlesSelector } from '../../../slices/articles';
import styles from './articleDetail.module.scss';

import GoBackButton from '../../../common/components/GoBackButton';

const ArticleDetailPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const { articles } = useSelector(articlesSelector);
  const location: {
    state: { article: Article; sourceName: string; wordCount: number };
  } = useLocation();
  const { article, sourceName, wordCount } = location.state;

  const date = new Date(article.date);
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    date
  );
  const day = date.getDate();
  const year = date.getFullYear();

  let existingArticle: Boolean = articles.some((storeArticle: Article) => {
    return storeArticle.title === article.title
  });

  // Update existing article if it is added to the articles state
  useEffect(() => {
    existingArticle = articles.some((storeArticle: Article) => {
      return storeArticle.title === article.title
    });
  }, [articles])

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

  // Scroll to top on render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function addArticle() {
    return dispatch(addOneArticle(user.id, article.title));
  }

  // Check to see if the article being viewed already exists in redux store (meaning it has been added) - if it is, do nothing. Otherwise, dispatch addOneArticle after 1 minute
  useEffect(() => {
    let mounted = true;

    (() => {
      if (existingArticle === false) {
        setTimeout(() => {
          if (mounted) {
            console.log('saving')
            addArticle();
          }
        }, 1000 * 60)
      } else {
        return;
      }
    })()

    return function cleanup() {
      mounted = false;
    }
  }, []);

  const AddArticleButton = () => {
    if (existingArticle) return <></>;

    return (
      <button className={styles.addArticleBtn} onClick={() => addArticle()}>
        Save Article
      </button>
    )
  }

  return (
    <article className={styles.article}>
      <div className={styles.articleHeader}>
        <div className={styles.articleTopBar}>
          <GoBackButton />
          <p>{sourceName}</p>
        </div>
        <div className={styles.articleHeaderContent}>
          <h1>{article.title}</h1>
          <div className={styles.articleHeaderContentDetail}>
            <p>
              {day} {month.slice(0, 3)} {year}
            </p>
            <p>{wordCount} Words</p>
          </div>
        </div>
      </div>
      <div className={styles.articleBodyContainer}>
        {renderBody(article.body)}
      </div>
      {!existingArticle && <AddArticleButton />}
    </article>
  );
};

export default ArticleDetailPage;
