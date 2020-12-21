import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { clearMessage, messageSelector } from '../../slices/messages';

import CloseButton from '../../images/CloseButton';

import styles from './serverMessage.module.scss';

const ServerMessage = () => {
  const { message } = useSelector(messageSelector);
  const location = useLocation();
  const dispatch = useDispatch();

  function closeMessageBox() {
    dispatch(clearMessage(null));
  }

  // after 5 seconds after mounting and after the url location changes, clear the message
  useEffect(() => {
    let mounted = true;
    
    setTimeout(() => {
      if (mounted ) {
        closeMessageBox(); 
      }
    }, 1000 * 5);
  

    return function cleanup() {
      mounted = false;
    }
  }, [location]);

  if (message) {
    return (
      <div className={styles.messageContainer}>
        <CloseButton onClick={closeMessageBox} />
        <p className={styles.serverMessage}>{message}</p>
      </div>
    );
  } else {
    return null;
  }
};

export default ServerMessage;
