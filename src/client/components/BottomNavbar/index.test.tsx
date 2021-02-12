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
    })
});