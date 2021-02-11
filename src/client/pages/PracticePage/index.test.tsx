import React from 'react';
import { render, screen, fireEvent, cleanup } from 'test-utils';
import { 
    auth,
    settings,
    phrases
 } from 'states';

import PracticePage from './index';

jest.mock('../../slices/practice', () => {
    const practiceSliceModule = jest.requireActual('../../slices/practice');
  
    return {
      __esModule: true,
      ...practiceSliceModule,
      createSession: jest.fn().mockReturnValue({ type: null }),
    };
});
  
import { createSession } from '../../slices/practice';
import { start } from 'repl';

const initialState = {
    auth,
    settings,
    phrases
};

afterEach(() => cleanup())

describe('PracticePage', () => {
    test('renders with all buttons able', () => {
        const { container } = render(<PracticePage />, { initialState });

        const allBtn = screen.getByLabelText('All');
        const frenchBtn = screen.getByLabelText('French');
        const spanishBtn = screen.getByLabelText('Spanish');

        expect(allBtn).toBeInTheDocument();
        expect(frenchBtn).toBeInTheDocument();
        expect(spanishBtn).toBeInTheDocument();

        const timedBtn = screen.getByLabelText('Timed');
        const untimedBtn = screen.getByLabelText('Untimed');

        expect(timedBtn).toBeInTheDocument();
        expect(untimedBtn).toBeInTheDocument();
    });

    test('allows users to create practice session', () => {
        const { container } = render(<PracticePage />, { initialState });

        const startSessionBtn = screen.getByRole('button',{ name: 'Start' });
        expect( startSessionBtn ).toBeInTheDocument();
        fireEvent.click(startSessionBtn);
        expect(createSession).toHaveBeenCalled();
    })

    test('buttons are disabled when no language phrases saved', () => {
        const state = {...initialState, ...{ phrases: { phrases: [] }}};
        const { container } = render(<PracticePage />, { initialState: state } );

        const allBtn = screen.getByLabelText('All');
        const frenchBtn = screen.getByLabelText('French');
        const spanishBtn = screen.getByLabelText('Spanish');
        const startBtn = screen.getByRole('button', { name: 'Saved some phrases to practice first' })

        expect(frenchBtn).toBeInTheDocument();
        expect(spanishBtn).toBeInTheDocument();
        expect(startBtn).toBeInTheDocument();

        expect(startBtn).toBeDisabled();
        expect(allBtn).toBeDisabled();
        expect(frenchBtn).toBeDisabled();
        expect(spanishBtn).toBeDisabled();
    })
})