import React from 'react';
import { render, screen, fireEvent, cleanup } from 'test-utils';
import TestRouter from 'test-router';
import history from '../../app/history';

import BottomNavbar from './index';
import { auth } from 'states';

const initialState = {
    auth
}

afterEach(() => cleanup());

describe('Bottom navbar', () => {
    test('renders all links correctly', () => {
        const { container } = render(
            <TestRouter>
                <BottomNavbar />
            </TestRouter>,
            { initialState }
        );

        const links = screen.getAllByRole('link');

        expect(links).toHaveLength(4);
        expect(links[0]).toHaveAttribute('href', '/username5/dashboard');
        expect(links[1]).toHaveAttribute('href', '/username5/phrases');
        expect(links[2]).toHaveAttribute('href', '/username5/articles');
        expect(links[3]).toHaveAttribute('href', '/username5/practice');
    })
});