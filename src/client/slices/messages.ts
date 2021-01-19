import { createSlice } from '@reduxjs/toolkit';
import { messageStateInterface } from '../interfaces';

export const initialState: messageStateInterface = {
  message: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state: messageStateInterface, { payload }) => {
      const newState = { ...state };

      newState.message = payload;
      return newState;
    },
    clearMessage: (state: messageStateInterface, { payload }) => {
      const newState = { ...state };

      newState.message = payload;
      return newState;
    },
  },
});

export const messageSelector = (state: any) => state.message;

const { actions, reducer } = messageSlice;

export const { addMessage, clearMessage } = actions;

export function sendMessage(message: string) {
  return async (dispatch: Function) => {
    setTimeout(() => dispatch(clearMessage(null)), 1000 * 5)
    dispatch(addMessage(message));
  };
}

export function removeMessage() {
  return async (dispatch: Function) => {
    dispatch(clearMessage(null));
  };
}

export default reducer;
