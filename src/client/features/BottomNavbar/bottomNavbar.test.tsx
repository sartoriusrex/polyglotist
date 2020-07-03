import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from 'test-utils';
// import { renderInRouter } from 'test-router';

import BottomNavbar from './index';

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

describe('Bottom Navbar', () => {
  test('Renders 4 links', () => {
    render(<BottomNavbar />, { initialState: initialState });

    screen.debug();
  });
});
