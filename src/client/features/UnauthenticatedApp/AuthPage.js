import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AuthPage = ({ signup }) => {
  const method = signup ? 'POST' : 'GET';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function togglePasswordVisible() {
    setPasswordVisible(!passwordVisible);
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <section>
      <h1>{signup ? <div>Sign up</div> : <div>Log in</div>}</h1>

      <form action='/api/users' method={method} onSubmit={handleSubmit}>
        <label htmlFor='username'>
          Username
          <input
            name='username'
            id='username'
            type='text'
            onChange={handleUsernameChange}
            value={username}
          />
        </label>
        <label htmlFor='password'>
          Password
          <input
            name='password'
            id='password'
            type={passwordVisible ? 'text' : 'password'}
            onChange={handlePasswordChange}
            value={password}
          />
        </label>
        <button type='submit' onClick={handleSubmit}>
          Submit
        </button>
      </form>
      <button type='button' onClick={togglePasswordVisible}>
        show password
      </button>
    </section>
  );
};

export default AuthPage;

AuthPage.defaultProps = {
  signup: false
};

AuthPage.propTypes = {
  signup: PropTypes.bool
};
