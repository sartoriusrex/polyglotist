import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector, updateSettings } from '../../../slices/settings';
import { removeMessage, messageSelector } from '../../../slices/messages';

const CreateSettingsPage = () => {
  const dispatch = useDispatch();
  const { loading, hasErrors } = useSelector(settingsSelector);
  const { message } = useSelector(messageSelector);

  return (
    <section>
      <h1>Create Settings</h1>

      <form action="">
      </form>
    </section>
  )
}

export default CreateSettingsPage;