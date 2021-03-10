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
    test('renders nothing due to nothing being selected', () => {
        const { container } = render(
            <TestRouter>
                <DefinePhraseButton />
            </TestRouter>,
            { initialState }
        );
    
        // const translateBtn = screen.getByRole('button', {name: 'Translate with Google' });
        const translateBtn = screen.queryByText('Translate with Google');
    
        // expect(translateBtn).toHaveAttribute('aria-hidden', true);
        expect(translateBtn).not.toBeInTheDocument();
    });
})