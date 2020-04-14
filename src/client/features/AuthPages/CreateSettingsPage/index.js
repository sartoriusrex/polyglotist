import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsSelector, updateSettings } from '../../../slices/settings';
import { removeMessage, messageSelector } from '../../../slices/messages';
import { authSelector } from '../../../slices/auth';

const CreateSettingsPage = () => {
  const dispatch = useDispatch();
  const { loading, hasErrors } = useSelector(settingsSelector);
  const { message } = useSelector(messageSelector);
  const { user } = useSelector(authSelector);
  const { username } = user;

  function handleSubmit(e) {
    e.preventDefault();

    console.log(e);
  }

  return (
    <section>
      <h1>Create Settings</h1>

      <form
        action={`/api/user/${username}`}
        method='PATCH'
        onSubmit={handleSubmit}
      >
      </form>
    </section>
  )
}

export default CreateSettingsPage;