import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import history from '../../../app/history';
import TestRouter from 'test-router';

import GoBackButton from './index';

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
