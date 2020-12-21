import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import history from '../../app/history';
import TestRouter from 'test-router';

import GoBackButton from './index';

afterEach(() => cleanup());

describe('GoBack button', () => {
  test('Renders a button', async () => {
    history.push('/test');

    render(
      <TestRouter>
        <GoBackButton />
      </TestRouter>
    );

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(history.location.pathname).toBe('/');
  });
});
