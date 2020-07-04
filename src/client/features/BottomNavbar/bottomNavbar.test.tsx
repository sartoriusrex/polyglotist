import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from 'test-utils';
import history from '../../app/history';
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
  test('Renders 4 links and properly navigates between them.', () => {
    const { container } = render(<BottomNavbar />, {
      initialState: initialState,
    });

    const links: HTMLAnchorElement[] | null = Array.from(
      container.querySelectorAll('a')
    );

    if (links !== null) {
      expect(links.length).toBe(4);
      expect(links[0].pathname).toBe('/username5/dashboard');
      expect(links[1].pathname).toBe('/username5/words');
      expect(links[2].pathname).toBe('/username5/articles');
      expect(links[3].pathname).toBe('/username5/practice');
    }

    fireEvent.click(links[1]);
    expect(history.location.pathname).toBe('/username5/words');

    fireEvent.click(links[2]);
    expect(history.location.pathname).toBe('/username5/articles');

    fireEvent.click(links[3]);
    expect(history.location.pathname).toBe('/username5/practice');

    fireEvent.click(links[0]);
    expect(history.location.pathname).toBe('/username5/dashboard');
  });
});
