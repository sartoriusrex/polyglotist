import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  loading: false,
  hasErrors: false,
  users: []
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsers: (state) => {
      const newState = { ...state };
      newState.loading = true;
      return newState;
    },
    getUsersSuccess: (state, { payload }) => {
      const newState = { ...state };
      newState.users = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    getUsersFailure: (state) => {
      const newState = { ...state };
      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    }
  }
});

export const usersSelector = (state) => state.users;

const { actions, reducer } = usersSlice;

export const { getUsers, getUsersSuccess, getUsersFailure } = actions;

export function fetchUsers() {
  return async (dispatch) => {
    dispatch(getUsers());
    try {
      const response = await fetch('/api/users');
      const data = await response.json();

      dispatch(getUsersSuccess(data.users));
      
    } catch (err) {
      console.log(err);
      dispatch(getUsersFailure());
    }
  };
}

export default reducer;
