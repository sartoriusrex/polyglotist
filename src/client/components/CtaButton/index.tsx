import React from 'react';
import { Link } from 'react-router-dom';

import styles from './ctaButton.module.scss';

const CtaButton = () => {
  return (
    <Link to='/signup'>
      <button className={styles.ctaButton}>Get Started</button>
    </Link>
  );
};

export default CtaButton;
