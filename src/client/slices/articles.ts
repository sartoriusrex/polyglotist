import { createSlice } from '@reduxjs/toolkit';
import { sendMessage } from './messages';

import { Article, ArticlesState } from '../interfaces';


export const initialState: ArticlesState = {
  loading: false,
  hasErrors: false,
  articles: [],
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    fetchArticles: (state: ArticlesState) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    fetchArticlesSuccess: (state: ArticlesState, { payload }) => {
      const newState = { ...state };

      newState.articles = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    fetchArticlesFailure: (state: ArticlesState) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
    addArticle: (state: ArticlesState) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    addArticleSuccess: (state: ArticlesState, { payload }: { payload: Article }) => {
      const newState = { ...state };

      newState.articles = Array.from(new Set([...newState.articles, payload]));
      newState.loading = false;
      newState.hasErrors = false;

      return newState;
    },
    addArticleFailure: (state: ArticlesState) => {
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
