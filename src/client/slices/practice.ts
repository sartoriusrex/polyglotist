import { createSlice } from '@reduxjs/toolkit';
import history from '../app/history';
import { sendMessage } from './messages';

import { PracticeState } from '../interfaces';

export const initialState: PracticeState = {
    loadingQuestions: false,
    loadingResults: false,
    questionsHasErrors: false,
    resultsHasErrors: false,
    phrases: [],
    results: [],
}

const practiceSlice = createSlice({
    name: 'practice',
    initialState,
    reducers: {
        setPractice: (state: PracticeState) => {
            const newState = { ...state };

            newState.loadingQuestions = true;
            return newState;
        },
        setPracticeSuccess: (state: PracticeState, { payload }) => {
            const newState = { ...state };

            newState.loadingQuestions = false;
            newState.questionsHasErrors = false;
            newState.phrases = payload.phrases;
            return newState;
        },
        setPracticeFailure: (state: PracticeState ) => {
            const newState = { ...state };

            newState.loadingQuestions = false;
            newState.questionsHasErrors = true;
            return newState;
        },
        updateResults: (state: PracticeState) => {
            const newState = { ...state };

            newState.loadingResults = true;
            return newState;
        },
        updateResultsSuccess: (state: PracticeState, { payload } ) => {
            const newState = { ...state };

            newState.loadingResults = false;
            newState.resultsHasErrors = false;

            newState.results = [ ...newState.results, payload.results ];

            return newState;
        },
        updateResultsFailure: (state: PracticeState) => {
            const newState = { ...state };

            newState.loadingResults = false;
            newState.resultsHasErrors = true;
            return newState;
        },
        clearAllResults: (state: PracticeState) => {
            const newState = { ...state };
            const clearedResults = {
                loadingResults: false,
                resultsHasErrors: false,
                results: []
            }

            return { ...newState, ...clearedResults }
        }
    }
})

export const practiceSelector = (state: any) => state.practice;

const { actions, reducer } = practiceSlice;

export const { 
    setPractice, 
    setPracticeSuccess, 
    setPracticeFailure,
    updateResults,
    updateResultsFailure,
    updateResultsSuccess,
    clearAllResults
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

            history.push(`/${username}/practice/${lang}/${mode}`, {mode});
            dispatch(setPracticeSuccess({phrases}));
        } catch (err) {
            console.log(err);
            dispatch(setPracticeFailure());
            dispatch(sendMessage('Failed to create practice session'));
        }
    }
}

export function updatePhraseStrength( userId: string, phraseId: string, result: 1 | -1) {
    const body = { userId, phraseId, result };
    
    return async (dispatch: Function) => {
        dispatch(updateResults());

        try {
            const response = await fetch(`/api/phrases/${phraseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const { phrase, change, result } = await response.json();

            let results = { phrase, change, result };

            dispatch(updateResultsSuccess({results}))
        } catch(err) {
            console.log(err);
            dispatch(updateResultsFailure());
        }
    }
}

export function clearResults() {
    return async (dispatch: Function) => {
        dispatch(clearAllResults());
    }
}

export default reducer;
