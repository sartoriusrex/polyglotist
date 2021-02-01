import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../interfaces'

export const initialState: UserState = {
  loading: false,
  hasErrors: false,
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsers: (state: UserState) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    getUsersSuccess: (state: UserState, { payload }) => {
      const newState = { ...state };

      newState.users = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    getUsersFailure: (state: UserState) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
  },
});

export const usersSelector = (state: any) => state.users;

const { actions, reducer } = usersSlice;

export const { getUsers, getUsersSuccess, getUsersFailure } = actions;

export function fetchUsers() {
  return async (dispatch: Function) => {
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
