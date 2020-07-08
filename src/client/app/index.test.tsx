import React from 'react';
import { render, screen, cleanup } from 'test-utils';
import App from './index';

jest.mock('../slices/auth', () => {
  const authSliceModule = jest.requireActual('../slices/auth');

  return {
    __esModule: true,
    ...authSliceModule,
    login: jest.fn().mockReturnValue({ type: null }),
  };
});

import { login, authSelector } from '../slices/auth';

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
    const { container } = render(<App />, { initialState });

    expect(login).toHaveBeenCalled();
  });

  test('Renders the UnauthenticatedApp when no user state is present', async () => {
    const { container } = render(<App />, {});

    expect(login).toHaveBeenCalled();
  });
});
