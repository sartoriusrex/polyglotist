import { createSlice } from '@reduxjs/toolkit';

interface messageStateInterface {
  message: string | null;
}

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
    dispatch(addMessage(message));
  };
}

export function removeMessage() {
  return async (dispatch: Function) => {
    dispatch(clearMessage(null));
  };
}

export default reducer;