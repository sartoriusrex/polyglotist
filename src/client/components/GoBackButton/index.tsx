import React from 'react';
import { useHistory } from 'react-router-dom';

import styles from './goBack.module.scss';
import ChevronBoxLeft from '../../images/ChevronBoxLeft';

const GoBackButton = () => {
  const history = useHistory();

  function handleClick() {
    history.go(-1);
  }

  return (
    <button className={styles.goBackButton} onClick={handleClick}>
      <ChevronBoxLeft />
    </button>
  );
};

export default GoBackButton;
