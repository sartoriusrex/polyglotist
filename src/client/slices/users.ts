import { createSlice } from '@reduxjs/toolkit';

interface userStateInterface {
  loading: boolean;
  hasErrors: boolean;
  users: any[];
}

export const initialState: userStateInterface = {
  loading: false,
  hasErrors: false,
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsers: (state: userStateInterface) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    getUsersSuccess: (state: userStateInterface, { payload }) => {
      const newState = { ...state };

      newState.users = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    getUsersFailure: (state: userStateInterface) => {
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
