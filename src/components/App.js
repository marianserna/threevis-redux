import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './Main';
import Project from './Project';

import { Provider } from 'react-redux';
import store from '../store';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Route exact path="/" component={Main} />
            <Route path="/projects/:slug" component={Project} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}
