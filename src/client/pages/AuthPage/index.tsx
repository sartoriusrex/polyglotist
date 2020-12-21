import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { login, signup, authSelector } from '../../slices/auth';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  verifyPassword,
} from '../../helpers/formValidations';

import styles from './authPage.module.scss';

import LoadingIndicator from '../../components/LoadingIndicator';
import ServerMessage from '../../components/ServerMessage';

const AuthPage = ({ newUser }: { newUser: boolean }) => {
  const dispatch = useDispatch();
  const { loading, hasErrors } = useSelector(authSelector);
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
    verifyPassword: [],
  });
  const errorsPresent = Object.values(errors).flat().length > 0;

  function handleChange(e: any, func: Function) {
    func(e.target.value);
  }

  function validateInput(e: any, func: Function, ...args: any[]) {
    if (newUser) {
      const { value } = e.target;
      const error = func(value, errors, ...args);

      setErrors({ ...errors, ...error });
    }
  }

  function togglePasswordVisible() {
    setPasswordVisible(!passwordVisible);
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    if (newUser) {
      if (errorsPresent) return;

      return dispatch(signup(email, username, password));
    }
    return dispatch(login(username, password));
  }

  return (
    <section className={styles.authForm}>
      {loading && <LoadingIndicator />}

      <h1>{newUser ? 'Create Account' : 'Log In'}</h1>

      {hasErrors && <h2>There was a problem loading your information.</h2>}

      <ServerMessage />

      {newUser && errorsPresent && (
        <div className={styles.formErrorContainer}>
          {Object.entries(errors).map((errorArray) => {
            return (
              <ul key={errorArray[0]} id={errorArray[0]}>
                {errorArray[1].map((value) => (
                  <li key={value} className={styles.formError}>
                    - {value}
                  </li>
                ))}
              </ul>
            );
          })}
        </div>
      )}

      <form action='/api/auth' method={method} onSubmit={handleSubmit}>
        {newUser ? (
          <label htmlFor='email'>
            <div>
              email
              <span aria-hidden='true'>*</span>
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
              className={errors.emailError.length > 0 ? styles.formError : ''}
              aria-describedby='emailError'
            />
          </label>
        ) : (
          <div />
        )}
        <label htmlFor='username'>
          <div>
            username
            <span aria-hidden='true'>*</span>
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
            className={
              errors.usernameError.length > 0 && newUser ? styles.formError : ''
            }
            aria-describedby='desc-un usernameError'
          />
          {newUser && (
            <p id='desc-un'>
              Must be between 8 and 16 characters long and only contain letters
              or numbers
            </p>
          )}
        </label>
        <label htmlFor='password'>
          <div>
            password
            <span aria-hidden='true'>*</span>
            <span className='sr-only'>Required</span>
          </div>
          <input
            required
            name='password'
            id='password'
            placeholder='secret_password'
            type={passwordVisible ? 'text' : 'password'}
            onChange={(e) => handleChange(e, setPassword)}
            onBlur={(e) => validateInput(e, validatePassword, username)}
            value={password}
            className={
              errors.passwordError.length > 0 && newUser ? styles.formError : ''
            }
            aria-describedby='desc-pw passwordError'
          />
          {newUser && (
            <p id='desc-pw'>
              Must not be the same as your Username, contain between 8 and 30
              characters, and contain at least 1 number
            </p>
          )}
          <button
            type='button'
            onClick={togglePasswordVisible}
            className={
              passwordVisible ? styles.formShowPsBtn : styles.hidePsBtn
            }
          >
            {passwordVisible ? 'hide password' : 'show password'}
          </button>
        </label>
        {newUser ? (
          <label htmlFor='verifyPassword'>
            <div>
              verify password
              <span aria-hidden='true'>*</span>
              <span className='sr-only'>Required</span>
            </div>
            <input
              required
              name='verifyPassword'
              id='verifyPassword'
              type='password'
              placeholder='secret_password_again'
              onChange={(e) => handleChange(e, setPasswordVerified)}
              className={
                errors.verifyPassword.length > 0 ? styles.formError : ''
              }
              onBlur={(e) => validateInput(e, verifyPassword, password)}
              value={passwordVerified}
              aria-describedby='verifyPasswordError'
            />
          </label>
        ) : (
          <div />
        )}
        <button
          type='submit'
          onClick={handleSubmit}
          disabled={errorsPresent && newUser}
          className='form-submit-button'
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default AuthPage;
