import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import reducer from './reducer';

export default createStore(
  reducer,
  // initial state
  // {
  //   birds: []
  // },
  // before actions
  composeWithDevTools(applyMiddleware(thunk))
);
