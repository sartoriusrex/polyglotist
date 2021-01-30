import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { newArticlesSelector } from '../../slices/newArticles';
import { authSelector } from '../../slices/auth';
import { phrasesSelector } from '../../slices/phrases';
import { articlesSelector } from '../../slices/articles';

import { 
  Article, 
  phraseInterface, 
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
  const today = new Date().getTime();
  const millInOneDay = 1000 * 60 * 60 * 24;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sortedPhrases = phrases
    .map( (phrase: phraseInterface) => phrase )
    .sort( (a: phraseInterface, b: phraseInterface) => {
      return a.strength - b.strength;    
    })
    .slice(0,5);

  function numPhrasesPracInNDays(days: number, phrases: phraseInterface[]) {
    return phrases.filter( (phrase: phraseInterface) => {
      let lastPracticed = new Date(phrase.last_practiced).getTime();
      let diff = today - lastPracticed;
      
      return diff <= millInOneDay * days;
    }).length;
  }

  function numArticlesReadInNDays(days: number, articles: Article[]) {
    return articles.filter( (article: Article) => {
      let read = article.read? article.read : null;

      if (!read) {
        return false;
      } else {
        let lastRead = new Date(read).getTime();
        let diff = today - lastRead
        
        return diff <= millInOneDay * days;
      }
    }).length;
  }

  function numAvg8WeekReadPerWeek(articles: Article[]) {
    let num = numArticlesReadInNDays(56, articles);

    return Math.floor(num / 8 );
  }

  // Build up practice stats per language and all languages combined
  // Number of words
  // average stength
  // num practiced last 7 days, last 30 days
  // Num articles read last 7 days and last 30 days
  // avg articles read per week last 8 weeks
  // average correct last 7 days and last 30 days

  const practiceStats = phrases.reduce((
    accumulator: any, 
    currentPhrase: 
    phraseInterface, 
    idx: number, 
    phrases: phraseInterface[]
    ) => {

    let property = accumulator[currentPhrase.language];

    if (!property) {
      let langPhrases = phrases.filter( (phrase: phraseInterface) => phrase.language === currentPhrase.language);
      let langArticles = articles.filter( (article: Article) => article.language === currentPhrase.language);

      accumulator[currentPhrase.language] = {
        numPhrases: 1,
        totalStrength: currentPhrase.strength,
        avgStrength: currentPhrase.strength,
        numPracticedLast7: numPhrasesPracInNDays(7, langPhrases),
        numPractiedLast30: numPhrasesPracInNDays(30, langPhrases),
        numArtReadLast7: numArticlesReadInNDays(7, langArticles),
        numArtReadLast30: numArticlesReadInNDays(30, langArticles),
        avgArtReadLast8Weeks: numAvg8WeekReadPerWeek(langArticles),
      }
    } else {
      accumulator[currentPhrase.language].numPhrases++;
      accumulator[currentPhrase.language].totalStrength += currentPhrase.strength;
      accumulator[currentPhrase.language].avgStrength = Math.floor(property.totalStrength / property.numPhrases);
    }

    accumulator['all'].numPhrases++;
    accumulator['all'].totalStrength += currentPhrase.strength;
    accumulator['all'].avgStrength = Math.floor(accumulator['all'].totalStrength / accumulator['all'].numPhrases);


    return accumulator;
  }, {all: {
    numPhrases: 0,
    totalStrength: 0,
    avgStrength: 0,
    numPracticedLast7: numPhrasesPracInNDays(7, phrases),
    numPractiedLast30: numPhrasesPracInNDays(30, phrases),
    numArtReadLast7: numArticlesReadInNDays(7, articles),
    numArtReadLast30: numArticlesReadInNDays(30, articles),
    avgArtReadLast8Weeks: numAvg8WeekReadPerWeek(articles),
  }});

  const Stats = ({stats} : {stats: any}) => {
    let statsData = Object.entries(stats).sort( (a: any, b: any) => a[0] - b[0]);

    return (
      <>
        { statsData.map( (stat: any) => {
          return(
            <div key={stat[0]}>
              <h3>{stat[0]}</h3>
              <p>{stat[1].avgStrength}</p>
            </div>
          )
        }) }
      </>
    )
  }


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
      <div className={styles.articleSection}>
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
      
      </div>
    );
  }

  const VocabList = ({phrases}: {phrases: phraseInterface[]}) => {
    if( !phrases || phrases.length <= 0 ) {
      return (
        <div className={styles.vocabList}>
          <p>No Phrases</p>
        </div>
      )
    }
    return (
      <table className={styles.vocabList}>
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
    <section id={styles.dashboardSection}>

      <h1>New Articles</h1>
      <ArticlesList articles={newArticlesDisplayed} />

      <h2>Practice Vocab</h2>
      <VocabList phrases={sortedPhrases} />
      <div className={styles.vocabLink}>
        <Link
          to={`/${user.username}/practice`}
        >Review Vocab</Link>
      </div>

      <h2>Recent Articles</h2>
      <ArticlesList articles={recentArticles} />

      <h2>Statistics</h2>
      <Stats stats={practiceStats}/>

    </section>
  );
};

export default Dashboard;
