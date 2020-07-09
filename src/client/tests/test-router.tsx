import React from 'react';
import { Router } from 'react-router-dom';
import history from '../app/history';

const TestRouter = ({ children }: { children?: any }) => (
  <Router history={history}>{children}</Router>
);

export default TestRouter;
