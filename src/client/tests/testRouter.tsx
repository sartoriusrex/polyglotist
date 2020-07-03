import history from '../app/history';
import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';

export const renderInRouter = (Comp: React.FC) =>
  render(
    <Router history={history}>
      <Comp />
    </Router>
  );
