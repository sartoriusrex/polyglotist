import { combineReducers, configureStore } from '@reduxjs/toolkit';

import usersReducer from '../slices/users';
import authReducer from '../slices/auth';
import messageReducer from '../slices/messages';

const rootReducer = combineReducers({
  users: usersReducer,
  user: authReducer,
  message: messageReducer
});

const store = configureStore({
  reducer: rootReducer
});

export default store;
