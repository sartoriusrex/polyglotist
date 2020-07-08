import React from 'react';
import { render, screen, cleanup } from 'test-utils';

import UnauthenticatedApp from './index';

const initialState = {};

describe('Unauthenticated App', () => {
  test('renders the router, navbar, and langing page', async () => {
    const { container } = render(<UnauthenticatedApp />, { initialState });

    screen.debug();
  });
});
