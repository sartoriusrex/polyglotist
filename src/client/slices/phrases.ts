import { createSlice } from '@reduxjs/toolkit';
import { fetchAllArticles } from './articles';

interface phraseInterface {
  phrase_id: string;
  created_at: string;
  phrase: string;
  translation: string;
  language: string;
  article: string;
  context_phrase: string;
  strength: number;
}

interface phrasesStateInterface {
  loading: boolean;
  hasErrors: boolean;
  phrases: phraseInterface[] | [];
}

export const initialState: phrasesStateInterface = {
  loading: false,
  hasErrors: false,
  phrases: [],
};

const phrasesSlice = createSlice({
  name: 'phrasesSlice',
  initialState,
  reducers: {
    fetchPhrases: (state: phrasesStateInterface) => {
      const newState = { ...state };

      newState.loading = true;
      return newState;
    },
    fetchPhrasesFailure: (state: phrasesStateInterface) => {
      const newState = { ...state };

      newState.hasErrors = true;
      return newState;
    },
    fetchPhrasesSuccess: (state: phrasesStateInterface, { payload }) => {
      const newState = { ...state };

      newState.loading = false;
      newState.hasErrors = false;
      newState.phrases = payload;

      return newState;
    }
  }
})

export const phrasesSelector = (state: any) => state.phrases;

const { actions, reducer } = phrasesSlice;

export const {
  fetchPhrases,
  fetchPhrasesFailure,
  fetchPhrasesSuccess
} = actions;

export function fetchAllPhrases(id: number) {
  const body = { id };

  return async (dispatch: Function) => {
    dispatch(fetchPhrases());

    try {
      const response = await fetch(
        '/api/phrases',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        }
      )

      const data = await response.json();

      dispatch(fetchPhrasesSuccess(data));
      dispatch(fetchAllArticles(id));
    } catch (err) {
      console.log(err);
      dispatch(fetchPhrasesFailure());
    }
  };
}

export default reducer;
