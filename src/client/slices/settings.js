import { createSlice } from '@reduxjs/toolkit';
import { sendMessage, removeMessage } from './messages';
import history from '../app/history';

export const initialState = {
  loading: false,
  hasErrors: false,
  themePreference: 'light',
  readingSpeed: 'normal',
  practiceMode: true,
  notificationMethod: 'none',
  languagePreference: 'english',
  languagesLearning: null,
  sources: []
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    setSettingsSuccess: (state, { payload }) => {
      const newState = { ...state };

      newState.themePreference = payload.themePreference;
      newState.readingSpeed = payload.readingSpeed;
      newState.practiceMode = payload.practiceMode;
      newState.notificationMethod = payload.notificationMethod;
      newState.languagePreference = payload.languagePreference;
      newState.languagesLearning = payload.languagesLearning;
      newState.sources = payload.sources;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    setSettingsFailure: (state) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    }
  }
});

export const settingsSelector = (state) => state.settings;

const { actions, reducer } = settingsSlice;

export const {
  setSettings,
  setSettingsSuccess,
  setSettingsFailure
} = actions;

export function loadSettings(settings) {
  return async (dispatch) => {
    dispatch(setSettings());

    try {
      dispatch(setSettingsSuccess(settings))
    } catch (err) {
      console.log(err);
      dispatch(setSettingsFailure());
    }
  }
}

export function updateSettings(user, settings) {
  return async (dispatch) => {
    dispatch(setSettings());
    dispatch(removeMessage());

    try {
      const response = await fetch(`/api/users/${user}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      const userData = await response.json();

      const {
        username,
        email,
        readingSpeed,
        themePreference,
        practiceMode,
        notificationMethod,
        languagePreference,
        languagesLearning,
        sources
      } = userData.user;

      let newSettings = {
        readingSpeed,
        themePreference,
        practiceMode,
        notificationMethod,
        languagePreference,
        languagesLearning,
        sources
      }

      if (username) newSettings.username = username;
      if (email) newSettings.email = email;

      dispatch(setSettingsSuccess(newSettings));
      history.push(`/${user}/dashboard`);
      dispatch(sendMessage(userData.message));
    } catch (err) {
      console.log(err);
      dispatch(setSettingsFailure());
    }
  };
}

export default reducer;
