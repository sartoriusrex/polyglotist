import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  login,
  signup,
  authSelector
} from '../../slices/auth';
import {
  removeMessage,
  messageSelector
} from '../../slices/messages';
import { validateForm } from '../../common/helpers/formValidations';

import './AuthPage.scss';

const AuthPage = ({ newUser }) => {
  const method = newUser ? 'POST' : 'GET';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState('');
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { loading, hasErrors } = useSelector(authSelector);
  const { message } = useSelector(messageSelector);

  function handleChange(e, func) {
    func(e.target.value);
  }

  function togglePasswordVisible() {
    setPasswordVisible(!passwordVisible);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    dispatch(removeMessage());

    if (newUser) {
      const formErrors = validateForm(email, username, password, passwordVerified);

      if (Object.keys(formErrors).length > 0) return setErrors(formErrors);
      return dispatch(signup(email, username, password));
    }
    return dispatch(login(username, password));
  }

  if (loading) {
    return (
      <section>
        <h1>Loading User Profile</h1>
      </section>
    );
  }

  return (
    <section>
      <h1>{newUser ? <div>Sign up</div> : <div>Log in</div>}</h1>

      {message && <div>{message}</div>}

      {hasErrors && (
        <h2>There was a Problem Loading your User Information. Please try again.</h2>
      )}

      {errors && (
        Object.entries(errors).map((err) => (
          <p
            key={err[1]}
            className='form-error'
            id={err[0]}
          >
            {err[1]}
          </p>
        ))
      )}

      <form
        action='/api/auth'
        method={method}
        onSubmit={handleSubmit}
      >
        {newUser ? (
          <label htmlFor='email'>
            Email
            <span className='required' aria-hidden='true'>*</span>
            <span className='sr-only'>Required</span>
            <input
              required
              name='email'
              id='email'
              type='email'
              placeholder='multi-lingual@polyglot.com'
              onChange={(e) => handleChange(e, setEmail)}
              value={email}
              className={errors.emailError ? 'form-error' : ''}
              aria-describedby='emailError'
            />
          </label>
        )
          : <div />}
        <label htmlFor='username'>
          Username
          <span className='required' aria-hidden='true'>*</span>
          <span className='sr-only'>Required</span>
          <input
            required
            name='username'
            id='username'
            type='text'
            placeholder='VerifiedPolyglot'
            onChange={(e) => handleChange(e, setUsername)}
            value={username}
            className={errors.usernameErrors ? 'form-error' : ''}
            aria-describedby='desc-un usernameErrors'
          />
          <p id='desc-un'>Must be between 8 and 16 characters long</p>
        </label>
        <label htmlFor='password'>
          Password
          <span className='required' aria-hidden='true'>*</span>
          <span className='sr-only'>Required</span>
          <input
            required
            name='password'
            id='password'
            placeholder='secret_password'
            type={passwordVisible ? 'text' : 'password'}
            onChange={(e) => handleChange(e, setPassword)}
            value={password}
            className={errors.passwordErrors ? 'form-error' : ''}
            aria-describedby='desc-pw passwordErrors'
          />
          <p id='desc-pw'>Must not be the same as your Username, contain between 8 and 30 characters, and contain at least 1 number</p>
        </label>
        {newUser ? (
          <label htmlFor='verifyPassword'>
            Verify password
            <span className='required' aria-hidden='true'>*</span>
            <span className='sr-only'>Required</span>
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
  newUser: false
};

AuthPage.propTypes = {
  newUser: PropTypes.bool
};
