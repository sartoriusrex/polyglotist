import { createSlice } from '@reduxjs/toolkit';

interface articlesStateInterface {
  loading: boolean;
  hasErrors: boolean;
  articles: { title: string; url: string; body: string[] }[] | null;
  // Need to add date and date read in state, as well as update backend to get this data
}

export const initialState: articlesStateInterface = {
  loading: false,
  hasErrors: false,
  articles: null,
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
    addArticleSuccess: (state: articlesStateInterface, { payload }) => {
      const newState = { ...state };

      newState.articles = payload;
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
