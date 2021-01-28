import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { newArticlesSelector } from '../../slices/newArticles';
import { authSelector } from '../../slices/auth';
import { phrasesSelector } from '../../slices/phrases';
import { articlesSelector } from '../../slices/articles';

import { 
  Article, 
  phraseInterface 
} from '../../interfaces';

import ChevronDown from '../../images/ChevronDown';
import ArticleCard from '../../components/ArticleCard';
import Strength from '../../components/Strength';

import styles from './dashboard.module.scss';

const Dashboard = () => {
  const { articles: newArticles } = useSelector(newArticlesSelector);
  const { articles } = useSelector(articlesSelector);
  const { phrases } = useSelector(phrasesSelector);
  const { user } = useSelector(authSelector);

  const sortedPhrases = phrases
    .map( (phrase: phraseInterface) => phrase )
    .sort( (a: phraseInterface, b: phraseInterface) => {
      return a.strength - b.strength;    
    })
    .slice(0,5);

  const recentArticles = articles
    .map( (article: Article) => article )
    .sort( (a: Article, b: Article) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return aDate.getTime() - bDate.getTime();
    });

  const newArticlesDisplayed = newArticles?.map( (articleObject: { articles: Article[]}) => {
    return articleObject.articles.map( (article: Article) => {
      return article;
    })
  }).flat(2);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const MoreButton = ({
      numArticles,
      showNumber,
      setShowNumber,
      startingShow,
    }: {
      numArticles: number;
      showNumber: number;
      setShowNumber: Function;
      startingShow: number;
    }) => {

    function onMoreClick() {
      if (numArticles > showNumber) {
        setShowNumber(
          showNumber + Math.min(startingShow, numArticles - showNumber)
        );
      }
    }

    if (numArticles <= showNumber ) {
      return <></>
    }

    return (
      <button 
        className={styles.MoreButton} 
        onClick={() => onMoreClick()}
      >
        More
        <ChevronDown />
      </button>
    );
  };

  const ArticlesList = ({articles}: {articles: Article[]}) => {
    const startingShow: number = 3;
    const [showNumber, setShowNumber] = useState(startingShow);
    const numArticles = articles?.flat().length;
    let count = 0;

    if (!articles || articles.length <= 0)
      return (
        <div>
          <p>No Articles</p>
        </div>
      );

    return (
      <>
        <ul>
          {articles.map((article: Article) => {
            count++;

            return (
              <ArticleCard
                key={article.url}
                article={article}
                sourceId={article.source}
                count={count}
                showNumber={showNumber}
                username={user.username}
              />
            );
          })}
        </ul>

        <MoreButton 
          startingShow={startingShow}
          showNumber={showNumber}
          setShowNumber={setShowNumber}
          numArticles={numArticles}
        />
      </>
    );
  }

  const VocabList = ({phrases}: {phrases: phraseInterface[]}) => {
    if( !phrases || phrases.length <= 0 ) {
      return (
        <div>
          <p>No Phrases</p>
        </div>
      )
    }
    return (
      <table>
        <thead>
          <tr>
            <td>Phrase</td>
            <td>Strength</td>
            <td>Last Practiced</td>
          </tr>
        </thead>

        <tbody>
        { phrases.map( (phraseItem: phraseInterface) => {
          const { 
            phrase_id, 
            phrase, 
            strength, 
            last_practiced 
          } = phraseItem;
          const datePracticed = new Date(last_practiced);
          const formattedDate = `${datePracticed.getDate()}/${datePracticed.getMonth() + 1}/${datePracticed.getFullYear()}`;
          const today = new Date();
          const differenceInDays = Math.floor((today.getTime() - datePracticed.getTime()) / (1000 * 3600 * 24));
          let lastPracticeDisplay;

          if( differenceInDays < 4 ) {
            let days;

            if( differenceInDays === 1 ) {
              days = 'day';
            } else {
              days = 'days';
            }

            if( differenceInDays === 0 ) {
              lastPracticeDisplay = 'Today';
            } else {
              lastPracticeDisplay = `${differenceInDays} ${days} ago`;
            }
          } else {
            lastPracticeDisplay = formattedDate;
          }


          return (
            <tr key={phrase_id}>
              <td>{phrase}</td>
              <td><Strength strength={strength} /></td>
              <td>{lastPracticeDisplay}</td>
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
      <ArticlesList articles={newArticlesDisplayed} />

      <h2>Practice Vocab</h2>
      <VocabList phrases={sortedPhrases} />
      <div>
        <Link
          to={`/${user.username}/practice`}
        >Review Vocab</Link>
      </div>

      <h2>Recent Articles</h2>
      <ArticlesList articles={recentArticles} />

      <h2>Statistics</h2>

    </section>
  );
};

export default Dashboard;
