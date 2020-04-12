import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  loading: false,
  hasErrors: false,
  themePreference: 'light',
  readingSpeed: 'normal',
  practiceMode: true,
  notifications: true,
  notificationMethod: 'none'
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
      newState.notifications = payload.notifications;
      newState.notificationMethod = payload.notificationMethod;
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

export function updateSettings(name, settings) {
  

  return async (dispatch) => {
    dispatch(setSettings());

    try {
      const response = await fetch(`/api/users/:${name}`, {

      })
      dispatch(setSettingsSuccess());
    } catch (err) {
      console.log(err);
      dispatch(setSettingsFailure());
    }
  };
}

export default reducer;
