import React from 'react';
import { useSelector } from 'react-redux';

import { messageSelector } from '../../../slices/messages';

import './server-message.scss';

const ServerMessage = () => {
  const { message } = useSelector(messageSelector);

  if (message) {
    return (
      <p className='server-message'>
        {message}
      </p>
    ) 
  } else { return null }
}

export default ServerMessage;