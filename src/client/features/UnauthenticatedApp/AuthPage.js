import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { createNewUser, userSelector } from '../../slices/user';
import { validateEmail, validatePassword, validateUsername } from '../../common/helpers/formValidations';

import './AuthPage.scss';

const AuthPage = ({ signup }) => {
  const method = signup ? 'POST' : 'GET';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerified, setPasswordVerified] = useState('');
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { user, loading, hasErrors } = useSelector(userSelector);

  function handleChange(e, func) {
    func(e.target.value);
  }

  function togglePasswordVisible() {
    setPasswordVisible(!passwordVisible);
  }

  function validateForm() {
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

    if (Object.keys(errorsObject).length > 0) {
      setErrors(errorsObject);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    setErrors({});

    if (signup) {
      validateForm();
      dispatch(createNewUser(email, username, password));
    } else {
      console.log('logging in');
    }
  }

  return (
    <section>
      <h1>{signup ? <div>Sign up</div> : <div>Log in</div>}</h1>

      {user && console.log(user)}

      {loading && console.log('loading')}
      {hasErrors && console.log('error')}

      {errors && (
        Object.values(errors).map((err) => (
          <div key={err} className='form-error'>{err}</div>
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
              className={errors.email ? 'form-error' : ''}
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
            className={errors.username ? 'form-error' : ''}
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
            className={errors.password ? 'form-error' : ''}
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
