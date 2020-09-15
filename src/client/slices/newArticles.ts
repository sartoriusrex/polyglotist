import { createSlice } from '@reduxjs/toolkit';

interface DatabaseSource {
  name: string;
  url: string;
  language: string;
  error?: string;
}

interface CrawlResult {
  title: string;
  date: string;
  url: string;
  language: string;
  body: string[][];
  error?: string;
}

interface SourceText {
  source: DatabaseSource;
  articles?: CrawlResult[] | { error: string };
  error?: string;
}

interface newArticlesStateInterface {
  loading: boolean;
  hasErrors: boolean;
  articles: SourceText[] | null;
}

export const initialState: newArticlesStateInterface = {
  loading: false,
  hasErrors: false,
  articles: null,
};

const newArticlesSlice = createSlice({
  name: 'newArticles',
  initialState,
  reducers: {
    fetchArticles: (state: newArticlesStateInterface) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    fetchArticlesSuccess: (state: newArticlesStateInterface, { payload }) => {
      const newState = { ...state };

      newState.articles = payload;
      newState.loading = false;
      newState.hasErrors = false;
      return newState;
    },
    fetchArticlesFailure: (state: newArticlesStateInterface) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = true;
      return newState;
    },
  },
});

export const newArticlesSelector = (state: any) => state.newArticles;

const { actions, reducer } = newArticlesSlice;

export const {
  fetchArticles,
  fetchArticlesSuccess,
  fetchArticlesFailure,
} = actions;

export function fetchNewArticles(sources: string[]) {
  return async (dispatch: Function) => {
    dispatch(fetchArticles());

    try {
      const response = await fetch('/api/articles/fresh_articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sources),
      });

      const articles = await response.json();

      dispatch(fetchArticlesSuccess(articles));
    } catch (err) {
      console.log(err);
      dispatch(fetchArticlesFailure());
    }
  };
}

export default reducer;
