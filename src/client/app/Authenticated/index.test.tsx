import React from 'react';
import { render, screen, fireEvent } from 'test-utils';
import TestRouter from 'test-router';
import history from '../history';

import AuthenticatedApp from './index';

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

const initialStateWithSettings = {
  ...initialState,
  settings: {
    languagesLearning: ['french', 'spanish'],
  },
};

describe('Authenticated App', () => {
  test('renders the CreateAccount Page', async () => {
    history.push('/username5/dashboard');

    const { container } = render(
      <TestRouter>
        <AuthenticatedApp />
      </TestRouter>,
      { initialState }
    );

    expect(history.location.pathname).toBe('/username5/create_account');

    history.push('/username5/settings');

    expect(history.location.pathname).toBe('/username5/create_account');
  });

  test('renders the Dashboard Page', async () => {
    history.push('/username5/dashboard');

    window.scrollTo = jest.fn();

    const { container, getByRole } = render(
      <TestRouter>
        <AuthenticatedApp />
      </TestRouter>,
      { initialState: initialStateWithSettings }
    );

    expect(window.scrollTo).toHaveBeenCalled();
    expect(history.location.pathname).toBe('/username5/dashboard');
    const button = getByRole('button', { name: /username5/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('renders the noMatchComponent', async () => {
    window.scrollTo = jest.fn();

    const { container, getByRole } = render(
      <TestRouter>
        <AuthenticatedApp />
      </TestRouter>,
      { initialState: initialStateWithSettings }
    );

    history.push('/thisShouldNotBeARoute');

    const heading = getByRole('heading', { name: /This Page Does Not Exist/i });
    expect(heading).toBeInTheDocument();
  });
});
