import { combineReducers, configureStore } from '@reduxjs/toolkit';

import usersReducer from '../slices/users';
import authReducer from '../slices/auth';
import settingsReducer from '../slices/settings';
import messageReducer from '../slices/messages';
import newArticlesReducer from '../slices/newArticles';

const rootReducer = combineReducers({
  users: usersReducer,
  auth: authReducer,
  settings: settingsReducer,
  message: messageReducer,
  newArticles: newArticlesReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
