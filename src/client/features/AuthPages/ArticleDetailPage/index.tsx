import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Article } from '../../../interfaces';
import styles from './articleDetail.module.scss';

import GoBackButton from '../../../common/components/GoBackButton';

const ArticleDetailPage = () => {
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
  const [highlightedWord, setHighlightedWord] = useState<HighlightedWord>(null);

  type HighlightedWord = null | string;

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

  function handleDefineClick() {
    console.log(highlightedWord);
  }

  const DefineWordButton = () => {
    if (highlightedWord === null || highlightedWord === '') return <></>;

    return (
      <button onClick={handleDefineClick} className={styles.defineWordButton}>
        Define Word
      </button>
    );
  };

  // Scroll to top on render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // add event listener for when user selects text
  useEffect(() => {
    function handleSelect() {
      let word: string | undefined = window.getSelection()?.toString();

      if (word === null || word === undefined) {
        return;
      } else {
        setHighlightedWord(word);
      }
    }

    document.addEventListener('selectionchange', handleSelect);

    return () => document.removeEventListener('selectionchange', handleSelect);
  }, []);

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
      <DefineWordButton />
    </article>
  );
};

export default ArticleDetailPage;
