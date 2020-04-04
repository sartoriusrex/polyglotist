import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { validateEmail, validatePassword, validateUsername } from '../../common/helpers/formValidations';

const AuthPage = ({ signup }) => {
  const method = signup ? 'POST' : 'GET';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState('');
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e, func) {
    func(e.target.value);
  }

  function togglePasswordVisible() {
    setPasswordVisible(!passwordVisible);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errorsObject = {};

    const usernameErrors = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordErrors = validatePassword(password, passwordVerified, username);

    if (usernameErrors.length > 0) {
      errorsObject.username = usernameErrors;
    }
    if (emailError.length > 0) {
      errorsObject.email = emailError;
    }
    if (passwordErrors.length > 0) {
      errorsObject.password = passwordErrors;
    }

    console.log(errorsObject);

    if (Object.keys(errorsObject).length > 0) {
      console.log('errors');
      setErrors(errorsObject);
    } else {
      console.log('no errors');
    }
  }

  return (
    <section>
      <h1>{signup ? <div>Sign up</div> : <div>Log in</div>}</h1>

      {errors && (
        Object.values(errors).map((err) => (
          <div key={err}>{err}</div>
        ))
      )}

      <form
        action='/api/users'
        method={method}
        onSubmit={handleSubmit}
      >
        {signup ? (
          <label htmlFor='email'>
            Email
            <input
              required
              name='email'
              id='email'
              type='email'
              placeholder='multi-lingual@polyglot.com'
              onChange={(e) => handleChange(e, setEmail)}
              value={email}
            />
          </label>
        )
          : <div />}
        <label htmlFor='username'>
          Username
          <input
            required
            name='username'
            id='username'
            type='text'
            placeholder='VerifiedPolyglot'
            onChange={(e) => handleChange(e, setUsername)}
            value={username}
          />
          <p>Must be between 8 and 16 characters long</p>
        </label>
        <label htmlFor='password'>
          Password
          <input
            required
            name='password'
            id='password'
            placeholder='secret_password'
            type={passwordVisible ? 'text' : 'password'}
            onChange={(e) => handleChange(e, setPassword)}
            value={password}
          />
          <p>Must not be the same as your Username, contain between 8 and 30 characters, and contain at least 1 number</p>
        </label>
        {signup ? (
          <label htmlFor='verifyPassword'>
            Verify password
            <input
              required
              name='verifyPassword'
              id='verifyPassword'
              type='password'
              placeholder='secret_password_again'
              onChange={(e) => handleChange(e, setPasswordVerified)}
              value={passwordVerified}
            />
          </label>
        )
          : <div />}
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
