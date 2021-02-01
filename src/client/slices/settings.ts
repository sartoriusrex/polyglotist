import { createSlice } from '@reduxjs/toolkit';
import { sendMessage } from './messages';
import history from '../app/history';
import { SettingsState } from '../interfaces';

export const initialState: SettingsState = {
  loading: false,
  hasErrors: false,
  themePreference: 'light',
  readingSpeed: 'normal',
  practiceMode: true,
  notificationMethod: 'none',
  languagePreference: 'english',
  languagesLearning: null,
  sources: [],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state: SettingsState) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    setSettingsSuccess: (state: SettingsState, { payload }) => {
      const newState = { ...state };

      newState.themePreference = payload.themePreference;
      newState.readingSpeed = payload.readingSpeed;
      newState.practiceMode = payload.practiceMode;
      newState.notificationMethod = payload.notificationMethod;
      newState.languagePreference = payload.languagePreference;
      newState.languagesLearning = payload.languagesLearning;
      newState.sources = payload.sources;
      newState.loading = payload.loading;
      newState.hasErrors = payload.hasErrors;
      return newState;
    },
    setSettingsFailure: (state: SettingsState) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
  },
});

export const settingsSelector = (state: any) => state.settings;

const { actions, reducer } = settingsSlice;

export const { 
  setSettings, 
  setSettingsSuccess, 
  setSettingsFailure 
} = actions;

export function loadSettings(settings: SettingsState) {
  return async (dispatch: Function) => {
    dispatch(setSettings());

    try {
      dispatch(setSettingsSuccess(settings));
    } catch (err) {
      console.log(err);
      dispatch(setSettingsFailure());
    }
  };
}

export function updateSettings(user: string, settings: SettingsState) {
  return async (dispatch: Function) => {
    dispatch(setSettings());

    try {
      const response = await fetch(`/api/users/${user}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
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
        sources,
      } = userData.user;

      let newSettings = {
        readingSpeed,
        themePreference,
        practiceMode,
        notificationMethod,
        languagePreference,
        languagesLearning,
        sources,
      };

      // if (username) newSettings = { ...newSettings, username };
      // if (email) newSettings = { ...newSettings, email };

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
