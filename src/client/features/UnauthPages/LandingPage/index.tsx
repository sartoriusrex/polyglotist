import React from 'react';
import { Link } from 'react-router-dom';

import styles from './landingPage.module.scss';

import Hero from '../../../images/Hero';
import Relevant from '../../../images/Relevant';
import Integrated from '../../../images/Integrated';
import Powerful from '../../../images/Powerful';
import Brand from '../../../images/brand.svg';
import integratedPNG from '../../../images/app-screenshot-one.png';

import CtaButton from '../../CtaButton';
import Dream from '../../../images/Dream';

const LandingPage = () => (
  <>
    <section id={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroTitleContainer}>
          <h1>A simple app for expanding your foreign vocabulary.</h1>
          <Hero />
        </div>
        <p>
          Polyglotist lets you read foreign texts, look up phrases without
          leaving the page, and review learned vocabulary with spaced repetition
        </p>
        <div className={styles.ctaContainer}>
          <CtaButton />
        </div>
      </div>
    </section>
    <section className={styles.landingSection}>
      <div className={styles.sectionTitleContainer}>
        <Dream />
        <h2>A Logophile’s Dream</h2>
      </div>
      <p>
        Looking up words while reading is annoying. Doing it in another language
        is worse. Polyglotist takes foreign texts, strips out everything
        unnecessary, and allows readers to immediately look up words while
        reading--without ever leaving the page.
      </p>
    </section>
    <section className={`${styles.landingSection} ${styles.stripedSection}`}>
      <div className={styles.stripedSectionContent}>
        <div className={styles.sectionTitleContainer}>
          <Relevant />
          <h2>Relevant</h2>
        </div>
        <p>
          Read from a large selection of foreign language newspapers and
          magazines, completely free. Save articles for later consumption and
          reference.
        </p>
      </div>
    </section>
    <section className={styles.landingSection}>
      <div className={styles.sectionTitleContainer}>
        <Integrated />
        <h2>Integrated</h2>
      </div>
      <div className={styles.sectionContentContainer}>
        <p>
          Look up words and phrases immediately from the app, without leaving
          the article. Save it for later review.
        </p>
        <div className={styles.landingImageContainer}>
          <img src={integratedPNG} alt='integrated gif' />
        </div>
      </div>
    </section>
    <section className={`${styles.landingSection} ${styles.stripedSection}`}>
      <div className={styles.stripedSectionContent}>
        <div className={styles.sectionTitleContainer}>
          <Powerful />
          <h2>Powerful</h2>
        </div>
        <div
          className={`${styles.sectionContentContainer} ${styles.sccReversed}`}
        >
          <div className={styles.landingImageContainer}>
            <img src={integratedPNG} alt='powerful gif' />
          </div>
          <p>
            Use timed reptition flashcards to solidify your vocabulary and track
            your progress.
          </p>
        </div>
      </div>
    </section>
    <section className={`${styles.landingSection} ${styles.ctaSection}`}>
      <h2>Ready to learn?</h2>
      <p>Create an account to get started</p>
      <CtaButton />
    </section>
    <footer>
      <div className={styles.footerContentContainer}>
        <div className={styles.footerBrandContainer}>
          <Brand className={styles.brandSvg} />
        </div>
        <div className={styles.footerContentLinks}>
          <ul>
            <li>
              <Link to='/privacy'>Privacy & Terms</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
          </ul>
        </div>
      </div>
      <p>
        Copyright Dennis Mai Development Services 2020 | All rights reserved
      </p>
    </footer>
  </>
);

export default LandingPage;
