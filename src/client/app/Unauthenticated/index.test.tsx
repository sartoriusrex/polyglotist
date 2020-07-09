import React from 'react';
import { render, screen, fireEvent } from 'test-utils';
import TestRouter from 'test-router';
import history from '../history';

import UnauthenticatedApp from './index';

beforeEach(() => {
  const { container } = render(
    <TestRouter>
      <UnauthenticatedApp />
    </TestRouter>,
    { initialState: {} }
  );
});

describe('Uauthenticated App', () => {
  test('renders the Landing Page', async () => {
    expect(
      screen.getByRole('heading', {
        name: /A simple app for expanding your foreign vocabulary./i,
      })
    ).toBeInTheDocument();
  });

  test('renders the login page after navigating there', async () => {
    history.push('/login');

    expect(history.location.pathname).toBe('/login');

    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
  });

  test('renders the signup page after navigating there', async () => {
    history.push('/signup');

    expect(history.location.pathname).toBe('/signup');
    expect(
      screen.getByRole('heading', { name: /create account/i })
    ).toBeInTheDocument();
  });

  test('renders the login page when attempting to navigate to a dashboard', async () => {
    history.push('/username5/dashboard');

    expect(history.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
  });

  test('renders the NoMatch page when attempting to navigate to a nonexistant route', async () => {
    history.push('thisRouteDoesntExist');
    expect(
      screen.getByRole('heading', { name: /This Page Does Not Exist/i })
    ).toBeInTheDocument();
  });
});
