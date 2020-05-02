import React from 'react';

import './landing-page.scss';

import CtaButton from '../../UnauthComponents/CtaButton';

const LandingPage = () => (
  <section id='hero'>
    <div class='hero-content'>
      <h1>
        A simple app for expanding your foreign vocabulary.
      </h1>
      <p>
        Polyglotist lets you read foreign texts, look up phrases without leaving the page, and review learned vocabulary with spaced repetition
      </p>
      <div class='cta-container'>
        <CtaButton />
      </div>
    </div>
  </section>
);

export default LandingPage;
