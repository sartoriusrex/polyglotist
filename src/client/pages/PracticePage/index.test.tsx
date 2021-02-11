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

        expect(allBtn).toBeInTheDocument();
    });

    test('allows users to create practice session', () => {
        const { container } = render(<PracticePage />, { initialState });

        const startSessionBtn = screen.getByRole('button',{ name: 'Start' });
        expect( startSessionBtn ).toBeInTheDocument();
        fireEvent.click(startSessionBtn);
        expect(createSession).toHaveBeenCalled();
    })
})