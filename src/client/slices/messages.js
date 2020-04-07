import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  message: null
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      const newState = { ...state };

      newState.message = payload;
      return newState;
    },
    clearMessage: (state) => {
      const newState = { ...state };

      newState.message = null;
      return newState;
    }
  }
});

export const messageSelector = (state) => state.message;

const { actions, reducer } = messageSlice;

export const {
  addMessage,
  clearMessage
} = actions;

export function sendMessage(message) {
  return async (dispatch) => {
    dispatch(addMessage(message));
  };
}

export function removeMessage() {
  return async (dispatch) => {
    dispatch(clearMessage());
  };
}

export default reducer;
