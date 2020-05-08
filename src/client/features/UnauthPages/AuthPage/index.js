import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  login,
  signup,
  authSelector
} from '../../../slices/auth';
import { messageSelector } from '../../../slices/messages';
import { 
  validateEmail,
  validatePassword,
  validateUsername,
  verifyPassword
} from '../../../common/helpers/formValidations';

import './AuthPage.scss';

import LoadingIndicator from '../../../common/components/LoadingIndicator';

const AuthPage = ({ newUser }) => {
  const dispatch = useDispatch();
  const { loading, hasErrors } = useSelector(authSelector);
  const { message } = useSelector(messageSelector);

  const method = newUser ? 'POST' : 'GET';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState('');
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    emailError: [],
    usernameError: [],
    passwordError: [],
    verifyPassword: []
  });

  function handleChange(e, func) {
    func(e.target.value);
  }

  function validateInput(e, func, ...args) {
    if (newUser) {
      const { value } = e.target;
      const error = func(value, errors, ...args);

      setErrors({ ...errors, ...error });
    }
  }

  function togglePasswordVisible() {
    setPasswordVisible(!passwordVisible);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (newUser) {
      if (Object.values(errors).flat().length > 0) return;

      return dispatch(signup(email, username, password));
    }
    return dispatch(login(username, password));
  }

  return (
    <section className='auth-form'>
      {message && <div>{message}</div>}

      {loading && <LoadingIndicator />}

      {hasErrors && (
        <h2>There was a Problem Loading your User Information. Please try again.</h2>
      )}

      <h1>{newUser ? 'Sign up' : 'Log in'}</h1>

      {
        newUser &&
        errors &&
        <div className='form-error-container'>
          {
            Object.entries(errors)
            .map( errorArray => {
              return (
                <ul
                  key={errorArray[0]}
                  id={errorArray[0]}
                >
                  {errorArray[1].map( value => 
                    <li
                      key={value}
                      className='form-error'
                    > 
                      - {value} 
                    </li>
                  )}
                </ul>
              )
            })
          }
        </div>
      }

      <form
        action='/api/auth'
        method={method}
        onSubmit={handleSubmit}
      >
        {newUser ? (
          <label htmlFor='email'>
            <div>
              email
              <span className='required' aria-hidden='true'>*</span>
              <span className='sr-only'>Required</span> 
            </div>
            <input
              required
              name='email'
              id='email'
              type='email'
              placeholder='multi-lingual@polyglot.com'
              onChange={(e) => handleChange(e, setEmail)}
              onBlur={(e) => validateInput(e, validateEmail)}
              value={email}
              className={errors.emailError.length > 0 ? 'form-error' : ''}
              aria-describedby='emailError'
            />
          </label>
        )
          : <div />}
        <label htmlFor='username'>
          <div>
            username
            <span className='required' aria-hidden='true'>*</span>
            <span className='sr-only'>Required</span>
          </div>
          <input
            required
            name='username'
            id='username'
            type='text'
            placeholder='VerifiedPolyglot'
            onChange={(e) => handleChange(e, setUsername)}
            onBlur={(e) => validateInput(e, validateUsername)}
            value={username}
            className={(errors.usernameError.length > 0 && newUser)? 'form-error' : ''}
            aria-describedby='desc-un usernameError'
          />
          { 
            newUser &&
            <p id='desc-un'>Must be between 8 and 16 characters long</p>
          }
        </label>
        <label htmlFor='password'>
          <div>
            password
            <span className='required' aria-hidden='true'>*</span>
            <span className='sr-only'>Required</span>
          </div>
          <input
            required
            name='password'
            id='password'
            placeholder='secret_password'
            type={passwordVisible ? 'text' : 'password'}
            onChange={(e) => handleChange(e, setPassword)}
            onBlur={(e) => validateInput(
                e,
                validatePassword,
                username
              )}
            value={password}
            className={(errors.passwordError.length > 0 && newUser) ? 'form-error' : ''}
            aria-describedby='desc-pw passwordError'
          />
          {
            newUser &&
            <p id='desc-pw'>Must not be the same as your Username, contain between 8 and 30 characters, and contain at least 1 number</p>
          }
          <button
            type='button'
            onClick={togglePasswordVisible}
            className={ passwordVisible ? 'form-show-ps-btn' : ''}
          >
            { passwordVisible ? 'hide password' : 'show password'}
          </button>
        </label>
        {newUser ? (
          <label htmlFor='verifyPassword'>
            <div>
              verify password
              <span className='required' aria-hidden='true'>*</span>
              <span className='sr-only'>Required</span>
            </div>
            <input
              required
              name='verifyPassword'
              id='verifyPassword'
              type='password'
              placeholder='secret_password_again'
              onChange={(e) => handleChange(e, setPasswordVerified)}
              className={errors.verifyPassword.length > 0 ? 'form-error' : ''}
              onBlur={
                (e) => validateInput(
                  e,
                  verifyPassword,
                  password
                )}
              value={passwordVerified}
              aria-describedby='verifyPasswordError'
            />
          </label>
        )
          : <div />}
        <button 
          type='submit'
          onClick={handleSubmit}
          disabled={Object.values(errors).flat().length > 0 && newUser}
          className='form-submit-button'
        >
          Submit
        </button>
      </form>
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
