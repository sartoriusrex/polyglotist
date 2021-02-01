import { createSlice } from '@reduxjs/toolkit';
import { sendMessage } from './messages';
import { fetchNewArticles } from './newArticles';
import { loadSettings } from './settings';
import { fetchAllPhrases } from './phrases';
import { fetchAllArticles } from './articles';
import history from '../app/history';

import { AuthState } from '../interfaces';

export const initialState: AuthState = {
  loading: false,
  hasErrors: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state: AuthState) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    loginUserSuccess: (state: AuthState, { payload }) => {
      const newState = { ...state };

      newState.user = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    loginUserFailure: (state: AuthState) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
    createUser: (state: AuthState) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    createUserSuccess: (state: AuthState, { payload }) => {
      const newState = { ...state };

      newState.user = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    createUserFailure: (state: AuthState) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
    logoutUser: (state: AuthState) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    logoutUserSuccess: (state: AuthState) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = false;
      newState.user = null;
      return newState;
    },
    logoutUserFailure: (state: AuthState) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
  },
});

export const authSelector = (state: any) => state.auth;

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
  logoutUserFailure,
} = actions;

export function login(username?: string, password?: string) {
  const body = { username, password };

  return async (dispatch: Function) => {
    dispatch(loginUser());

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
          sources,
        } = data.user;

        const user = {
          id,
          username,
          email,
        };
        dispatch(loginUserSuccess(user));

        const settings = {
          readingSpeed,
          themePreference,
          practiceMode,
          notificationMethod,
          languagePreference,
          languagesLearning,
          sources,
          loading: false,
          hasErrors: false,
        };
        dispatch(loadSettings(settings));

        // If user has never set languages, redirect them to create their account, otherwise redirect to dashboard and fetch relevant information
        if (!languagesLearning) {
          history.push(`/${username}/create_account`);
        } else {
          // dispatch action to fetch artcles from their sources
          dispatch(fetchNewArticles(sources));
          history.push(`/${username}/dashboard`);
        }

        // After navigation, can fetch all the user's phrases & articles
        dispatch(fetchAllPhrases(user.id));
        dispatch(fetchAllArticles(user.id));

        dispatch(sendMessage(data.message));
      } else if (response.status === 200 && data.user === null) {
        dispatch(loginUserSuccess(null));
      } else {
        dispatch(loginUserFailure());
        dispatch(sendMessage(data.message));
      }
    } catch (err) {
      console.log(err);
      dispatch(loginUserFailure());
    }
  };
}

export function signup(email: string, username: string, password: string) {
  const body = { email, username, password };

  return async (dispatch: Function) => {
    dispatch(createUser());

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.status === 200) {
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
        } = data.user;

        const user = {
          id,
          username,
          email,
        };
        dispatch(createUserSuccess(user));

        const settings = {
          readingSpeed,
          themePreference,
          practiceMode,
          notificationMethod,
          languagePreference,
          languagesLearning,
          sources: [],
          loading: false,
          hasErrors: false,
        };
        dispatch(loadSettings(settings));

        history.push(`/${username}/create_account`);
        dispatch(sendMessage(data.message));
      } else {
        dispatch(createUserFailure());
        dispatch(sendMessage(data.message));
      }
    } catch (err) {
      console.log(err);
      dispatch(createUserFailure());
    }
  };
}

export function logout() {
  return async (dispatch: Function) => {
    dispatch(logoutUser());

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
