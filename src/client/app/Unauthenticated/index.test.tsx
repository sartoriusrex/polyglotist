import React from 'react';
import { render, screen, fireEvent } from 'test-utils';
import TestRouter from 'test-router';
import history from '../history';

import UnauthenticatedApp from './index';

describe('Uauthenticated App', () => {
  test('renders the Landing Page', async () => {
    const { container } = render(
      <TestRouter>
        <UnauthenticatedApp />
      </TestRouter>,
      { initialState: {} }
    );
    console.log(history.location.pathname);

    history.push('/login');

    expect(history.location.pathname).toBe('/login');

    // expect(history.location.pathname).toBe('/username5/create_account');

    // history.push('/username5/settings');

    // expect(history.location.pathname).toBe('/username5/create_account');
  });
});
