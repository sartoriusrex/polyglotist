import { createSlice } from '@reduxjs/toolkit';
import { sendMessage, removeMessage } from './messages';
import { loadSettings } from './settings';
import history from '../app/history';

export const initialState = {
  loading: false,
  hasErrors: false,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    loginUserSuccess: (state, { payload }) => {
      const newState = { ...state };

      newState.user = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    loginUserFailure: (state) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
    createUser: (state) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    createUserSuccess: (state, { payload }) => {
      const newState = { ...state };

      newState.user = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    createUserFailure: (state) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
    logoutUser: (state) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    logoutUserSuccess: (state) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = false;
      newState.user = null;
      return newState;
    },
    logoutUserFailure: (state) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    }
  }
});

export const authSelector = (state) => state.auth;

const { actions, reducer } = authSlice;

export const {
  loginUser,
  loginUserSuccess,
  loginUserFailure,
  createUser,
  createUserSuccess,
  createUserFailure,
  logoutUser,
  logoutUserSuccess,
  logoutUserFailure
} = actions;

export function login(username, password) {
  const body = { username, password };

  return async (dispatch) => {
    dispatch(loginUser());
    dispatch(removeMessage());

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      // API will return user of null when App mounts and there is no cookie with credentials or if the cookie has expired
      if (response.status === 200 && data.user !== null) {
        const {
          id,
          username,
          email,
          readingSpeed,
          themePreference,
          practiceMode,
          notificationMethod,
          languagePreference,
          languagesLearning,
          sources
        } = data.user;

        const user = {
          id,
          username,
          email 
        };
        dispatch(loginUserSuccess(user));

        const settings = {
          readingSpeed,
          themePreference,
          practiceMode,
          notificationMethod,
          languagePreference,
          languagesLearning,
          sources
        }
        dispatch(loadSettings(settings));

        if (!languagesLearning) {
          history.push(`/${username}/create_account`);
        } else {
          history.push(`/${username}/dashboard`);
        }
        dispatch(sendMessage(data.message));
      } else {
        dispatch(loginUserSuccess(null));
      }

    } catch (err) {
      console.log(err);
      dispatch(loginUserFailure());
    }
  };
}

export function signup(email, username, password) {
  const body = { email, username, password };

  return async (dispatch) => {
    dispatch(createUser());
    dispatch(removeMessage());

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      const {
        id,
        username,
        email,
        readingSpeed,
        themePreference,
        practiceMode,
        notificationMethod,
        languagePreference,
        languagesLearning
      } = data.user;

      const user = {
        id,
        username,
        email 
      };
      dispatch(createUserSuccess(user));

      const settings = {
        readingSpeed,
        themePreference,
        practiceMode,
        notificationMethod,
        languagePreference,
        languagesLearning
      }
      dispatch(loadSettings(settings));

      history.push(`/${username}/create_account`);
      dispatch(sendMessage(data.message));
    } catch (err) {
      console.log(err);
      dispatch(createUserFailure());
    }
  };
}

export function logout() {
  return async (dispatch) => {
    dispatch(logoutUser());

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      dispatch(logoutUserSuccess());
      history.push('/login');
      dispatch(sendMessage(data.message));
    } catch (err) {
      console.log(err);
      dispatch(logoutUserFailure());
    }
  };
}

export default reducer;
