import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

import store from '../../reducers';

import BottomNavbar from './index';

describe('Bottom Navbar', () => {
  test('Renders 4 links', () => {
    render(<BottomNavbar />);
  });
});
