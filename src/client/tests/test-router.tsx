import history from '../app/history';
import React from 'react';
import { Router } from 'react-router-dom';

const TestRouter = ({ children }: { children?: any }) => (
  <Router history={history}>{children}</Router>
);

export default TestRouter;
