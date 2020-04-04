import { combineReducers, configureStore } from '@reduxjs/toolkit';

import usersReducer from '../slices/users';

const rootReducer = combineReducers({
  users: usersReducer
});

const store = configureStore({
  reducer: rootReducer
});

export default store;
