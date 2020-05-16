import React from 'react';
import { Link } from 'react-router-dom';

import './landing-page.scss';
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
        <div className='hero-title-container'>
          <h1>A simple app for expanding your foreign vocabulary.</h1>
          <Hero />
        </div>
        <p>
          Polyglotist lets you read foreign texts, look up phrases without
          leaving the page, and review learned vocabulary with spaced repetition
        </p>
        <div className='cta-container'>
          <CtaButton />
        </div>
      </div>
    </section>
    <section className='landing-section'>
      <div className='section-title-container'>
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
    <section className='landing-section striped-section'>
      <div className='striped-section-content'>
        <div className='section-title-container'>
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
    <section className='landing-section'>
      <div className='section-title-container'>
        <Integrated />
        <h2>Integrated</h2>
      </div>
      <div className='section-content-container'>
        <p>
          Look up words and phrases immediately from the app, without leaving
          the article. Save it for later review.
        </p>
        <div className='landing-image-container'>
          <img src={integratedPNG} alt='integrated gif' />
        </div>
      </div>
    </section>
    <section className='landing-section striped-section'>
      <div className='striped-section-content'>
        <div className='section-title-container'>
          <Powerful />
          <h2>Powerful</h2>
        </div>
        <div className='section-content-container scc-reversed'>
          <div className='landing-image-container'>
            <img src={integratedPNG} alt='powerful gif' />
          </div>
          <p>
            Use timed reptition flashcards to solidify your vocabulary and track
            your progress.
          </p>
        </div>
      </div>
    </section>
    <section className='landing-section cta-section'>
      <h2>Ready to learn?</h2>
      <p>Create an account to get started</p>
      <CtaButton />
    </section>
    <footer>
      <div className='footer-content-container'>
        <div className='footer-brand-container'>
          <Brand className='brand-svg' />
        </div>
        <div className='footer-content-links'>
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
