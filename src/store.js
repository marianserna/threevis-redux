import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import reducer from './reducer';

export default createStore(
  reducer,
  // initial state
  {
    visible: false,
    positionX: 50,
    positionY: 50,
    projectKey: ''
  },
  // before actions
  composeWithDevTools(applyMiddleware(thunk))
);
