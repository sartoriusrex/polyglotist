import { combineReducers, configureStore } from '@reduxjs/toolkit';

import usersReducer from '../slices/users';
import userReducer from '../slices/user';

const rootReducer = combineReducers({
  users: usersReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer
});

export default store;
