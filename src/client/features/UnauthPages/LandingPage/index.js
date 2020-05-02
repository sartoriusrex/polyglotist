import React from 'react';
import { Link } from 'react-router-dom';

import './landing-page.scss';

import heroSVG from '../../../images/hero.svg';
import dreamSVG from '../../../images/dream.svg';
import relevantSVG from '../../../images/relevant.svg';
import integratedSVG from '../../../images/integrated.svg';
import powerfulSVG from '../../../images/powerful.svg';
import brandSVG from '../../../images/brand.svg';
import integratedPNG from '../../../images/app-screenshot-one.png';

import CtaButton from '../../UnauthComponents/CtaButton';

const LandingPage = () => (
  <>
  <section id='hero'>
    <div class='hero-content'>
      <div class='hero-title-container'>
        <h1>
          A simple app for expanding your foreign vocabulary.
        </h1>
        <img src={heroSVG} alt="Hero image"/>
      </div>
      <p>
        Polyglotist lets you read foreign texts, look up phrases without leaving the page, and review learned vocabulary with spaced repetition
      </p>
      <div class='cta-container'>
        <CtaButton />
      </div>
    </div>
  </section>
  <section class='landing-section'>
    <div class='section-title-container'>
      <img src={dreamSVG} alt="dream image"/>
      <h2>A Logophile’s Dream</h2>
    </div>
    <p>
      Looking up words while reading is annoying. Doing it in another language is worse.  Polyglotist takes foreign texts, strips out everything unnecessary, and allows readers to immediately look up words while reading--without ever leaving the page. 
    </p>
  </section>
  <section class='landing-section striped-section'>
    <div class='striped-section-content'>
      <div class='section-title-container'>
        <img src={relevantSVG} alt="relevant image"/>
        <h2>Relevant</h2>
      </div>
      <p>
        Read from a large selection of foreign language newspapers and magazines, completely free. Save articles for later consumption and reference.
      </p>
    </div>
  </section>
  <section class='landing-section'>
    <div class='section-title-container'>
      <img src={integratedSVG} alt="integrated image"/>
      <h2>Integrated</h2>
    </div>
    <div class='section-content-container'>
      <p>
        Look it up words and phrases immediately from the app, without leaving the article. Save it for later review.
      </p>
      <div class='landing-image-container'>
        <img src={integratedPNG} alt="integrated gif"/>
      </div>
    </div>
  </section>
  <section class='landing-section striped-section'>
    <div class='striped-section-content'>
      <div class='section-title-container'>
        <img src={powerfulSVG} alt="powerful image"/>
        <h2>Powerful</h2>
      </div>
      <div class='section-content-container scc-reversed'>
        <div class='landing-image-container'>
          <img src={integratedPNG} alt="powerful gif"/>
        </div>
        <p>
          Use timed reptition flashcards to solidify your vocabulary and track your progress.
        </p>
      </div>
    </div>
  </section>
  <section class='landing-section cta-section'>
    <h2>
      Ready to learn?
    </h2>
    <p>Create an account to get started</p>
    <CtaButton />
  </section>
  <footer>
    <div class='footer-content-container'>
      <div class='footer-brand-container'>
        <img src={brandSVG} alt="brand image"/>
      </div>
      <div class='footer-content-links'>
        <ul>
          <li>
            <Link to='/privacy'>
              Privacy & Terms
            </Link>
          </li>
          <li>
             <Link to='/contact'>
              Contact
            </Link>
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
