import { createSlice } from '@reduxjs/toolkit';
import history from '../app/history';
import { sendMessage } from './messages';
import { practiceStateInterface } from '../interfaces';

export const initialState: practiceStateInterface = {
    loading: false,
    hasErrors: false,
    phrases: [],
    results: [],
}

const practiceSlice = createSlice({
    name: 'practice',
    initialState,
    reducers: {
        setPractice: (state: practiceStateInterface) => {
            const newState = { ...state };

            newState.loading = true;
            return newState;
        },
        setPracticeSuccess: (state: practiceStateInterface, { payload }) => {
            const newState = { ...state };

            newState.loading = false;
            newState.hasErrors = false;
            newState.phrases = payload.phrases;
            return newState;
        },
        setPracticeFailure: (state: practiceStateInterface ) => {
            const newState = { ...state };

            newState.loading = false;
            newState.hasErrors = true;
            return newState;
        },
        updateResults: (state: practiceStateInterface) => {
            const newState = { ...state };

            newState.loading = true;
            return newState;
        },
        updateResultsSuccess: (state: practiceStateInterface, { payload } ) => {
            const newState = { ...state };

            newState.loading = false;
            newState.hasErrors = false;
            newState.results = [ ...newState.results, ...payload.results ];
            return newState;
        },
        updateResultsFailure: (state: practiceStateInterface) => {
            const newState = { ...state };

            newState.loading = false;
            newState.hasErrors = true;
            return newState;
        }
    }
})

export const practicePhrasesSelector = (state: practiceStateInterface) => state.phrases;

export const practiceResultsSelector = (state: practiceStateInterface) => state.results;

const { actions, reducer } = practiceSlice;

export const { 
    setPractice, 
    setPracticeSuccess, 
    setPracticeFailure,
    updateResults,
    updateResultsFailure,
    updateResultsSuccess
} = actions;

export function createSession( lang: string, mode: string, username: string, userId: number ) {
    return async (dispatch: Function) => {
        dispatch(setPractice());

        try {
            const response = await fetch(`/api/phrases/practice/${lang}/${mode}/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const { phrases } = await response.json();

            history.push(`/${username}/practice/${lang}`);
            dispatch(setPracticeSuccess({phrases}));
        } catch (err) {
            console.log(err);
            dispatch(setPracticeFailure());
            dispatch(sendMessage('Failed to create practice session'));
        }
    }
}

export function updatePhraseStrength( phraseId: string, result: 1 | -1) {
    console.log(phraseId, result);
}

export default reducer;
