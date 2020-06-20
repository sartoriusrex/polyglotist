import React from 'react';
import { useHistory } from 'react-router-dom';

import styles from './goBack.module.scss';

const GoBackButton = ({ text }: { text: string }) => {
  const history = useLocation();

  function handleClick() {
    history.go(-1);
  }

  return (
    <button className={styles.goBackButton} onClick={handleClick}>
      {text}
    </button>
  );
};
