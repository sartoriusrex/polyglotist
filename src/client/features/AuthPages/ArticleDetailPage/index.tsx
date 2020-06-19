import React from 'react';
import { useLocation } from 'react-router-dom';

import styles from './articleDetailPage.module.scss';

const ArticleDetailPage = () => {
  const location = useLocation();
  console.log(location);

  return (
    <section>
      <h1>Article Title</h1>
      <p>Article Body</p>
    </section>
  );
};

export default ArticleDetailPage;
