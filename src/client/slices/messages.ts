import { createSlice } from '@reduxjs/toolkit';
import { MessageState } from '../interfaces';

export const initialState: MessageState = {
  message: null,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state: MessageState, { payload }) => {
      const newState = { ...state };

      newState.message = payload;
      return newState;
    },
    clearMessage: (state: MessageState, { payload }) => {
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
