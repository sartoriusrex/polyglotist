import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { newArticlesSelector } from '../../slices/newArticles';
import { authSelector } from '../../slices/auth';
import { phrasesSelector } from '../../slices/phrases';
import { articlesSelector } from '../../slices/articles';

import { ArticleObject, phraseInterface } from '../../interfaces';

import ChevronDown from '../../images/ChevronDown';
import ArticleCard from '../../components/ArticleCard';

import styles from './dashboard.module.scss';

const Dashboard = () => {
  const { newArticles } = useSelector(newArticlesSelector);
  const { articles } = useSelector(articlesSelector);
  const { phrases } = useSelector(phrasesSelector);
  
  const { user } = useSelector(authSelector);
  const startingShow: number = 3;
  const [showNumber, setShowNumber] = useState(startingShow);
  const numArticles: number = newArticles
    ? newArticles
      .map((articleObject: ArticleObject) => articleObject.articles)
      .flat().length
    : 0;
  const sortedPhrases = phrases
    .map( (phrase: phraseInterface) => phrase )
    .sort( (a: phraseInterface, b: phraseInterface) => {
      return a.strength - b.strength;    
    })
    .slice(0,5);

  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <p>No Articles</p>
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

  function renderVocab(phrases: phraseInterface[]) {
    return (
      <table>
        <tbody>
        { phrases.map( (phraseItem: phraseInterface) => {
          const { 
            phrase_id, 
            phrase, 
            strength, 
            last_practiced 
          } = phraseItem;
          const datePracticed = new Date(last_practiced);
          console.log(datePracticed.getDate())
          const formattedDate = `${datePracticed.getDate()}/${datePracticed.getMonth() + 1}/${datePracticed.getFullYear()}`

          return (
            <tr key={phrase_id}>
              <td>{phrase}</td>
              <td>{strength}</td>
              <td>{formattedDate}</td>
            </tr>
          )
        }) }
        </tbody>
      </table>
    )
  }

  return (
    <section id={styles.articlesSection}>

      <h1>New Articles</h1>
      {renderArticleCards(newArticles)}
      {numArticles !== showNumber && <MoreButton />}

      <h2>Practice Vocab</h2>
      {renderVocab(sortedPhrases)}

      <h2>Recent Articles</h2>

      <h2>Practice Statistics</h2>

    </section>
  );
};

export default Dashboard;
