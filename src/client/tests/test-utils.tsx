import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer as reducer } from '../reducers';
import history from '../app/history';

function customRender(
  ui: any,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  }: { initialState?: any; store?: any } = {}
) {
  function Wrapper({ children }: { children?: any }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
