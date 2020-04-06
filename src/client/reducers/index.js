import { combineReducers, configureStore } from '@reduxjs/toolkit';

import usersReducer from '../slices/users';
import authReducer from '../slices/auth';

const rootReducer = combineReducers({
  users: usersReducer,
  user: authReducer
});

const store = configureStore({
  reducer: rootReducer
});

export default store;
