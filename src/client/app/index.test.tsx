import React from 'react';
import { render, screen, cleanup } from 'test-utils';
import App from './index';

const initialState = {
  auth: {
    loading: false,
    hasErrors: false,
    user: {
      id: 4,
      username: 'username5',
      email: 'test5@test.com',
    },
  },
};

afterEach(() => cleanup());

describe('Top level Application, which renders Authenticated or Unauthenticated App', () => {
  test('Renders the AuthenticatedApp when initialState has a user', async () => {
    render(<App />, { initialState });

    screen.debug();
  });

  test('Renders the UnauthenticatedApp when no user state is present', async () => {
    render(<App />, {});

    screen.debug();
  });
});
