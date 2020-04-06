import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  loading: false,
  hasErrors: false,
  user: null
};

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state) => {
      const newState = { ...state };
      newState.loading = true;
      return newState;
    },
    getUserSuccess: (state, { payload }) => {
      const newState = { ...state };
      newState.user = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    getUserFailure: (state) => {
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
    }
  }
});

export const userSelector = (state) => state.user;

const { actions, reducer } = usersSlice;

export const {
  getUser, getUserSuccess, getUserFailure, createUser, createUserSuccess, createUserFailure
} = actions;

export function fetchUser(email, password) {
  const body = { email, password };
  return async (dispatch) => {
    dispatch(getUser());
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      dispatch(getUserSuccess(data.user));
    } catch (err) {
      console.log(err);
      dispatch(getUserFailure());
    }
  };
}

export function createNewUser(email, username, password) {
  const body = { email, username, password };

  return async (dispatch) => {
    dispatch(getUser());
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      dispatch(getUserSuccess(data.user));
    } catch (err) {
      console.log(err);
      dispatch(getUserFailure());
    }
  };
}

export default reducer;
