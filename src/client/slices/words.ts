import { createSlice } from '@reduxjs/toolkit';

interface wordsStateInterface {
  loading: boolean;
  hasErrors: boolean;
  // words: { title: string; url: string; body: string[] }[] || null;
}

export const initialState: wordsStateInterface = {
  loading: false,
  hasErrors: false,
  // words: null,
};
