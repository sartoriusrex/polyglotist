import React from 'react';
import { Link } from 'react-router-dom';

import './cta-button.scss';

const CtaButton = () => {
  return (
    <Link to='/signup'>
      <button className='cta-button'>
        Get Started
      </button>
    </Link>
  )
}

export default CtaButton;