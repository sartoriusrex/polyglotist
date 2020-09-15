import { createSlice } from '@reduxjs/toolkit';

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
    fetchPhrasesSuccess: (state: phrasesStateInterface) => {
      const newState = { ...state };

      return newState;
    }
  }
})

export const phrasesSelector = (state: any) => state.phrases;

const { actions, reducer } = phrasesSelector;

export const {
  fetchPhrases,
  fetchPhrasesFailure,
  fetchPhrasesSuccess
} = actions;

export function fetchAllPhrases() {
  return async (dispatch: Function) => {
    dispatch(fetchPhrases());

    try {
      const response = await fetch(
        '/api/words',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )

      const data = await response.json();

      dispatch(fetchPhrasesSuccess(data));
    } catch (err) {
      console.log(err);
      dispatch(fetchPhrasesFailure());
    }
  }
}

export default reducer;
