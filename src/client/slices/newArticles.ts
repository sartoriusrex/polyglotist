import { createSlice } from '@reduxjs/toolkit';

interface DatabaseSource {
  name: string;
  url: string;
  language: string;
  error?: string;
}

interface CrawlResult {
  title: string;
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
  newArticles: SourceText[] | null;
  // Need to add date and date read in state, as well as update backend to get this data
}

export const initialState: newArticlesStateInterface = {
  loading: false,
  hasErrors: false,
  newArticles: null,
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

      newState.newArticles = payload;
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
      const response = await fetch('/api/crawl/', {
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
