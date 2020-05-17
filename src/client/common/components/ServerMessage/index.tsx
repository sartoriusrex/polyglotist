import React from 'react';
import { useSelector } from 'react-redux';

import { messageSelector } from '../../../slices/messages';

import styles from './serverMessage.module.scss';

const ServerMessage = () => {
  const { message } = useSelector(messageSelector);

  if (message) {
    return <p className={styles.serverMessage}>{message}</p>;
  } else {
    return null;
  }
};

export default ServerMessage;
