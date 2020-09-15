import { createSlice } from '@reduxjs/toolkit';
import { json } from 'body-parser';

interface phraseInterface {
  word_id: string;
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
  phrases: phraseInterface[] | null;
}

export const initialState: phrasesStateInterface = {
  loading: false,
  hasErrors: false,
  phrases: null,
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
        '/api/words',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        }
      )

      const data = await response.json();

      console.log(data);

      dispatch(fetchPhrasesSuccess(data));
    } catch (err) {
      console.log(err);
      dispatch(fetchPhrasesFailure());
    }
  };
}

export default reducer;
