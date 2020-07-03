import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import history from '../../../app/history';
import { renderInRouter } from '../../../tests/testRouter';

import GoBackButton from './index';

const render = () => renderInRouter(GoBackButton);

describe('GoBack button', () => {
  test('Renders a button', async () => {
    history.push('/test');

    render();

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(history.location.pathname).toBe('/');
  });
});
