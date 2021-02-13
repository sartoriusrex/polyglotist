import React from 'react';
import { render, screen, fireEvent, cleanup } from 'test-utils';
import TestRouter from 'test-router';

import { auth, articles } from 'states';

import DefinePhraseButton from './index';

jest.mock('../../slices/articles', () => {
    const articleSlice = jest.requireActual('../../slices/articles');

    return {
        __esModule: true,
        ...articleSlice,
        addOneArticle: jest.fn().mockReturnValue({ type: null }),
      };
})

import { addOneArticle } from '../../slices/articles';

const initialState = {
    auth
}

afterEach(() => cleanup());

describe('Define Phrase Button', () => {
    const { container } = render(
        <TestRouter>
            <DefinePhraseButton />
        </TestRouter>,
        { initialState }
    );
})