import { createSlice } from '@reduxjs/toolkit';
import { sendMessage } from './messages';

import { Article } from '../interfaces';

interface articlesStateInterface {
  loading: boolean;
  hasErrors: boolean;
  articles: Article[] | [];
  // Need to add date and date read in state, as well as update backend to get this data
}

export const initialState: articlesStateInterface = {
  loading: false,
  hasErrors: false,
  articles: [],
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    fetchArticles: (state: articlesStateInterface) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    fetchArticlesSuccess: (state: articlesStateInterface, { payload }) => {
      const newState = { ...state };

      newState.articles = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    fetchArticlesFailure: (state: articlesStateInterface) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
    addArticle: (state: articlesStateInterface) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    addArticleSuccess: (state: articlesStateInterface, { payload }: { payload: Article }) => {
      const newState = { ...state };

      newState.articles = Array.from(new Set([...newState.articles, payload]));
      newState.loading = false;
      newState.hasErrors = false;

      return newState;
    },
    addArticleFailure: (state: articlesStateInterface) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
  },
});

export const articlesSelector = (state: any) => state.articles;

const { actions, reducer } = articlesSlice;

export const {
  fetchArticles,
  fetchArticlesFailure,
  fetchArticlesSuccess,
  addArticle,
  addArticleFailure,
  addArticleSuccess
} = actions;

export function fetchAllArticles(id: number) {
  const body = { id };

  return async (dispatch: Function) => {
    dispatch(fetchArticles());

    try {
      const response = await fetch(
        '/api/articles',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        }
      )

      const data = await response.json();

      const { articles } = data;

      dispatch(fetchArticlesSuccess(articles));
    } catch (err) {
      console.log(err);
      dispatch(fetchArticlesFailure());
    }
  };
}

export function addOneArticle(userId: number, articleTitle: string) {
  const body = { userId, articleTitle };

  return async (dispatch: Function) => {
    dispatch(addArticle());

    try {
      const response = await fetch(
        '/api/articles/add_article',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        }
      )

      const data: { message: 'string', article: Article } = await response.json();

      const { message, article } = data;

      dispatch(addArticleSuccess(article));
      dispatch(sendMessage(message));
    } catch (err) {
      dispatch(addArticleFailure());
      dispatch(sendMessage(err.message));
    }
  }
}

export default reducer;
